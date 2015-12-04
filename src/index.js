// import chalk from 'chalk';
import parserMod from './parser';
import safeStringify from 'json-stringify-safe';


let parser = parserMod.parser;
parser.yy = {
    test(t) {
        if (t) {
            return 1;
        }
        return 2;
    },

    safeStringify: safeStringify,

    /**
     * 分析注释内容
     * // key1:val1;key2:val2;...
     *
     * @param {Array} arr 注释内容，代表一个键值对的注释配置，数组中每一个 item 代表一行的注释
     */
    parseComment(arr) {
        let comment = {};
        let arrIndex = -1;
        let arrLen = arr.length;
        let str;
        while (++arrIndex < arrLen) {
            str = arr[arrIndex].replace(/;$/, '');
            let segments = str.split(';');
            let i = -1;
            let len = segments.length;

            while (++i < len) {
                /([^:]*):(.*)/.test(segments[i]);
                if (RegExp.$1) {
                    comment[RegExp.$1] = RegExp.$2;
                }
            }
        }
        return comment;
    }
};

// 引入的时候 import {p} from './index';
// export {
    // parser as p
// };

// 引入的时候 import p from './index';
export default parser;
