
# blog前端个人项目

主要目的是练习javascript语言，模仿jQuery封装一个比较基础的js库。库的名称是Base,外部可以通过$()创建Base对象并使用其中的一些方法。Base库分为tool.js部分、Base.js部分和各种插件部分。

最后利用封装好的库，制作了一个blog的前端部分，克隆或下载后注册、登录、换肤等涉及数据库的操作没法用，效果可以在www.yupengjun.cn/project/javascript-blog查看。所以这个github仓库主要是提供Base这个库文件的下载，以防止以后我的电脑硬盘出现了不可想象的故障时，想用这个库的时候找不到。

## tools.js部分

tools.js是一个存放工具类方法的文件，有些工具也可以单独拿出来用，但主要目的是为了给Base.js封装一些重复的功能。所以Base.js要依赖tools.js。

#### window.sys 检测浏览器版本工具

使用：`window.sys.chrome`,如果使用的是谷歌浏览器就可以返回浏览器的版本，其他浏览器只需要改下名字。

该方法为加载自调用，使用时只需要直接window.sys.chrome即可获取浏览器版本号。支持sys.chrome、sys.ie、sys.firefox、sys.opera、sys.safari及sys.webkit内核版本检测。

#### addDomLoaded(fn) 入口函数工具

使用：`addDomLoaded(function(){ ... })`,其中的fn会在DOM加载完之后执行

判断浏览器是否加载完DOM，在HTML和DOM构造起来、图片加载之前运行传入的函数

W3C标准的浏览器直接使用'DOMContentLoaded'事件判断。

ie低版本浏览器使用定时器不断try document.documentElement.doScroll('left'); DOM没加载完的话会保存，所以不报错的话就运行传入的函数。

#### getInner() 获取浏览器窗口长宽

使用：返回浏览器窗口宽度`getInner().width`,返回浏览器窗口高度`getInner().height`

函数内部firefox浏览器使用的是window.innerWidth。

其他浏览器使用的是document.documentElement.clientWidth。

#### getScroll() 获取滚动条卷曲值

使用：返回浏览器窗口卷曲值的高度`getScroll().top`,返回浏览器窗口卷曲值的宽度`getScroll().left`

函数内部做了document.documentElement.scrollTop和document.body.scrollTop兼容处理。

#### getStyle(element, attr) 获取元素样式

使用：`getStyle(div,'height')`,返回div元素的高度,不带单位。

W3C标准的浏览器使用window.getComputedStyle

ie浏览器使用element.currentStyle


#### hasClass(element, className) 检测重复class

使用：`hasClass(div,'box')`，判断div元素中是否存在box类名,存在返回匹配到的值,数组形式，不存在返回null。

使用match()方法判断，并且用正则表达式去掉前后空格再去判断,new RegExp('(\\s|^)' + className + '(\\s|$)').


#### insertRule(sheet, selectorText, cssText, position) 添加style标签内的样式

使用：`insertRule(document.styleSheets[0],'div','height:10px',0)`,在第一个style标签新建 `div{height:10px;}`的样式

在style标签中插入一条样式，用的时候需要小心。不要破坏css层级关系。

position是要插入的位置，0为第一条，以此类推。

W3C标准的浏览器使用sheet.insertRule(selectorText + '{' + cssText + '}', position)

ie浏览器使用sheet.addRule(selectorText, cssText, position)


#### deleteRule(sheet, index) 删除style标签内的样式

使用：`deleteRule(document.styleSheets[0],0)`,删除第一个style标签的第一行。

W3C标准的浏览器使用sheet.deleteRule(index),

ie浏览器使用sheet.removeRule(index).

#### addEvent(obj, type, fn) 添加绑定事件

使用：`addEvent(div,'click',function(){alert('')})`,给div标签添加点击事件，点击后弹出对提示框。

W3C标准直接使用addEventListener添加事件。

ie低版本浏览器用的并不是attachEvent,会有很多问题，而是直接给obj创建events对象存放事件，将事件触发的函数以数组形式存放到obj.events.type中，type指的是事件。

