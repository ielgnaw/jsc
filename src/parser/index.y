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
        console.warn(yy.stringify($2), '333');
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
        }
        // $$ = yytext;
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
        $$ = {
            type: 'object'
        };
        $$[$1[0]] = $1[1];
        // $$ = {};
        // if (!$$.value) {
        //     $$.value = {};
        // }
        // $$.value[$1[0]] = $1[1];
        // $$.type = 'object';
    }
    | objectMemberList COMMA objectMember {
        $$ = $1;
        $1[$3[0]] = $3[1];
        // $$ = $1;
        // $1.value[$3[0]] = $3[1];
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
        $$ = [$2.value, $4];

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