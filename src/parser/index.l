
int                         "-"?([0-9]|[1-9][0-9]+)
exp                         [eE][-+]?[0-9]+
frac                        "."[0-9]+
number                      {int}{frac}?{exp}?\b
space                       [ \s\t]+
n                           \n+

ident                       [a-zA-Z_0-9]+
/*'"*/ // 这个注释是为了把 ident 的正则所带来的高亮影响给去掉
string1                     \"([^\n\r\f\\"])*\"
/*"*/ // 这个注释是为了把 string1 的正则所带来的高亮影响给去掉
string2                     \'([^\n\r\f\\'])*\'
/*'*/ // 这个注释是为了把 string2 的正则所带来的高亮影响给去掉
string                      {string1}|{string2}

leftBrace                   \{
rightBrace                  \}

leftSbracket                \[
rightSbracket               \]

singlecomment               \/\/[^\n]*

colon                       ':'
comma                       ','


%{
    var debug = require('debug')('jsc: lexer');
    var s, s2, s3;
    var rv, rv2, e_offset, col, row, len, value;
    var match, match2;
    debug(YY_START);
%}


// 状态：
// %s 指包容性的状态，%x 指非包容性的状态
// 如果是包容性的状态，那么没有状态的规则也会被激活；如果是非包容的，那么只有声明了相应状态的规则才会被激活。

// s 开始状态
// sc 进入单行注释的状态
%x s sc

%%

<s>{space} {
    // ignore whitespace
};

<s>{n} {
     // ignore \n
};

/**
 * singlecomment
 */
<s>{singlecomment} {
    yytext = yytext.replace(/\/\/\s*/, '');
    if (this.topState() !== 'sc') {
        this.begin('sc');
    }
    return 'SC';
};

<sc>{n} {
    this.popState();
};


<s>'true' {
    return 'TRUE';
};

<s>'false' {
    return 'FALSE';
};

<s>'null' {
    return 'NULL';
};


<s>{number} {
    return 'NUMBER';
};

<s>{string} {
    yytext = yytext.substr(1, yyleng - 2);
    return 'STRING';
};

<s>{ident} {
    return 'IDENT';
};

<s>{colon} {
    return 'COLON';
};

<s>{comma} {
    return 'COMMA';
};

<s>{leftSbracket} {
    return 'SBRACKET_START';
};

<s>{rightSbracket} {
    return 'SBRACKET_END';
};

<s>{leftBrace} {
    return 'BRACE_START';
};

<s>{rightBrace} {
    return 'BRACE_END';
};


<s><<EOF>> {
    this.popState();
    return 'EOF';
};

<INITIAL><<EOF>> {
    return 'EOF';
};

<INITIAL> {
    this.begin('s');
};


