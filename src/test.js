'use strict';

import {join, sep} from 'path';
import {readFileSync, writeFileSync} from 'fs';
import safeStringify from 'json-stringify-safe';
import debugMod from 'debug';

// import {p} from './index';
import p from './index';

let debug = debugMod('jsc');

let content = readFileSync(
    // join(__dirname, '..') + sep + 'test/fixture' + sep + 'data1.js',
    join(__dirname, '..') + sep + 'test/fixture' + sep + 'data4.js',
    'utf8'
);

content = content.replace(/\r\n?/g, '\n');

// try {
//     p.parse(content)
// } catch (e) {
//     console.warn(e,' eeeeeeeeeeeee');
// }

let parserRet = safeStringify(p.parse(content), null, 4);
var jisonAstFile = join(__dirname, '..') + sep + 'result.json';
writeFileSync(jisonAstFile, parserRet);
debug('Parse Result JSON saved to %s', jisonAstFile);

// console.warn(parserRet, 'ppp');

export var ret = parseInt(parserRet, 10);