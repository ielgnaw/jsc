import p from '../index';
import * as test from '../test';

describe('test: ', () => {
    it('should return right count', () => {
        expect(1).toEqual(1);
        expect(1).toEqual(p.yy.test());
        expect(123).toEqual(test.ret);
    });
});
