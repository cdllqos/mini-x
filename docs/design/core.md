```flow
start=>start: 开始
end=>end: 结束

watcher=>operation: 启动 watcher
listenWxml=>operation: 监听 wxml 文件，处理响应
listenJs=>operation: 监听 Js 文件，处理响应
listenCss=>operation: 监听 Scss, Less 文件，处理响应
listenJson=>operation: 监听 Json 文件，处理响应

start->watcher->listenWxml->listenJs->listenCss->listenJson->end
```
