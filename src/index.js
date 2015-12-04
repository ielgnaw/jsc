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

    stringify(schema, schemaId) {
        return safeStringify(schema, null, 4).replace(/\$schemaId-/g, schemaId + '/');
    },

    trim(str) {
        return str.replace(/(^\s+)|(\s+$)/g, '');
    },

    /**
     * 对象属性拷贝
     *
     * @param {Object} target 目标对象
     * @param {...Object} source 源对象
     *
     * @return {Object} 返回目标对象
     */
    extend(target) {
        var i = -1;
        var length = arguments.length;
        while (++i < length) {
            var src = arguments[i];
            if (src == null) {
                continue;
            }
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    target[key] = src[key];
                }
            }
        }
        return target;
    },

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
                var key = RegExp.$1;
                var val = RegExp.$2;
                if (key) {
                    comment[this.trim(key)] = this.trim(val);
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
