%{
    var util = require('util');
    var debug = require('debug')('jison-lesslint: grammar');

    var ast = {
    };

%}

%start root

/* enable EBNF grammar syntax */
%ebnf

%%

root
    : EOF {
        $$ = 0;
    }
    | stmts EOF {
        $$ = parseInt($1, 10);
    }
;

stmts
    : number_stmt
;

number_stmt
    : NUMBER {
        return parseInt($1, 10);
    }
    | SPACE NUMBER {
        return parseInt($2, 10);
    }
;
