%{
    var util = require('util');
    var debug = require('debug')('jison-lesslint: grammar');

    var ast = {
    };

%}


%nonassoc COMMA

%start root

/* enable EBNF grammar syntax */
%ebnf

%%

root
    : EOF {
        $$ = '';
    }
    | content EOF {
        return $1;
    }
;

content
    : nullLiteral
    | booleanLiteral
    | numberLiteral
    | stringLiteral
    | identLiteral
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
        $$ = {};
        $$[$1[0]] = $1[1];
    }
    | objectMemberList COMMA objectMember {
        $$ = $1;
        $1[$3[0]] = $3[1];
    }
;

objectMember
    : (stringLiteral|identLiteral) COLON content {
        $$ = [$1, $3];
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
    : content {
        $$ = [$1]
    }
    | arrayMemberList COMMA content {
        $1.push($3);
        $$ = $1;
    }
;