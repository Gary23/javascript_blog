// Base是一个基础库的核心对象
// 要实现链式编程，每次要返回的都是Base对象才访问Base自己的方法，如果是某个页面元素没法直接访问Base对象的方法。所以要用构造函数去new一个对象。

// 前台调用
// 每次调用$()都相当于创建了一个新的Base实例。方法之间不会相互污染。
var $ = function (args) {
    return new Base(args);
}

/*
 * 基础库
 * this.elements数组，用于保存html节点
 * 传入参数类名是string时便为css选择器。
 * 传入参数是对象时则为this。
 */
function Base(args) {
    this.elements = [];

    if (typeof args == 'string') {
        if (args.indexOf(' ') != -1) {
            var elements = args.split(' '),     // 将$('#id class tag')这种形式的选择器分割为elements数组。
                childElements = [],     // 存放临时节点对象的数组，每次开始循环要清空，因为循环结束会赋值给node，所以下次循环开始这个数组里的元素是没用的。
                node = [];        // 用来存放父节点,每次循环都要把获取的元素放到node，下一次循环就是上次循环的子节点，而node可以作为父节点使用。
            for (var i = 0; i < elements.length; i++) {
                if(node.length == 0) node.push(document);     // 如果没有父节点就将document放入，主要用于tag和class。这两个方法需要传父节点，id不需要父节点。
                switch (elements[i].charAt(0)) {
                    case '#':
                        childElements = [];
                        childElements.push(this.getId(elements[i].substring(1)));
                        node = childElements;
                        break;
                    case '.':
                        childElements = [];
                        for(var j = 0;j < node.length;j++){
                            var temps = this.getClass(elements[i].substring(1),node[j]);
                            for(var k = 0;k < temps.length;k++){
                                childElements.push(temps[k]);
                            }
                        }
                        node = childElements
                        break;
                    default :
                        childElements = [];
                        for(var j = 0;j < node.length;j++){
                            var temps = this.getTag(elements[i],node[j]);
                            for(var k = 0;k < temps.length;k++){
                                childElements.push(temps[k]);
                            }
                        }
                        node = childElements
                }
            }
            this.elements = childElements;
        } else {
            switch (args.charAt(0)) {	//这里为了使用find,所以要将获取的元素加到this.elements中去。
                case '#':
                    this.elements.push(this.getId(args.substring(1)));
                    break;
                case '.':
                    this.elements = this.getClass(args.substring(1));     // 返回的是temps数组，所以直接赋值即可
                    break;
                default:
                    this.elements = this.getTag(args);
            }
        }
    } else if (typeof args == 'object') {
        if (args != undefined) {
            this.elements[0] = args;    // 这里是让this参与链式编程。
        }
    }
}

//----------------------------------------------------------操作节点---------------------------------------------

/*
 * 获取id节点
 * 用于对象内部调用，前台不需要调用所以不需要return this.
 */
Base.prototype.getId = function (id) {
    return document.getElementById(id);
};

/*
 * 获取元素节点
 * 可以获取某个父节点下的元素节点，前台不需要调用所以不需要return this.
 */
