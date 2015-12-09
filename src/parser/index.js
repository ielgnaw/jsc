/**
 * @file 编译的辅助函数
 * @author ielgnaw(wuji0223@gmail.com)
 */

'use strict';

import safeStringify from 'json-stringify-safe';
import parserMod from './compiler/parser';
import {trim, extend} from '../util';

let parser = parserMod.parser;

parser.yy = {
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
        return trim(str);
    },

    /**
     * 分析对象中的嵌套数组的 parent
     *
     * @param {Array} items 源属性
     * @param {string} parentId 默认的一个 parent，初始时为空
     */
    loopArrInProperties(items, parentId = '') {
        let itemsIndex = -1;
        let itemsLen = items.length;
        while (++itemsIndex < itemsLen) {
            let item = items[itemsIndex];
            delete item.value;

            var parent = item.id.replace('$schemaId-', '');
            if (item.items) {
                // let id = item.id.replace('$schemaId-', '');
                item.id = '$schemaId-' + parentId + '/' + parent;
                parentId += '/' + parent;
                this.loopArrInProperties(item.items, parentId);
            }
            else {
                let id = item.id.replace('$schemaId-', '');
                item.id = '$schemaId-' + parentId + '/' + id;
            }

            if (item.properties) {
                this.loopPropertiesInArr(item.properties, parentId + '/' + parent);
            }
        }
    },

    /**
     * 递归分析对象中的 parent
     *
     * @param {Object} properties 源属性
     * @param {Object} targetProperties 目标属性
     * @param {string} defaultParent 默认的一个 parent，初始时为空
     */
    /*jshint maxcomplexity:11 */
    analyzeParent4Obj(properties, targetProperties, defaultParent = '') {
        for (let i in properties) {
            /* istanbul ignore else */
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
                    /* istanbul ignore if */
                    // if (!targetProperties[i].properties) {
                    //     targetProperties[i].properties = {};
                    // }
                    this.analyzeParent4Obj(
                        properties[i].properties,
                        targetProperties[i].properties,
                        defaultParent
                    );
                }

                if (properties[i].items) {
                    this.loopArrInProperties(properties[i].items, properties[i].id.replace('$schemaId-', ''));
                }
            }
        }
    },

    /**
     * 分析数组中的嵌套对象的 parent
     *
     * @param {Object} properties 源属性
     * @param {string} parentId 默认的一个 parent，初始时为空
     */
    loopPropertiesInArr(properties, parentId = '') {
        for (let i in properties) {
            /* istanbul ignore else */
            if (properties.hasOwnProperty(i)) {
                delete properties[i].value;
                var parent = '';
                if (properties[i].parent) {
                    parent = parentId + '/' + properties[i].parent;
                }
                else {
                    parent = parentId;
                }
                delete properties[i].parent;
                let id = properties[i].id.replace('$schemaId-', '');
                properties[i].id = '$schemaId-' + parent + '/' + id;
                if (properties[i].properties) {
                    parentId = (parent || '');
                    this.loopPropertiesInArr(
                        properties[i].properties,
                        parentId
                    );
                }
            }
        }
    },

    /**
     * 递归分析数组中的 parent
     *
     * @param {Array} items 源属性
     * @param {string} defaultParent 默认的一个 parent，初始时为空
     */
    analyzeParent4Arr(items, defaultParent = '') {
        let itemsIndex = -1;
        let itemsLen = items.length;
        while (++itemsIndex < itemsLen) {
            let item = items[itemsIndex];

            delete item.value;

            let parent = item.id.replace('$schemaId-', '');
            if (item.items) {
                // let id = item.id.replace('$schemaId-', '');
                item.id = '$schemaId-' + defaultParent + parent;
                defaultParent += parent + '/';
                this.analyzeParent4Arr(item.items, defaultParent);
            }
            else {
                let id = item.id.replace('$schemaId-', '');
                item.id = '$schemaId-' + defaultParent + id;
            }

            if (item.properties) {
                this.loopPropertiesInArr(item.properties, defaultParent + parent);
            }
        }
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
        return extend.apply(target, arguments);
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
                /* istanbul ignore else */
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
