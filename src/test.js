import {join, sep} from 'path';
import {readFileSync, writeFileSync} from 'fs';
import safeStringify from 'json-stringify-safe';
import debugMod from 'debug';

// import {p} from './index';
import p from './index';

let debug = debugMod('jsc');

let content = readFileSync(
    join(__dirname, '..') + sep + 'src/test.less',
    'utf8'
);

content = content.replace(/\r\n?/g, '\n');

let parserRet = safeStringify(p.parse(content), null, 4);

console.warn(parserRet, 'ppp');

export var ret = parseInt(parserRet, 10);