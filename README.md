<<<<<<< HEAD
# blog前端个人项目
> 一个blog前端项目，重点在于模仿jQuery封装一个比较基础的js库。库的名称是Base,外部可以通过$()创建Base对象。Base库分为tool.js部分、Base.js部分和各种插件部分。

## tools.js部分

> Tool.js是一个存放工具类方法的文件，Base.js依赖tools.js。

#### window.sys 检测浏览器版本工具
#### addDomLoaded() 入口函数工具
#### getInner() 获取浏览器长宽
#### getStyle() 获取元素样式
#### hasClass() 检测重复class
#### insertRule() 添加style标签内的样式
#### deleteRule() 删除style标签内的样式
#### getEvent() 获取事件对象
#### preDef() 阻止默认事件
#### addEvent() 添加事件
#### removeEvent() 删除事件
#### Trim() 删除开头或结尾空格
#### scrollTop() 锁定滚动条


## Base.js部分

> Base.js存放主要的DOM操作、事件、样式的方法。

#### $() 入口函数
#### first() 获取第一个元素
#### last() 获取最后一个元素
#### next() 获取下一个节点
#### prev() 获取下一个节点
#### find() 匹配子节点
#### getElement() Base对象转换DOM对象
#### eq() 获取具体的某个节点
#### addClass() 添加class
#### removeClass() 删除class
#### css() 设置和获取元素样式
#### addRule() 添加style的样式
#### removeRule() 删除style的样式
#### html() 获取元素内容
#### center() 元素居中
#### show() 元素显示
#### hide() 元素隐藏
#### lock() 全屏遮罩层
#### unlock() 取消遮罩层
#### toggle() 点击切换的方法
#### hover() 鼠标移入移出事件
#### click() 单机事件
#### resize() 浏览器改变窗口尺寸事件




## 插件部分

> 插件部分依赖tools.js、Base.js。因为插件部分代码比较多，所以单独分离出来，需要用到的页面可以单独加载。

#### base_drag.js 拖拽插件 

#### base_animate.js 动画插件
=======
# javascript-blog
一个blog前端项目，重点在于封装一个js库。
>>>>>>> c4abd9054eb38499289fb7edb5031ef77208543f
