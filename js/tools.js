/*
 * 这是base.js的工具库
 * 使用时先引用这个js再引用base.js
 */



// 检测浏览器
// 使用方式：window.sys.chrome
(function () {
    window.sys = {};
    var ua = window.navigator.userAgent.toLocaleLowerCase(),
        s;
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
                (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

    if (/webkit/.test(ua)) {
        sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
    }
})();



// 判断浏览器是否加载完DOM.
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

    function doReady() {
        if (timer) clearInterval(timer);
        if (isReady) return;
        isReady = true;
        fn();
    }

    if (document.addEventListener) {         // 高版本浏览器标准(W3C标准)
        addEvent(document, 'DOMcontentLoaded', function () {
            fn();
            removeEvent(document, 'DOMcontentLoaded', arguments.callee);
        });
    } else if (sys.ie && sys.ie < 9) {      // ie8及以下的ie浏览器
        var timer = null;
        timer = setInterval(function () {
            try {
                document.documentElement.doScroll('left');
                isReady();
            } catch (e) {
            }
            ;
        }, 1);
    }
}


// 处理浏览器获取窗口大小的兼容性
// inner是兼容火狐浏览器
function getInner() {
    if (typeof window.innerWidth != 'undefined') {
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

//获取style的兼容性处理
//getComputedStyle是W3C标准，currentStyle是兼容IE
function getStyle(element, attr) {
    return window.getComputedStyle ?
        window.getComputedStyle(element, null)[attr] :
        element.currentStyle[attr]
}

// 检测是否有重复class名
function hasClass(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

// 添加link规则的兼容性处理
// addRule为了支持ie   insertRule为了支持火狐
function insertRule(sheet, selectorText, cssText, position) {
    if (sheet.insertRule) {
        sheet.insertRule(selectorText + '{' + cssText + '}', position)
    } else if (sheet.addRule) {
        sheet.addRule(selectorText, cssText, position)
    }
}
// 删除link规则的兼容性处理
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

//阻止默认行为(这是一种单独的用法，后面还有别的方法)
//preventDefault是W3C标准,returnValue是ie标准
function preDef(event) {
    var e = getEvent(event);
    if (typeof e.preventDefault != 'undefined') {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

/*
 绑定事件的兼容性处理
 主要为了解决ie8浏览器的兼容性问题。
 1、ie8浏览器事件触发顺序相反。
 2、ie8浏览器同一个事件执行函数如果写了多次都会执行一遍。
 3、解决this总是指向window的问题。
 4、顺便在后面兼容了事件冒泡和阻止默认事件的问题。
 5、ie8真是太费劲了......
 */
function addEvent(obj, type, fn) {
    if (typeof obj.addEventListener != 'undefined') {
        obj.addEventListener(type, fn, false);
    } else
    //	if(typeof obj.attachEvent != 'undefined'){
    //		obj.attachEvent('on' + type,function(){
    //			fn.call(obj,window.event);
    //		});
    //	}
    {
        // 创建一个存放事件的对象
        if (!obj.events) obj.events = {};
        // 如果这个事件属性没有的话就先创建一个
        if (!obj.events[type]) {
            // 创建一个存放事件处理函数的数组
            obj.events[type] = [];
            // 把第一次的事件处理函数先储存到第一个位置上
            if (obj['on' + type]) obj.events[type][0] = fn;
        } else {
            // 解决ie的重复执行同一个函数，将函数进行比较，如果相同就不添加计数器中。
            if (addEvent.equal(obj.events[type], fn)) return false;
        }
        // 如果已经创建了这个事件的属性，就一次往里存入该事件的其他执行函数。计数器会自增。
        obj.events[type][addEvent.ID++] = fn;
        // 将每个执行函数依次执行，解决ie浏览器执行顺序的问题
        obj['on' + type] = addEvent.exec;
    }
}

addEvent.ID = 1;

// 执行事件处理函数
// 这里无法获取到type的值所以用了event，this指的就是addEvent方法的obj。
addEvent.exec = function (event) {
    var e = event || addEvent.fixEvent(window.event),
        es = this.events[e.type];
    for (var i in es) {
        // 用call解决ie浏览器this总是指向window的问题。
        // this后面的参数e是为了将window.event传递出去。
        es[i].call(this, e);
    }
}

// 把ie常用的evnet对象配对到W3C中去
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
                    delete obj.events[type][i];
                }
            }
        }

    }
}

/*
 * 删除前后空格
 */
function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}

/*
 * 锁定滚动条
 */
function scrollTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}