兼容了ie低版本和W3C标准的浏览器的事件对象，还有三个常用的事件对象的属性:阻止默认行为e.preventDefault,阻止冒泡e.stopPropagation,调用事件的元素e.target。也就是在事件触发的函数中可以直接传e并且直接拿来使用，而这三个属性也已经做好兼容，ie下也可以直接用。

如果同一个元素的同一个事件执行了两个相同的函数，那么只会执行一次。

#### removeEvent(obj, type, fn) 删除事件

使用：`removeEvent(div,'click',function(){ ... })`,删除div元素的点击事件触发的函数。

W3C标准的浏览器使用removeEventListener方法

ie低版本浏览器检测obj的events属性，从这个属性中删除该事件数组中的相同的事件触发函数。


#### getInnerText(element) 获取元素文本内容工具

使用：`getInnerText(p)`,返回p元素的文本内容

在函数内部做了element.textContent和element.innerText的兼容处理。textContent是为了兼容firefox。

#### setInnerText(element,text) 设置元素文本内容工具

使用：`getInnerText(p,'这是p标签')`,设置p元素的文本内容为这是p标签。

同样做了element.textContent和element.innerText的兼容处理。

#### Trim(str) 删除开头或结尾空格

使用：`Trim('  string   ')`,使用后返回'string',去掉了两边的空格。

通过replace方法判断正则/(^\s*)|(\s*$)/g,匹配到了就替换为''。

#### inArray(array,value) 某一个值是否存在某一个数组中

使用：`inArray([1,2,3,4,5],2)`,返回true，因为2能被匹配到

for...in遍历传入的array,若是array某一项的值全等于传入的value，则返回true,否则返回false.

#### offsetTop(element) 获取元素到浏览器窗口顶点的位置

使用：`offsetTop(div)`,返回div元素距离浏览器窗口顶点的距离，这里不包含卷曲值。

W3C标准的浏览器使用element.offsetTop。

ie低版本浏览器中这个属性只能获取元素距离父元素的属性，所以不断获取element的父元素，每次累加offsetTop的值，直到找不到父元素为止。


#### prevIndex(current,parent) 获取上一个节点的索引

使用：`prevIndex($('p').index(),p.parentNode)`,传入当前元素的索引值和当前元素的父元素。返回当前元素的上一个元素的索引值,主要对第一个元素的上一个是最后一个元素这种情况使用。

#### nextIndex(current,parent) 获取下一个节点的索引

使用：`nextIndex($('p').index(),p.parentNode)`,和prevIndex()相同，只是这个是对最后一个元素的下一个应该是第一个元素这种情况使用的。



## Base.js部分

Base.js存放主要的DOM操作、事件、样式的方法。

Base构造函数中有this.elements这个数组，每次获取元素都存放在这个数组中，下面的方法都是遍历这个数组并依次操作每个元素。

所有的方法都放在Base函数的原型上，这样new Base的时候也同时继承了所有方法。

new Base的步骤通过$()就可以实现，因为使用了工厂模式，每次$()都是new了一个新的Base对象，每个Base在内存中是独立的空间所以互不污染。

要实现链式编程，每个方法就要返回的Base对象才能访问Base上的方法,所以方法最后都要return this,因为调用这些方法的肯定是Base对象,那么this指的同样也是Base对象,如果使用DOM对象肯定是无法直接使用这些方法。

如果是某个DOM没法直接访问Base对象的方法。所以要用构造函数去new一个对象。也就是将DOM对象写到$()中。

#### $() Base对象调用

使用：有三种情况，第一种传入选择器`$('#box span')`这是获取#box的元素下的所有span元素。第二种是传入this`$(this)`。第三种是传入函数`$(function(){})`是入口函数的意思,也就是在DOM加载完之后运行里面的函数。

实现：判断传入参数的数据类型，string为选择器,object为this对象,function是作为入口函数使用。

传入选择器：先判断，如果传入的是多个选择器就把它们存入数组，遍历数组并通过switch语句依次判断是哪种选择器，只支持到id、class、标签。将每次遍历得到的选择器都push到数组中，如果还有下次那么就当做下一个元素的父元素来使用，如果没有下次遍历就将这个数组交给this.elements数组，这就是最后得到的元素，以下的每个方法都会去遍历this.elements数组，从中遍历得到的元素再去操作。如果判断之传入了一个选择器就简单了，直接再用switch判断是哪种选择器然后直接赋值给this.elements即可。

