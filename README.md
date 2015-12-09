# jschema-converter
JSON Schema Converter

把一个简单的 JS 对象转换成 JSON Schema 格式的文件

Install & Update
-------

jschema-converter 已发布到 npm 上，可通过如下命令安装。`-g`是必选项。

    $ [sudo] npm install -g jschema-converter

升级 jschema-converter 请用如下命令。

    $ [sudo] npm update -g jschema-converter


Usage
------

- in CLI
    
        $ jsc -v   // 显示版本信息
        $ jsc [filePath|dirPath] [-o outputDir]  // 对 file 或 dir 执行 jsc，如果有 `-o` 参数，那么生成的 JSON Schema 文件会放入到 `-o` 参数指定的文件夹内，文件名和源文件一致；如果没有 `-o` 参数，那么会在当前命令执行目录下生成 `jscOutput` 目录作为生成文件的目标目录。