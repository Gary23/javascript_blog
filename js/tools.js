/*
 * 这是base.js的工具库
 * 使用时先引用这个js再引用base.js
 */



// 检测浏览器版本
// window.sys.chrome
(function () {
    window.sys = {};        // 为了让获取的浏览器信息能够全局访问。
    var ua = window.navigator.userAgent.toLocaleLowerCase(),
        s;
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :       // match返回的是数组s[0]是浏览器名称，s[1]是浏览器版本，而浏览器名称我们通过sys对象的属性来表示那么值自然是浏览器的版本。
        (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
                (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

    if (/webkit/.test(ua)) {
        sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];       // chrome和safari都是webkit内核
    }
})();



// 判断浏览器是否加载完DOM
// addDomLoaded(function(){})
function addDomLoaded(fn) {
// onload加载包含 DOM文档结构、外部脚本、样式、图片音乐等
// 而js只需要HTML和DOM加载结构完毕之后就可以使用了
    /*
     * 浏览器加载顺序
     * 1、HTML解析完毕
     * 2、外部脚本和样式加载完毕
     * 3、脚本在文档内解析并执行
     * 4、HTML DOM完全构造起来 (实际上这里执行完了就可以加载js了，DOMContentLoaded事件会在这里结束后触发)
     * 5、图片和外部内容加载
     * 6、网页完成加载  (onload加载指的这里执行完)
     */
// DOMContentLoaded 是ie9以上才支持的，会在iframe标签加载前执行。
// 而ie6、7、8的方法会在iframe加载完成后才执行,所以6、7我就不管了，但是ie8还是要兼容的。

    var isReady = false,
        timer = null;

    function doReady() {        // 运行到这个函数说明DOM加载完毕，先清除定时器，再执行传入的执行程序。
        if (timer) clearInterval(timer);
        if (isReady) return;
        isReady = true;
        fn();
    }

    if (document.addEventListener) {         // 高版本浏览器标准(W3C标准)
        addEvent(document, 'DOMContentLoaded', function () {
            fn();
            removeEvent(document, 'DOMContentLoaded', arguments.callee);    // 匿名函数没有具体的函数名，就可以用arguments.callee获取
        });
    } else if (sys.ie && sys.ie < 9) {      // ie8及以下的ie浏览器

        timer = setInterval(function () {
            try {
                document.documentElement.doScroll('left');      // 当页面DOM未加载完成时加载doScroll会报错，所以不断去尝试加载直到往下执行，也就代表DOM加载完成。
                doReady();
            } catch (e) {
            }
            ;
        }, 1);
    }
}

// 获取浏览器窗口的尺寸
// getInner().wdith
function getInner() {
    if (typeof window.innerWidth != 'undefined') {      // inner是兼容firefox浏览器
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
}


// 滚动条卷曲值工具
function getScroll(){
    return {
        top:document.documentElement.scrollTop || document.body.scrollTop,
        left:document.documentElement.scrollLeft || document.body.scrollLeft
    }
}


// 获取元素的属性
// getStyle(div,'height')
function getStyle(element, attr) {
    var value;
    value = window.getComputedStyle ?
        window.getComputedStyle(element, null)[attr] :      // W3C标准
        element.currentStyle[attr]      // 兼容ie浏览器
    return value;
}

// 检测是否有重复class名
// hasClass(div,'box')
function hasClass(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));      // className前面或者后面有空格
}

// 添加link规则的兼容性处理
// insertRule(0,div,height:10px,0)
// 这个方法是最近才知道的，感觉应用场景不多，而且要慎用，用这个style的层次应该会挺乱的。
function insertRule(sheet, selectorText, cssText, position) {
    if (sheet.insertRule) {             // W3C标准的用法
        sheet.insertRule(selectorText + '{' + cssText + '}', position)
    } else if (sheet.addRule) {         // 兼容ie
        sheet.addRule(selectorText, cssText, position)
    }
}

// 删除link规则的兼容性处理
// deleteRule(div,0)
function deleteRule(sheet, index) {
    if (sheet.deleteRule) {
        sheet.deleteRule(index);
    } else if (sheet.removeRule) {
        sheet.removeRule(index)
    }
}

//获取Event对象
function getEvent(event) {
    return event || window.event;
}

//阻止默认行为(主要是用后面那种方法，这个不用了)
function preDef(event) {
    var e = getEvent(event);
    if (typeof e.preventDefault != 'undefined') {
        e.preventDefault();         // W3C标准
    } else {
        e.returnValue = false;          // 兼容ie
    }
}





