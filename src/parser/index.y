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
    | JSONText EOF {
        console.warn($1, '000');
        return $1;
        // $$ = parseInt($1, 10);
    }
;

JSONText
    : JSONObject
;

JSONObject
    : BRACE_START BRACE_END {
        return {};
    }
    | BRACE_START JSONMemberList BRACE_END {
        $$ = $2;
    }
;

JSONMemberList
    : JSONMember
        {{$$ = {}; $$[$1[0]] = $1[1];}}
    | JSONMemberList ',' JSONMember
        {$$ = $1; $1[$3[0]] = $3[1];}
    ;

JSONMember
    : JSONString COLON JSONValue
        {$$ = [$1, $3];}
    ;

JSONValue
    : JSONString
;
    // : JSONNullLiteral
    // | JSONBooleanLiteral
    // | JSONString
    // | JSONNumber
    // | JSONObject
    // | JSONArray
    // ;

JSONString
    : STRING
        {
            // replace escaped characters with actual character
            $$ = yytext.replace(/\\(\\|")/g, '$' + '1')
                    .replace(/\\n/g,'\n')
                    .replace(/\\r/g,'\r')
                    .replace(/\\t/g,'\t')
                    .replace(/\\v/g,'\v')
                    .replace(/\\f/g,'\f')
                    .replace(/\\b/g,'\b');
        }
    ;
