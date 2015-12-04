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
        $$ = null;
    }
;

booleanLiteral
    : TRUE {
        $$ = true;
    }
    | FALSE {
        $$ = false;
    }
;

numberLiteral
    : NUMBER {
        $$ = {
            val: Number(yytext),
            type: 'integer'
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
            val: yytext,
            type: 'string'
        }
    }
;

identLiteral
    : IDENT {
        $$ = $1;
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
        // console.warn($1);
        // schemaProperties[$1.key] = {
        //     id: '$schemaId-' + $1.key,
        //     type: $1.val.type
        // };
        // yy.extend(schemaProperties[$1.key], $1.comment);

        // if ($1.val.key) {
        //     delete schemaProperties[$1.val.key];
        //     schemaProperties[$1.key] = {
        //         id: '$schemaId-' + $1.key,
        //         type: 'object'
        //     };
        //     if (!schemaProperties[$1.key].properties) {
        //         schemaProperties[$1.key].properties = {};
        //     }
        //     schemaProperties[$1.key].properties[$1.val.key] = {
        //         id: '$schemaId-' + $1.key + '/' + $1.val.key,
        //         type: $1.val.val.type
        //     };
        //     yy.extend(schemaProperties[$1.key], $1.comment);
        // }
        // else {
        //     schemaProperties[$1.key] = {
        //         id: '$schemaId-' + $1.key,
        //         type: $1.val.type
        //     };
        //     yy.extend(schemaProperties[$1.key], $1.comment);
        // }
    }
    | objectMemberList COMMA objectMember {
        schemaProperties[$3.key] = {
            id: '$schemaId-' + $3.key,
            type: $3.val.type,
        };
        yy.extend(schemaProperties[$3.key], $3.comment);
    }
;

objectMember
    : SC* (stringLiteral|identLiteral) COLON content {
        if ($4.key) {
            $4.parent = $2;
        }
        var objectComment = {};
        if ($1) {
            objectComment = yy.parseComment($1);
        }
        $$ = {
            key: $2,
            val: $4,
            comment: objectComment
        };
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