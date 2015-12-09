let chai = require('chai');
let path = require('path');

// import parser from '../lib/parser/index';
import * as util from '../lib/util';

chai.should();

describe('rmrfdirSync', () => {
    it('should be return right result', (done) => {
        let noExistDir = 'no-exist';
        util.rmrfdirSync(noExistDir).then((e) => {
            e.code.should.equal('2');
            done();
        }).catch (() => {
            done();
        });

        // (1).should.equal(1);
        // parser.yy.test().should.equal(2);
        // parser.yy.test(1).should.equal(1);
    });
});

describe('extend', () => {
    it('should be return right result', () => {
        util.extend({}, {a: 1}).should.deep.equal({a: 1});
        util.extend({}, null).should.deep.equal({});
    });
});

describe('formatMsg', () => {
    it('should be return right result', () => {
        util.formatMsg('haha', 4).should.equal('    haha');
        util.formatMsg('haha').should.equal('haha');
    });
});

describe('getCandidates', () => {
    it('should be return right result', () => {
        let patterns = [
            '**/*.jsc',
            '!**/{output,test,node_modules,asset,dist,release,doc,dep,report,coverage}/**'
        ];
        let candidates = util.getCandidates(['.'], patterns);
        candidates.should.deep.equal([]);

        let candidates1 = util.getCandidates([path.join(__dirname, '..') + path.sep + 'test/fixture'], patterns);
        candidates1.length.should.equal(8);

        let candidates2 = util.getCandidates(
            [path.join(__dirname, '..') + path.sep + 'test/fixture/data1.jsc'],
            patterns
        );
        path.basename(candidates2[0]).should.equal('data1.jsc');

        let candidates3 = util.getCandidates(
            [
                path.join(__dirname, '..') + path.sep + 'test/fixture/data1.jsc',
                path.join(__dirname, '..') + path.sep + 'test/fixture/data2.jsc',
                path.join(__dirname, '..') + path.sep + 'test/fixture/data3.jsc',
            ],
            patterns
        );
        candidates3.length.should.equal(3);

        let noExistCandidates = util.getCandidates(
            [path.join(__dirname, '..') + path.sep + 'test/fixture/no-exist.jsc'],
            patterns
        );
        noExistCandidates.should.deep.equal([]);
    });
});

