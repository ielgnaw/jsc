/**
 * @file cli
 * @author ielgnaw(wuji0223@gmail.com)
 */

'use strict';

import chalk from 'chalk';
import {readFileSync, existsSync} from 'fs';
import {join} from 'path';
import minimist from 'minimist';
import sys from '../package';
import {formatMsg, getCandidates} from './util';

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
            'default': {
                output: './output'
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
    candidates.forEach((candidate) => {
        console.warn(candidate);
        let file = {
            content: readFileSync(candidate, 'utf-8'),
            path: candidate
        };
    });


    // // 错误信息的集合
    // var errors = [];

    // var patterns = [
    //     '**/*.less',
    //     '!**/{output,test,node_modules,asset,dist,release,doc,dep,report}/**'
    // ];

    // var candidates = util.getCandidates(args, patterns);

    // var count = candidates.length;

    // if (count) {

    //     *
    //      * 每个文件的校验结果回调，主要用于统计校验完成情况
    //      *
    //      * @inner

    //     var callback = function () {
    //         count--;
    //         if (!count) {
    //             report(errors);
    //         }
    //     };

    //     // 遍历每个需要检测的 less 文件
    //     candidates.forEach(
    //         function (candidate) {
    //             var file = {
    //                 content: fs.readFileSync(
    //                     candidate,
    //                     'utf-8'
    //                 ),
    //                 path: candidate
    //             };
    //             require('./checker').check(file, errors, callback);
    //         }
    //     );
    // }

};