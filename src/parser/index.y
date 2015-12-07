%{
    var schema = {
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'id': ''
    };

    var schemaProperties = {};
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
        if (Array.isArray($2)) {
            schema.type = 'array';
            schema.items = [];
        }
        else {
            schema.type = 'object';
            schema.properties = schemaProperties;
        }
        console.warn(yy.stringify($2, schema.id), '333');
        console.warn(yy.stringify(schema, schema.id));
        return $2;
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
        // $$ = Number(yytext);
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
        // $$ = yytext;
    }
;

identLiteral
    : IDENT {
        // $$ = $1;
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
        // $$ = {
        //     type: 'object'
        // };
        // $1[1].id = '$schemaId-' + $1[0];
        // $$[$1[0]] = $1[1];

        $$ = {
            type: 'object',
            id: '$schemaId-' + $1[0],
            properties: {}
        };
        $1[1].id = '$schemaId-' + $1[0];
        // if (!$$.properties) {
            // $$.properties = {};
        // }
        $$.properties[$1[0]] = $1[1];
        // $$.properties[$1[0]].comment = $1[2];
        yy.extend($$.properties[$1[0]], $1[2]);
    }
    | objectMemberList COMMA objectMember {
        // $$ = $1;
        // $3[1].id = '$schemaId-' + $3[0];
        // $1[$3[0]] = $3[1];

        $$ = $1;
        $3[1].id = '$schemaId-' + $3[0];
        $1.properties[$3[0]] = $3[1];
        // $1.properties[$3[0]].comment = $3[2];
        yy.extend($1.properties[$3[0]], $3[2]);
    }
;

objectMember
    : SC* (stringLiteral|identLiteral) COLON content {
        // console.warn($2);
        // console.warn($4);
        // console.warn('----');
        // $$ = {
        //     key: $2,
        //     value: $4,
        //     type: 'object'
        // };
        // var tmp = {};
        // tmp[$2] = $4;
        // $$ = tmp;

        if ($4.type === 'object') {
            for (var i in $4.properties) {
                // if (i !== 'type') {
                    $4.properties[i].parent = $2.value;
                // }
            }
        }

        var objectComment = {};
        if ($1) {
            objectComment = yy.parseComment($1);
        }
        // console.warn(objectComment);
        $$ = [$2.value, $4, objectComment];

        // $$ = {
        //     key: $2,
        //     value: $4,
        //     type: typeof $4
        // };

        // if ($4.key) {
        //     $4.key.parent = $2;
        // }
        // var objectComment = {};
        // if ($1) {
        //     objectComment = yy.parseComment($1);
        // }
        // $$ = {
        //     key: $2,
        //     value: $4,
        //     comment: objectComment
        // };
    }
;

arrayLiteral
    : SBRACKET_START SBRACKET_END {
        $$ = [];
    }
    | SBRACKET_START arrayMemberList SBRACKET_END {
        $$ = $2;
    }
;

arrayMemberList
    : SC* content {
        // $1 && console.warn($1);
        $$ = [$2];
    }
    | arrayMemberList COMMA SC* content {
        // $3 && console.warn($3);
        // console.warn($1, 'sdsd');
        $1.push($4);
        $$ = $1;
    }
;