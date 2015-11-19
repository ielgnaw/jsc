
number  \d+
space   [ \s\t]+
n       \n+


%{
    var debug = require('debug')('jison-lesslint: lexer');
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

// b 进入选择器内部即块的状态
// sb 进入选择器内部子选择器内部即子块的状态
// p 进入属性的状态，这个状态用来帮助找到属性的值

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


