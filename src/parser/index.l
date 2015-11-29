
number                      \d+
space                       [ \s\t]+
n                           \n+

string1                     \"([^\n\r\f\\"])*\"
/*"*/ // 这个注释是为了把 string1 的正则所带来的高亮影响给去掉
string2                     \'([^\n\r\f\\'])*\'
/*'*/ // 这个注释是为了把 string2 的正则所带来的高亮影响给去掉
string                      {string1}|{string2}

leftBrace                   \{
rightBrace                  \}


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
%x s

%%

<s>{number} {
    return 'NUMBER';
};

<s>{space}/<<EOF>> {
    this.popState();
    return 'EOF';
};

<s>{space} {
    return 'SPACE';
};

<s>{n}/<<EOF>> {
    return 'EOF';
};

<s>{n} {
    return 'N';
};

<s>{string} {
    yytext = yytext.substr(1, yyleng - 2);
    return 'STRING';
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


