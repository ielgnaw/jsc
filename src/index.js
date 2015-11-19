import chalk from 'chalk';
import parserMod from './parser';


let parser = parserMod.parser;
parser.yy = {
    test() {
        return 1;
    }
};

// 引入的时候 import {p} from './index';
// export {
    // parser as p
// };

// 引入的时候 import p from './index';
export default parser;
