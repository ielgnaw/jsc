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
     * @param {string} str 注释内容字符串
     */
    parseComment(str) {
        str = str.replace(/;$/, '');
        let segments = str.split(';');
        let i = -1;
        let len = segments.length;
        let comment = {};
        while (++i < len) {
            /([^:]*):(.*)/.test(segments[i]);
            if (RegExp.$1) {
                comment[RegExp.$1] = RegExp.$2;
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