传入的是this对象：将this直接赋值给this.elements[0]。

传入的是函数：调用this.ready(fn),ready方法就是调用的tools.js中的addDomLoaded()方法,直接就创建了一个入口函数。

#### first() 获取第一个元素

使用：`$('div').first()`返回获取到的所有div元素中的第一个。

直接return this.elements[0]。

#### last() 获取最后一个元素

使用：`$('div').last()`返回获取到的所有div元素中的最后一个。

直接return this.elements[this.elements.length - 1]。

#### next() 获取下一个节点

使用：`$('div').next()`返回获取到的所有div元素的下一个元素节点。

通过nextSibling实现的，需要判断如果获取到了文本节点就递归一次，也就是再次nextSibling一次。

#### prev() 获取下一个节点

使用：`$('div').prev()`返回获取到的所有div元素的上一个元素节点。

通过previousSibling实现的，需要判断如果获取到了文本节点就递归一次，也就是再次previousSibling一次。

#### getElement(num) Base对象转换DOM对象

使用：`$('div').getElement(0)`返回DOM对象，将获取的所有div元素的第一个返回。

直接return this.elements[num]

#### eq(num) 获取具体的某个节点

使用：`$('div').eq(0)`返回Base对象,将获取的所有的div元素的第一个返回。

获取this.elements中索引为num的那个赋值给临时变量，重置this.elements并将临时变量赋值给this.elements[0]并return。

#### length() 获取某组元素的length

使用：`$('div').length()`返回获取的所有div元素的长度。

直接return this.elements.length

#### attr(attr, value) 获取和设置元素的属性、自定义属性

使用：设置属性`$('img').attr('src','./images/abc.jpg')`设置img元素的src="./images/abc.jpg"并返回Base对象,获取属性`$('img').attr('src')`返回的是img元素的src属性值。

判断参数的length确定是用getAttribute还是setAttribute,如果是getAttribute就直接将获取的值return,不需要链式编程。

#### index() 获取索引值

使用：`$('#list li').index()`返回#list元素下的li的索引值

获取每个元素的父节点的所有子节点，遍历所有子节点，return索引值。

#### opacity(num) 设置元素的透明度

使用：`$('#box').opacity(50)`,将#list的元素的透明度调整为50%，再返回Base对象

通过opacity设置透明度,也设置了filter兼容ie浏览器。

#### addClass(className) 添加class

使用：`$('div').addClass('box1 box2')`将box1和box2作为类名添加给所有div元素,返回Base对象

将传入的参数用split分为数组，遍历这个数组，通过tools.js的hasClass()方法去和每个元素的className判断是否重复，不重复的话就用元素的className+=这个类名。

#### removeClass() 删除class

使用：`$('div').removeClass('box1')`将box1类名从所有div元素中删除，返回Base对象

和addClass方法类似，区别是addClass是+=,而删除是先把元素的className赋值给临时变量,判断如果存在就用replace替换为'',将全部替换完的临时变量再赋值会元素的className属性。


#### css(attr, value) 设置和获取元素样式

使用：设置css样式`$('div').css('height','100px')`设置所有div元素的height为100px或`$('div').css({'height':'100px','width':100px)`同时设置所有div元素的height和width为100px,最后返回Base对象。获取元素属性值:`$('div').css('height')`返回第一个div元素的height属性值。

判断参数如果是object那么就是同时设置多个css样式，for...in遍历参数并分别对元素设置。

如果参数不是object并且有两个那么就是只设置一个css属性。不用遍历直接设置。

如果参数不是object只有一个，那就是获取属性值，直接return遍历中的第一个this.elements。

#### addRule(num, selectorText, cssText, position) 添加style的样式

使用：`addRule(0,'div'.eq(0),'height:200px',0)`在页面中第一个style标签中的第一条前插入div{height:200px;},返回Base对象

