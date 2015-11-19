let chai = require('chai');
let path = require('path');


import p from '../src/index';
import * as test from '../src/test';


chai.should();

describe('test', () => {
    it('should be return right parse result', () => {
        // (1).should.equal(1);
        p.yy.test().should.equal(2);
        p.yy.test(1).should.equal(1);
        test.ret.should.equal(5555);
    });
});