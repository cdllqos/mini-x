```flow
start=>start: json 文件解析
end=>end: 结束

analysisComponents=>operation: 解析 usingComponents
hasImportThirdComponents=>condition: 是否引入三方组件
copyStaticFile=>operation: 拷贝 json, wxss 文件
handleWxml=>operation: 处理 wxml 解析
handleJs=>operation: 处理 js 解析
start->analysisComponents->hasImportThirdComponents(no)->end
hasImportThirdComponents(yes)->copyStaticFile->handleWxml->handleJs->end
```
