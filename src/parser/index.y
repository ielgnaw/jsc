%{
    var schema = {
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'id': 'http://jsonschema.net'
    };
%}


%start root

/* enable EBNF grammar syntax */
%ebnf

%%

root
    : EOF {
        $$ = '';
    }
    | SC* content EOF {
        if ($1) {
            var startComment = yy.parseComment($1);
            for (var i in startComment) {
                if (i === 'url') {
                    schema.id = startComment[i];
                }
                else {
                    schema[i] = startComment[i];
                }
            }
        }

        schema.type = $2.type;

        var properties = $2.properties;
        if (properties) {
            schema.properties = {};
            yy.analyzeParent4Obj(properties, schema.properties);
        }

        var items = $2.items;
        if (items) {
            schema.items = [];
            yy.analyzeParent4Arr(items);
        }

        console.warn(yy.stringify($2, schema.id), '33');

        console.warn(yy.stringify(schema, schema.id));
        return yy.extend(schema, JSON.parse(yy.stringify($2, schema.id)));
    }
;

content
    : nullLiteral
    | booleanLiteral
    | numberLiteral
    | stringLiteral
    // | identLiteral
    | objectLiteral
    | arrayLiteral
;

nullLiteral
    : NULL {
        $$ = {
            type: 'null',
            value: null
        };
    }
;

booleanLiteral
    : TRUE {
        $$ = {
            type: 'boolean',
            value: true
        };
    }
    | FALSE {
        $$ = {
            type: 'boolean',
            value: false
        };
    }
;

numberLiteral
    : NUMBER {
        $$ = {
            type: 'integer',
            value: Number(yytext)
        }
    }
;

stringLiteral
    : STRING {
        yytext = yytext.replace(/\\(\\|")/g, '$' + '1')
            .replace(/\\n/g,'\n')
            .replace(/\\r/g,'\r')
            .replace(/\\t/g,'\t')
            .replace(/\\v/g,'\v')
            .replace(/\\f/g,'\f')
            .replace(/\\b/g,'\b');
        $$ = {
            type: 'string',
            value: yytext
        };
    }
;

identLiteral
    : IDENT {
        $$ = {
            type: 'string',
            value: yytext
        };
    }
;

objectLiteral
    : BRACE_START BRACE_END {
        $$ = {};
    }
    | BRACE_START objectMemberList BRACE_END {
        $$ = $2;
    }
;

objectMemberList
    : objectMember {
        $$ = {
            type: 'object',
            properties: {}
        };
        $1[1].id = '$schemaId-' + $1[0];
        $$.properties[$1[0]] = $1[1];
        yy.extend($$.properties[$1[0]], $1[2]);
    }
    | objectMemberList COMMA objectMember {
        $$ = $1;
        $3[1].id = '$schemaId-' + $3[0];
        $1.properties[$3[0]] = $3[1];
        yy.extend($1.properties[$3[0]], $3[2]);
    }
;

objectMember
    : SC* (stringLiteral|identLiteral) COLON content {
        if ($4.type === 'object') {
            for (var i in $4.properties) {
                $4.properties[i].parent = $2.value;
            }
        }
        var objectComment = {};
        if ($1) {
            objectComment = yy.parseComment($1);
        }
        $$ = [$2.value, $4, objectComment];
    }
;

arrayLiteral
    : SBRACKET_START SBRACKET_END {
        $$ = {
            type: 'array',
            id: '$schemaId-',
            items: []
        };
    }
    | SBRACKET_START arrayMemberList SBRACKET_END {
        $$ = $2;
    }
;

arrayMemberList
    : SC* content {
        $$ = {
            type: 'array',
            items: []
        };
        $2.id = '$schemaId-' + $$.items.length;
        var arrayComment = {};
        if ($1) {
            arrayComment = yy.parseComment($1);
        }
        yy.extend($2, arrayComment);
        $$.items.push($2);
    }
    | arrayMemberList COMMA SC* content {
        $4.id = '$schemaId-' + $1.items.length;
        var arrayComment = {};
        if ($3) {
            arrayComment = yy.parseComment($3);
        }
        yy.extend($4, arrayComment);
        $1.items.push($4);
        $$ = $1;
    }
;