Base.prototype.getTag = function (tag, parentNode) {
    var node = null,
        temps = [];
    if (parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var tags = node.getElementsByTagName(tag);
    for (var i = 0; i < tags.length; i++) {
        temps.push(tags[i]);
    }
    return temps;
}

/*
 * 获取class节点
 * 可以获取某个父节点下的class节点，前台不需要调用所以不需要return this.
 */
Base.prototype.getClass = function (className, parentNode) {
    var node = null,
        temps = [];
    if (parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var allTag = node.getElementsByTagName('*');
    for (var i = 0; i < allTag.length; i++) {
        if (allTag[i].className == className) {
            temps.push(allTag[i]);
        }
    }
    return temps;
}

/*
 * 设置CSS选择器的子节点
 * 想法是通过父节点来匹配子节点，找到子节点后就覆盖父节点。用找到的子节点继续编程。
 */
Base.prototype.find = function (str) {
    var childElements = [];		     // 临时数组，获取的子节点不能直接存放到this.elements，会和父节点冲突。
    for (var i = 0; i < this.elements.length; i++) {		// this.elements 存放的是父节点
        switch (str.charAt(0)) {
            case '#':
                childElements.push(this.getId(str.substring(1)))        // id节点是唯一的，不需要父节点。
                break;
            case '.':
                var temps = this.getClass(str.substring(1), this.elements[i]);
                for (var j = 0; j < temps.length; j++) {
                    childElements.push(temps[j]);
                }
                break;
            default:
                var temps = this.getTag(str, this.elements[i])
                for (var j = 0; j < temps.length; j++) {
                    childElements.push(temps[j]);
                }
        }
    }
    this.elements = childElements;    // 最后我已经找到了子节点，要父节点没有用了。
    return this;
}

//获取具体的某个节点，获取的是这个节点对象
Base.prototype.getElement = function (num) {
    return this.elements[num];
}
//获取具体的某个节点,并且返回Base对象用作链式编程
Base.prototype.eq = function (num) {
    var element = this.elements[num];
    this.elements = [];
    this.elements[0] = element;
    return this
}

//----------------------------------------------------------设置方法---------------------------------------------

//------------------------类名的方法---------------------------------------

//添加class类名，addClass('类名 类名')
Base.prototype.addClass = function (className) {
    var classArr = [];
    classArr = className.split(' ');
    for (var i = 0; i < this.elements.length; i++) {
        for (var j = 0; j < classArr.length; j++) {
            if (!hasClass(this.elements[i], classArr[j])) {
                this.elements[i].className += ' ' + classArr[j];
            }
        }
    }
    return this;
}

//删除class类名，removeClass('类名 类名')
Base.prototype.removeClass = function (className) {
    var classArr = [];
    classArr = className.split(' ');
    for (var i = 0; i < this.elements.length; i++) {
        var str = this.elements[i].className;
        for (var j = 0; j < classArr.length; j++) {
            if (hasClass(this.elements[i], classArr[j])) {
                str = str.replace(new RegExp('(\\s|^)' + classArr[j] + '(\\s|$)'), '')
            }
        }
        this.elements[i].className = str
    }
    return this;
}

//------------------------操作样式的方法---------------------------------------

// 实现css样式并且支持链式写法,css('height')或css('height','10px')或css({'height':'10px'})
Base.prototype.css = function (attr, value) {
    var k;
    for (var i = 0; i < this.elements.length; i++) {
        if (typeof attr == 'object') {
            for (k in attr) {
                this.elements[i].style[k] = attr[k];
            }
        } else {
            if (arguments.length == 1) {
                return getStyle(this.elements[i], attr)
            }
            this.elements[i].style[attr] = value;
        }
    }
    return this;
}

// 设置link或style中的CSS规则
Base.prototype.addRule = function (num, selectorText, cssText, position) {
    var sheet = document.styleSheets[num];
    insertRule(sheet, selectorText, cssText, position);
    return this;
}

// 删除link或style中的CSS规则
Base.prototype.removeRule = function (num, index) {
    var sheet = document.styleSheets[num];
    deleteRule(sheet, index);
    return this;
}

//------------------------操作DOM的方法---------------------------------------

// 实现html方法,html('文本')或html()
Base.prototype.html = function (str) {
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length == 0) {
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML = str;
    }
    return this;
}

// 设置元素居中,center(元素的宽,元素的高)
Base.prototype.center = function (width, height) {
    var Left = (getInner().width - width) / 2,
        Top = (getInner().height - height) / 2;
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.left = Left + 'px';
        this.elements[i].style.top = Top + 'px';
    }
    return this;
}

//------------------------实现特效的方法---------------------------------------

// 设置显示方法，show()
Base.prototype.show = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block'
    }
    return this;
}

// 设置隐藏方法,hide()
Base.prototype.hide = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none'
    }
    return this;
}

// 遮罩层锁屏方法,lock()
Base.prototype.lock = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.width = getInner().width + 'px';
        this.elements[i].style.height = getInner().height + 'px';
        this.elements[i].style.display = 'block'
        document.documentElement.style.overflow = 'hidden';
        addEvent(window, 'scroll', scrollTop);
    }
    return this;
}

// 遮罩层取消锁屏方法,unlock()
Base.prototype.unlock = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
        document.documentElement.style.overflow = 'auto';
        removeEvent(window, 'scroll', scrollTop);
    }
    return this;
}

//----------------------------------------------------------常用事件---------------------------------------------

// 设置鼠标移入移出的hover方法,hover(移入执行的fn,移出执行的fn)
Base.prototype.hover = function (overFn, outFn) {
    for (var i = 0; i < this.elements.length; i++) {
        //		this.elements[i].onmouseover = overFn;
        //		this.elements[i].onmouseout = outFn;
        addEvent(this.elements[i], 'mouseover', overFn);
        addEvent(this.elements[i], 'mouseout', outFn);
    }
    return this;
}

// 实现点击事件,click(点击执行的fn)
Base.prototype.click = function (fn) {
    for (var i = 0; i < this.elements.length; i++) {
        //		this.elements[i].addEventListener('click',fn)
        this.elements[i].onclick = fn;
    }
    return this;
}

// 触发浏览器窗口改变大小事件,resize(改变窗口尺寸执行的fn)
Base.prototype.resize = function (fn) {
    for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        addEvent(window, 'resize', function () {
            fn();
            if (element.offsetLeft > getInner().width - element.offsetWidth) {
                element.style.left = getInner().width - element.offsetWidth + 'px';
            }
            if (element.offsetTop > getInner().height - element.offsetHeight) {
                element.style.top = getInner().height - element.offsetHeight + 'px';
            }
        })

    }
    return this;
}

/*
 * 插件入口
 * 有很多插件比如拖拽、动画等不适每个页面都需要，可以在有需要的时候再通过这个方法引入。
 */
Base.prototype.extend = function (name, fn) {
    Base.prototype[name] = fn;
}