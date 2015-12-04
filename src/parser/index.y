%{
    var schema = {
        '$schema': 'http://json-schema.org/draft-04/schema#'
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
    | SC? content EOF {
        if ($1) {
            var startComment = yy.parseComment($1);
            if (startComment.url) {
                schema.id = startComment.url;
            }
        }
        schema.type = Array.isArray($2) ? 'array' : 'object';
        console.warn(yy.safeStringify(schema, null ,4));
        return $2;
    }
;

content
    : nullLiteral
    | booleanLiteral
    | numberLiteral
    | stringLiteral
    | identLiteral
    | objectLiteral {
    }
    | arrayLiteral {
    }
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
        $$ = Number(yytext);
    }
;

stringLiteral
    : STRING {
        $$ = yytext.replace(/\\(\\|")/g, '$' + '1')
                .replace(/\\n/g,'\n')
                .replace(/\\r/g,'\r')
                .replace(/\\t/g,'\t')
                .replace(/\\v/g,'\v')
                .replace(/\\f/g,'\f')
                .replace(/\\b/g,'\b');
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
        // $$ = {};
        // $$[$1[0]] = $1[1];
        // $$ = $1;
        $$ = {};
        $$[$1.key] = $1.val;
    }
    | objectMemberList COMMA objectMember {
        // $$ = $1;
        // $1[$3[0]] = $3[1];

        $1[$3.key] = $3.val;
        $$ = $1;
    }
;

objectMember
    : SC? (stringLiteral|identLiteral) COLON content {
        var tmp = {
            key: $2,
            val: $4
        };

        if ($1) {
            tmp.comment = $1;
        }
        $$ = tmp;
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
    : SC? content {
        // $1 && console.warn($1);
        $$ = [$2];
    }
    | arrayMemberList COMMA SC? content {
        // $3 && console.warn($3);
        // console.warn($1, 'sdsd');
        $1.push($4);
        $$ = $1;
    }
;