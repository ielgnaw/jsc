
/**
 * 解析参数。作为命令行执行的入口
 *
 * @param {Array} args 参数列表
 */
exports.parse = function (args) {
    console.log(args,999);
    // args = args.slice(2);

    // // 不带参数时，默认检测当前目录下所有的 less 文件
    // if (args.length === 0) {
    //     args.push('.');
    // }

    // if (args[0] === '--version' || args[0] === '-v') {
    //     showDefaultInfo();
    //     return;
    // }

    // // 错误信息的集合
    // var errors = [];

    // var patterns = [
    //     '**/*.less',
    //     '!**/{output,test,node_modules,asset,dist,release,doc,dep,report}/**'
    // ];

    // var candidates = util.getCandidates(args, patterns);

    // var count = candidates.length;

    // if (count) {

    //     *
    //      * 每个文件的校验结果回调，主要用于统计校验完成情况
    //      *
    //      * @inner

    //     var callback = function () {
    //         count--;
    //         if (!count) {
    //             report(errors);
    //         }
    //     };

    //     // 遍历每个需要检测的 less 文件
    //     candidates.forEach(
    //         function (candidate) {
    //             var file = {
    //                 content: fs.readFileSync(
    //                     candidate,
    //                     'utf-8'
    //                 ),
    //                 path: candidate
    //             };
    //             require('./checker').check(file, errors, callback);
    //         }
    //     );
    // }

};