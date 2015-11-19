import chalk from 'chalk';
import parserMod from './parser';


let parser = parserMod.parser;
parser.yy = {
    test(t) {
        if (t) {
            return 1;
        }
        return 2;
    }
};

// 引入的时候 import {p} from './index';
// export {
    // parser as p
// };

// 引入的时候 import p from './index';
export default parser;
