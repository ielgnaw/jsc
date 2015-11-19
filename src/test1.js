import {join, sep} from 'path';
import {readFileSync, writeFileSync} from 'fs';
import safeStringify from 'json-stringify-safe';
import debugMod from 'debug';

let debug = debugMod(111);

debug(22);

let parser = {};
parser.yy = {
    test(t) {
        if (t) {
            return 1;
        }
        return 2;
    }
};

export default parser;
