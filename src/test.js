'use strict';

import {join, sep} from 'path';
import {readFileSync, writeFileSync, readdirSync, rmdirSync} from 'fs';
import safeStringify from 'json-stringify-safe';
import mkdirp from 'mkdirp';
import debugMod from 'debug';
// import {parser} from './index';

import * as util from './util';
import parser from './index';

let debug = debugMod('jsc');

let outputDir = join(__dirname, '..') + sep + 'test/output';
let testFixtureDir = join(__dirname, '..') + sep + 'test/fixture';

util.rmrfdirSync(outputDir).then(() => {
    mkdirp(outputDir, (err) => {
        if (err) {
            throw err;
        }

        readdirSync(testFixtureDir).forEach((file, index) => {
            // if (file !== 'data4.js' && file !== 'data3.js') {
            //     return;
            // }
            let content = readFileSync(testFixtureDir + sep + file, 'utf8');
            content = content.replace(/\r\n?/g, '\n');

            let parserRet;
            try {
                parserRet = safeStringify(parser.parse(content), null, 4);
                let outputFile = outputDir + sep + file.replace(/\.js$/, '.json');
                writeFileSync(outputFile, parserRet);
                debug('Parse Result JSON File saved to %s', outputFile);
            } catch (e) {
                console.warn(e,' eeeeeeeeeeeee');
                // throw e;
            }
        });

    });
});

export var ret = parseInt(5, 10);