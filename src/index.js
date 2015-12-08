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

    /**
     * 序列化 JSON 对象，调试用
     *
     * @param {Object} schema 待序列化的 json 对象
     * @param {string} schemaId 关键字用于替换
     *
     * @return {string} 序列化后的字符串
     */
    stringify(schema, schemaId) {
        return safeStringify(schema, null, 4).replace(/\$schemaId-/g, schemaId + '/');
    },

    /**
     * 去除空格
     *
     * @param {string} str 待去除空格的字符串
     *
     * @return {string} 去除空格后的字符串
     */
    trim(str) {
        return str.replace(/(^\s+)|(\s+$)/g, '');
    },

    /**
     * 递归分析对象中的 parent
     *
     * @param {Object} properties 源属性
     * @param {Object} targetProperties 目标属性
     * @param {string} defaultParent 默认的一个 parent，初始时为空
     */
    analyzeParent4Obj(properties, targetProperties, defaultParent = '') {
        for (let i in properties) {
            if (properties.hasOwnProperty(i)) {
                delete properties[i].value;
                let parent = properties[i].parent;
                delete properties[i].parent;
                if (parent) {
                    let id = properties[i].id.replace('$schemaId-', '');
                    properties[i].id = ''
                        + '$schemaId-'
                        + (defaultParent ? defaultParent + '/' : '')
                        + parent
                        + '/'
                        + id;
                }
                targetProperties[i] = properties[i];
                if (properties[i].properties) {
                    if (defaultParent) {
                        defaultParent += ('/' + (parent || ''));
                    }
                    else {
                        defaultParent = (parent || '');
                    }
                    if (!targetProperties[i].properties) {
                        targetProperties[i].properties = {};
                    }
                    this.analyzeParent4Obj(
                        properties[i].properties,
                        targetProperties[i].properties,
                        defaultParent
                    );
                }
            }
        }
    },

    /**
     * 递归分析数组中的 parent
     *
     * @param {Array} items 源属性
     * @param {Array} targetItems 目标属性
     * @param {string} defaultParent 默认的一个 parent，初始时为空
     */
    analyzeParent4Arr(items, targetItems, defaultParent) {
        let itemsIndex = -1;
        let itemsLen = items.length;
        console.warn(items);
        console.warn(targetItems);
        console.warn('-------');
        while (++itemsIndex < itemsLen) {
            // if (items[itemsIndex].properties) {
            //     this.analyzeParent4Obj(
            //         items[itemsIndex].properties,
            //         items[itemsIndex].properties,
            //         items[itemsIndex].id.replace('$schemaId-', '')
            //     );
            // }
        }


        // while (++itemsIndex < itemsLen) {
            // delete items[itemsIndex].value;
        // }

        /*for (let i in items) {
            if (items.hasOwnProperty(i)) {
                delete items[i].value;
                let parent = items[i].parent;
                delete items[i].parent;
                if (parent) {
                    let id = items[i].id.replace('$schemaId-', '');
                    items[i].id = ''
                        + '$schemaId-'
                        + (defaultParent ? defaultParent + '/' : '')
                        + parent
                        + '/'
                        + id;
                }
                targetItems[i] = items[i];
                if (items[i].items) {
                    if (defaultParent) {
                        defaultParent += ('/' + (parent || ''));
                    }
                    else {
                        defaultParent = (parent || '');
                    }
                    if (!targetItems[i].items) {
                        targetItems[i].items = {};
                    }
                    this.analyzeParent4Arr(
                        items[i].items,
                        targetItems[i].items,
                        defaultParent
                    );
                }
            }
        }*/
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
        let i = -1;
        let length = arguments.length;
        while (++i < length) {
            let src = arguments[i];
            if (src == null) {
                continue;
            }
            for (let key in src) {
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
                let key = RegExp.$1;
                let val = RegExp.$2;
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