在内部调用了tools.js的insertRule()方法。参数num指的是页面中style标签的位置，position是插入位置。

#### removeRule(num, index) 删除style的样式

使用：`removeRule(0,0)`删除页面中第一个style标签中的第一条样式,返回Base对象

在内部调用了tools.js的deleteRule()方法。参数num指的是页面中style标签的位置，index是删除的索引。

#### html(str) 获取元素内容

使用：获取内容`$('div').html()`返回第一个div标签的所有内容,设置内容`$('div').html('<p>这是一个段落</p>')`设置所有div标签的内容为<p>这是一个段落</p>,会覆盖原来的内容,返回Base对象。

判断没有参数来确定是获取还是设置,使用innerHTML设置元素的内容。

#### text(str) 获取元素文本内容

使用：获取文本`$('p').text()`返回第一个p标签的文本内容,设置文本`$('p').text('这是一个段落')`将所有p标签的文本设置为这是一个段落,返回Base对象

判断没有参数来确定是获取还是设置,获取就直接return tools.js中的getInnerText()方法的返回值,设置就调用getInnerText()方法

#### form(name) 设置表单字段

使用：`$('#reg').form('user')`返回#reg的元素的name属性为user的表单元素,#reg必须是form元素。

#### value(str) 获取和设置表单字段内容

使用：获取value`$('#reg').form('user').value()`返回上一个方法的表单的内容。设置value`$('#reg').form('user').value('请输入用户名')`将上一个方法的表单的内容设置为请输入用户名,返回Base对象.

实现方法和html相同只是用的不是innerHTML而是value，并且只能用于表单元素。

#### center(width, height) 元素居中

使用：`$('#screen').center(200,50)`将#screen元素设置为全窗口居中,该元素必须是定位的,返回Base对象。

设置元素的left值和top值,以top为例,调用tools.js的getInner()方法和getScroll()方法,(getInner().height - height) / 2 + getScroll().top;

#### show() 元素显示

使用：`$('#screen').show()`将#screen元素显示出来,返回Base对象。

内部做了display:block。

#### hide() 元素隐藏

使用：`$('#screen').hide()`将#screen元素隐藏,返回Base对象。

内部做了display:none。

#### lock() 全屏遮罩层

使用：`$('#lock').lock()`将#lock元素作为一个覆盖全屏的遮罩层,一般用作弹出窗口的背景使用,返回Base对象。

调用tools.js的getInner()方法和getScroll()方法,遮罩层元素的宽高为两个方法之和,设置display:block,overflow:hidden,阻止mousedown、mouseup、selectstart三个事件的默认行为。

#### unlock() 取消遮罩层

使用：`$('#lock').unlock()`将#lock元素关闭遮罩层,返回Base对象。

设置display:none,overflow:auto,阻止mousedown、mouseup、selectstart三个事件的默认行为。

#### toggle() 点击切换的方法

使用：`$('#sidebar h2').toggle(function(){alert(1)},function(){alert(2)},function(){alert(3)})`第一次点击#sidebar元素下的所有h2元素实现弹出1,第二次点击弹出2,第三次点击弹出3,如此循环,所以这个方法可以传入多个函数,并且一次循环执行,返回Base对象。

函数内部是一个闭包自调用函数,因为每个元素要存储独立的计数器并且第二次调用函数计数器不能清零,所以使用闭包,假设传入了三个函数,用(计数器++ % arguments.length)得出的就是0、1、2、0、1、2,如此循环的调用传入的函数并动态改变this指向为调用该方法的元素。

#### bind(event, fn) 事件发生器

使用：`$('#sidebar h2').bind('click',function(){alert(1)})`给#sidebar元素下的所有h2元素设置点击弹出框1,返回Base对象

函数内部就是一次调用的tools.js的addEvent()方法。

#### hover(overFn, outFn) 鼠标移入移出事件

使用：`$('#sidebar h2').hover(function(){alert(1)},function(){alert(2)})`将鼠标移入#sidebar元素下的所有h2元素就会弹出框1,移出就弹出框2,返回Base对象。

这个参数只能传入两个函数,第一个函数执行mouseover也就是移入,第二个函数执行mouseout也就是移出。

