/**
 * @file cli
 * @author ielgnaw(wuji0223@gmail.com)
 */

'use strict';

import chalk from 'chalk';
import safeStringify from 'json-stringify-safe';
import minimist from 'minimist';
import debugMod from 'debug';
import {readFileSync, writeFileSync} from 'fs';
import {sep, basename} from 'path';
import sys from '../package';
import {formatMsg, getCandidates} from './util';
import mkdirp from 'mkdirp';
import parser from './parser';

const DEFAULT_OUTPUT = './jscOutput';

let debug = debugMod('jsc');

/**
 * 显示默认的信息
 */
function showDefaultInfo() {
    console.log('');
    console.log(sys.name + ' v' + sys.version);
    console.log(chalk.bold.green(formatMsg(sys.description)));
}

/**
 * 解析参数。作为命令行执行的入口
 *
 * @param {Array} args 参数列表
 */
export function parse(args) {

    args = args.slice(2);

    let options = minimist(
        args || [],
        {
            'string': ['_', 'output'],
            'default': {
                output: DEFAULT_OUTPUT
            },
            'alias': {
                o: 'output',
                v: 'version'
            }
        }
    );

    if (options.v) {
        showDefaultInfo();
        return;
    }

    // 不带参数时，默认检测当前目录下文件
    if (!options._.length) {
        options._.push('.');
    }

    let patterns = [
        '**/*.jsc',
        '!**/{output,test,node_modules,asset,dist,release,doc,dep,report,coverage}/**'
    ];

    let candidates = getCandidates(options._, patterns);

    if (!candidates.length) {
        return;
    }

    let outputDir = process.cwd() + sep + (options.o || DEFAULT_OUTPUT);
    mkdirp(outputDir, (err) => {
        if (err) {
            throw err;
        }

        candidates.forEach((file) => {
            let content = readFileSync(file, 'utf8');
            content = content.replace(/\r\n?/g, '\n');
            try {
                let parserRet = safeStringify(parser.parse(content), null, 4);
                let outputFile = outputDir + sep + basename(file).replace(/\.jsc$/, '.json');
                writeFileSync(outputFile, parserRet);
                debug('Parse Result JSON File saved to %s', outputFile);
            }
            catch (e) {
                console.warn(e);
                // throw e;
            }
        });
    });
}