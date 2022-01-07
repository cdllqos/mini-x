```flow
start=>start: wxml 文件解析
end=>end: 结束

ast=>operation: ast 解析
hasWxs=>condition: 是否引用 wxs 文件
copyWxsFile=>operation: 拷贝 wxs 至 dist 目录

start->ast->hasWxs(yes)->copyWxsFile->end
hasWxs(no)->end
```
