/**
 * @file 通用方法
 * @author ielgnaw(wuji0223@gmail.com)
 */

'use strict';

import {sep} from 'path';
import {statSync, readdirSync, unlinkSync, rmdirSync} from 'fs';

/**
 * 获取目录中的文件
 *
 * @param {string} path 目录路径
 * @param {Array} dirs 目录数组
 */
function innerDir(path, dirs) {
    let files = readdirSync(path);
    let i = -1;
    let len = files.length;
    while (++i < len) {
        loopDir(path + sep + files[i], dirs);
    }
}

/**
 * 遍历目录
 *
 * @param {string} path 路径
 * @param {Array} dirs 目录数组
 */
function loopDir(path, dirs) {
    let stat = statSync(path);
    if (stat.isDirectory()) {
        // 收集目录
        dirs.unshift(path);
        innerDir(path, dirs);
    }
    else if (stat.isFile()) {
        // 删除文件
        unlinkSync(path);
    }
}

/**
 * 递归删除目录以及目录里面的内容
 *
 * @param {string} dir 目录路径
 * @param {Function} cb 删除后的回调函数
 *
 * @return {Promise} Promise 对象
 */
export function rmrfdirSync(dir) {
    let dirs = [];
    let removePromise = new Promise((resolve, reject) => {
        try {
            loopDir(dir, dirs);
            let i = -1;
            let len = dirs.length;
            while (++i < len)  {
                // 删除收集到的目录
                rmdirSync(dirs[i]);
            }
            resolve();
        } catch (e) {
            // 如果文件或目录本来就不存在，fs.statSync 会报错，这里不处理了
            // e.code === 'ENOENT' ? reject() : reject(e);
            e.code === 'ENOENT' ? resolve() : resolve(e);
        }
    });

    return removePromise;
}

/**
 * 对象属性拷贝
 *
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 *
 * @return {Object} 返回目标对象
 */
export function extend(target) {
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
}

/**
 * 去除空格
 *
 * @param {string} str 待去除空格的字符串
 *
 * @return {string} 去除空格后的字符串
 */
export function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, '');
}