#### click(fn) 单机事件

使用：`$('#sidebar h2').click(function(){alert(1)})`点击#sidebar元素下的所有h2元素会弹出框1,返回Base对象。

内部调用了tools.js的addEvent()方法。因为click事件用的比较多所以单独封装了,其实用bind也可以。

#### resize(fn) 浏览器改变窗口尺寸事件

使用：`$('#login').resize(function(){})`改变浏览器窗口大小的时候也同时改变#login元素的位置,并执行传入的函数,主要用于弹出框,返回Base对象。

内部调用addEvent()函数,传入window和resize事件。并且调用getInner()获取全屏尺寸和getScroll()卷曲值。

当弹出框靠在浏览器的边缘,浏览器由大缩小时,不让弹出框隐藏到看不到的区域,通过判断element.offsetLeft > getInner().width + getScroll().left - element.offsetWidth,设置弹出框的left值,top也相同。

当浏览器窗口大小小于弹出框的长宽时,保证弹出框能由上由左显示、隐藏下部和右部。通过判断element.offsetLeft <= 0 + getScroll().left确定弹出框的left值,top也一样。

#### animate(obj) 运动动画方法

使用：`$('#box').animate({attr:'top',target:300,})` 设置#box元素移动到top值为300px的位置上,返回Base对象。

传入的参数都为对象形式。具体属性如下:

设置left和top确定横移还是竖移,step要传正值,通过target的值确定具体方向

'attr'   
- 'x'表示横轴运动'y'还是纵轴运动 ,'x'代表left,'y'代表top,也可以直接传'left'和'top'。
- 'w'表示设置宽'h'表示设置高,'w'代表'width','h'代表'height',也可以直接传'width'和'height'。
- 'o'表示opacity,也可以直接传'opacity'。
- 也可以直接传正常的属性,比如fontSize,如果什么都没传默认left。只要单位是'px'的都可以。

'start'  
- 传入值为数值，表示属性开始的位置，默认值getStyle(element, attr)。

't'      
- 传入值为毫秒值，表示定时器刷新时间间隔，默认值17。

'step'   
- 传入值每次移动的距离值，默认值10。

'target' 
- 传入运动的目标位置，默认值start+alter。
- 整个插件target和alter两个参与必须传一个，否则报错。

'alter'  
- 传入增量，也就是比start的位置增加的距离，这个没有默认值。
- 整个插件target和alter两个参与必须传一个，否则报错。

'speed'  
- 传入运动的速度，主要在缓动的时候用到，默认值为6。值越大速度越慢。

'type'   
- 传入0或1,0代表匀速运动constant，匀速运动就是每次前进的值为step的固定值。
- 传入1代表缓动buffer。缓动就是先快后慢。

'fn'
- 值为一个函数,当第一个动画执行完毕之后就执行这个函数。

'mul'
- 是一个对象形式的参数,内部可以传入属性和属性值。
- 这里只能传入正常的属性不能和'attr'属性那样简写。只要单位是'px'的属性都可以。属性值不用带单位。
- 可以设置多个属性同时动画。

动画队列:

- 一个动画结束后再继续执行下一个动画，就像排队执行，只需要传参数时设置一个fn属性，值为下一个动画即可。
- 具体实现的时候，在getTarget和getOpacity内部最后运行fn参数即可。因为能进入到这两个函数就说明第一个动画已经执行完毕了。

同步动画:

- 和动画队列不同，同步动画主要是指不同动画同时执行，通过传入mul函数达到目的，mul是个对象，内部可以传入属性和属性值，例如width:100,height:100;
- 属性只能传css的属性，在运动之前会遍历mul，取出属性和属性值来用。属性当做attr用，属性值当做target来用。
- 进入定时器之前先判断下mul有效性，如果没传的话就将创建一个。以防止单独传值只运行一个动画时出错。


## 插件部分

插件部分依赖tools.js、Base.js。因为插件部分代码比较多，所以单独分离出来，需要用到的页面可以单独加载。

#### base_drag.js 拖拽插件 

#### base_animate.js 动画插件



