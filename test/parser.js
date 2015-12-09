/**
 * @file 测试编译的功能
 * @author ielgnaw(wuji0223@gmail.com)
 */

'use strict';

var path = require('path');
var fs = require('fs');
var safeStringify = require('json-stringify-safe');
var mkdirp = require('mkdirp');
var debugMod = require('debug');

var util = require('../lib/util');
var parser = require('../lib/parser');

var debug = debugMod('jsc');

var outputDir = path.join(__dirname, '..') + path.sep + 'test/output';
var testFixtureDir = path.join(__dirname, '..') + path.sep + 'test/fixture';

util.rmrfdirSync(outputDir).then(function () {
    mkdirp(outputDir, function (err) {
        if (err) {
            throw err;
        }

        fs.readdirSync(testFixtureDir).forEach(function (file) {
            var content = fs.readFileSync(testFixtureDir + path.sep + file, 'utf8');
            content = content.replace(/\r\n?/g, '\n');

            try {
                var parserRet = safeStringify(parser.parse(content), null, 4);
                var outputFile = outputDir + path.sep + file.replace(/\.jsc$/, '.json');
                fs.writeFileSync(outputFile, parserRet);
                debug('Parse Result JSON File saved to %s', outputFile);
            }
            catch (e) {
                console.warn(e);
                throw e;
            }
        });

    });
});



// import {join, sep} from 'path';
// import {readFileSync, writeFileSync, readdirSync} from 'fs';
// import safeStringify from 'json-stringify-safe';
// import mkdirp from 'mkdirp';
// import debugMod from 'debug';
// // import {parser} from './parser';

// import {util} from '../src/util';
// import parser from '../src/parser';

// let debug = debugMod('jsc');

// let outputDir = join(__dirname, '..') + sep + 'test/output';
// let testFixtureDir = join(__dirname, '..') + sep + 'test/fixture';

// util.rmrfdirSync(outputDir).then(() => {
//     mkdirp(outputDir, (err) => {
//         if (err) {
//             throw err;
//         }

//         readdirSync(testFixtureDir).forEach((file) => {
//             let content = readFileSync(testFixtureDir + sep + file, 'utf8');
//             content = content.replace(/\r\n?/g, '\n');

//             try {
//                 let parserRet = safeStringify(parser.parse(content), null, 4);
//                 let outputFile = outputDir + sep + file.replace(/\.js$/, '.json');
//                 writeFileSync(outputFile, parserRet);
//                 debug('Parse Result JSON File saved to %s', outputFile);
//             }
//             catch (e) {
//                 console.warn(e);
//                 // throw e;
//             }
//         });

//     });
// });