// 绑定事件的兼容性处理
// addEvent(div,click,function(){alert(1)})
/*
 * 主要为了解决ie8浏览器的兼容性问题。
 * 1、ie8浏览器事件触发顺序相反。
 * 2、ie8浏览器同一个事件执行函数如果写了多次都会执行一遍。
 * 3、解决this总是指向window的问题。
 * 4、顺便在后面兼容了事件冒泡和阻止默认事件的问题。
 * 5、ie8真是太费劲了......
 */
function addEvent(obj, type, fn) {

    if (typeof obj.addEventListener != 'undefined') {

        obj.addEventListener(type, fn, false);          // W3C标准
    } else
    //	if(typeof obj.attachEvent != 'undefined'){
    //		obj.attachEvent('on' + type,function(){
    //			fn.call(obj,window.event);
    //		});
    //	}
    {
        if (!obj.events) obj.events = {};        // 第一次执行在传入的元素上创建一个存放事件的对象

        if (!obj.events[type]) {

            obj.events[type] = [];          // 创建一个存放事件处理函数的数组，区分不同的事件。

            //if (obj['on' + type]) obj.events[type][0] = fn;         // 这里暂且注释掉试试。貌似会重复一次事件触发。

        } else {

            if (addEvent.equal(obj.events[type], fn)) return false;     // 解决ie的重复执行同一个函数，将函数进行比较，如果相同就不添加计数器中。
        }

        obj.events[type][addEvent.ID++] = fn;       // 直接将事件处理程序存入之前创建的数组。计数器会自增。

        obj['on' + type] = addEvent.exec;       // 将每个执行函数依次执行，解决ie浏览器执行顺序的问题
                                                // 相当于 div.onclick = function(event){}
    }
}

addEvent.ID = 1;

// 执行事件处理函数
addEvent.exec = function (event) {          // 这里无法获取到type的值所以用了event，this指的就是addEvent方法的obj。
    var e = event || addEvent.fixEvent(window.event),       // 顺便做一下ie的事件方法的兼容处理
        es = this.events[e.type];       // exec的this是obj
    for (var i in es) {
        es[i].call(this, e);        // 在这里执行事件驱动的函数。同时解决this和event的问题。
                                    // 用call解决ie浏览器this总是指向window的问题。this后面的参数e是为了将window.event传递出去,call有这个功能将第二个参数传入第一个参数this中。
    }
}

// 把ie常用的evnet对象配对到W3C中去
// 就是在ie的window.event中建立和W3C相同的属性名，并将ie的该解决方法赋值给该属性，这样便使该方法名在W3C标准和ie中通用。
addEvent.fixEvent = function (event) {
    event.preventDefault = addEvent.fixEvent.preventDefault;
    event.stopPropagation = addEvent.fixEvent.stopPropagation;
    event.target = event.srcElement;
    return event
}

// IE阻止默认行为
addEvent.fixEvent.preventDefault = function () {
    this.returnValue = false;
}

// 阻止冒泡
addEvent.fixEvent.stopPropagation = function () {
    this.cancelBubble = false;
}

// 比较ie浏览器事件执行的函数是否相同。
addEvent.equal = function (es, fn) {
    for (var i in es) {
        if (es[i] == fn) return true;
    }
    return false;
}

// 删除事件的兼容性处理
// removeEvent(div,click,function(){})
function removeEvent(obj, type, fn) {
    if (typeof obj.removeEventListener != 'undefined') {
        obj.removeEventListener(type, fn, false);
    } else
    //	if(typeof obj.detachEvent != 'undefined') {
    //		obj.detachEvent('on' + type, fn);
    //	}
    {
        if (obj.events) {
            for (var i in obj.events[type]) {
                if (obj.events[type][i] == fn) {
                    delete obj.events[type][i];     // 如果匹配到了传入的函数，就从数组里删除
                }
            }
        }

    }
}


// 获取innerText兼容性处理
function getInnerText(element){
    return (typeof element.textContent == 'string') ? element.textContent : element.innerText;      // textContent是兼容firefox的
}
// 设置innerText兼容性处理
function setInnerText(element,text){
    if (typeof element.textContent == 'string') {
        element.textContent = text;
    }else{
        element.innerText = text;
    }
}


// 删除前后空格
function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}

// 锁定滚动条
function scrollTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}


// 某一个值是否存在某一个数组中
function inArray(array,value){
    for(var i in array){
        if(array[i] === value) return true;
    }
    return false;
}
