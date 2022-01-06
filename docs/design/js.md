```flow
start=>start: ts 文件解析流程
end=>end: 结束
compileTs=>operation: 编译 ts 文件
output=>operation: 写入至 dist目录

jsInput=>inputoutput: 监听项目内 ts 文件变更
ast=>operation: 分析文件 ast 结构
isProjectFile=>condition: 是否为项目内 ts 文件
isThirdJslib=>condition: 是否为第三方 js 包
collectImportContent=>operation: 收集引入依赖
writeTempTsFile=>operation: 写入临时 ts 文件
isComponentJs=>condition: 是否为 npm component js 内文件
copyToDist=>operation: 拷贝至 dist 目录
start->jsInput->ast->isProjectFile(yes)->compileTs->output->end

isProjectFile(no)->isThirdJslib(yes)->collectImportContent->writeTempTsFile->compileTs
isThirdJslib(no)->isComponentJs(yes)->copyToDist->ast
isComponentJs(no)->end
```
