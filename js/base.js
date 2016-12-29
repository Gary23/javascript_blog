// Base是一个基础库的核心对象
// 要实现链式编程，每次要返回的都是Base对象才访问Base自己的方法，如果是某个页面元素没法直接访问Base对象的方法。所以要用构造函数去new一个对象。

// 前台调用
// 每次调用$()都相当于创建了一个新的Base实例。方法之间不会相互污染。
var $ = function(_this) {
	return new Base(_this);
}

// 基础库
function Base(_this) {
	// 创建一个数组，来保存节点和节点数组
	this.elements = [];
	//	console.log(_this)
	//	this.elements[0] = _this;
	if(_this != undefined) {
		this.elements[0] = _this;
	}
}

//----------------------------------------------------------操作节点---------------------------------------------

// 获取id节点,getId('id名')
Base.prototype.getId = function(id) {
	this.elements.push(document.getElementById(id));
	return this;
};

// 获取元素节点，也可以获取某个id下的标签。getTag('标签名')或getTag('标签名','id名')
Base.prototype.getTag = function(tag, idName) {
	var node = null;
	if(arguments.length == 2) {
		node = document.getElementById(idName);
	} else {
		node = document;
	}
	var tags = node.getElementsByTagName(tag),
		l = tags.length;
	for(var i = 0; i < l; i++) {
		this.elements.push(tags[i]);
	}
	return this;
}

// 获取class节点,也可以获取某个id下的class。getClass('class名')或getClass('class名','id名')
Base.prototype.getClass = function(className, idName) {
	var node = null;
	if(arguments.length == 2) {
		node = document.getElementById(idName);
	} else {
		node = document;
	}
	var allTag = node.getElementsByTagName('*'),
		l = allTag.length;
	for(var i = 0; i < l; i++) {
		if(allTag[i].className.indexOf(className) != -1) {
			this.elements.push(allTag[i]);
		}
	}
	return this;
}

//获取具体的某个节点，获取的是这个节点对象
Base.prototype.getElement = function(num) {
	return this.elements[num];
}
//获取具体的某个节点,并且返回Base对象用作链式编程
Base.prototype.eq = function(num){
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this	
}

//----------------------------------------------------------设置方法---------------------------------------------

//------------------------类名的方法---------------------------------------

//添加class类名，addClass('类名 类名')
Base.prototype.addClass = function(className) {
	var classArr = [];
	classArr = className.split(' ');
	for(var i = 0; i < this.elements.length; i++) {
		for(var j = 0; j < classArr.length; j++) {
			if(!hasClass(this.elements[i], classArr[j])) {
				this.elements[i].className += ' ' + classArr[j];
			}
		}
	}
	return this;
}

//删除class类名，removeClass('类名 类名')
Base.prototype.removeClass = function(className) {
	var classArr = [];
	classArr = className.split(' ');
	for(var i = 0; i < this.elements.length; i++) {
		var str = this.elements[i].className;
		for(var j = 0; j < classArr.length; j++) {
			if(hasClass(this.elements[i], classArr[j])) {
				str = str.replace(new RegExp('(\\s|^)' + classArr[j] + '(\\s|$)'), '')
			}
		}
		this.elements[i].className = str
	}
	return this;
}

//------------------------操作样式的方法---------------------------------------

// 实现css样式并且支持链式写法,css('height')或css('height','10px')或css({'height':'10px'})
Base.prototype.css = function(attr, value) {
	var k;
	for(var i = 0; i < this.elements.length; i++) {
		if(typeof attr == 'object') {
			for(k in attr) {
				this.elements[i].style[k] = attr[k];
			}
		} else {
			if(arguments.length == 1) {
				return getStyle(this.elements[i], attr)
			}
			this.elements[i].style[attr] = value;
		}
	}
	return this;
}

// 设置link或style中的CSS规则
Base.prototype.addRule = function(num, selectorText, cssText, position) {
	var sheet = document.styleSheets[num];
	insertRule(sheet, selectorText, cssText, position);
	return this;
}

// 删除link或style中的CSS规则
Base.prototype.removeRule = function(num, index) {
	var sheet = document.styleSheets[num];
	deleteRule(sheet, index);
	return this;
}

//------------------------操作DOM的方法---------------------------------------

// 实现html方法,html('文本')或html()
Base.prototype.html = function(str) {
	for(var i = 0; i < this.elements.length; i++) {
		if(arguments.length == 0) {
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML = str;
	}
	return this;
}

// 设置元素居中,center(元素的宽,元素的高)
Base.prototype.center = function(width, height) {
	var Left = (getInner().width - width) / 2,
		Top = (getInner().height - height) / 2;
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.left = Left + 'px';
		this.elements[i].style.top = Top + 'px';
	}
	return this;
}

//------------------------实现特效的方法---------------------------------------

// 设置显示方法，show()
Base.prototype.show = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'block'
	}
	return this;
}

// 设置隐藏方法,hide()
Base.prototype.hide = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'none'
	}
	return this;
}

// 遮罩层锁屏方法,lock()
Base.prototype.lock = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.width = getInner().width + 'px';
		this.elements[i].style.height = getInner().height + 'px';
		this.elements[i].style.display = 'block'
		document.documentElement.style.overflow = 'hidden';
		addEvent(window,'scroll',scrollTop);
	}
	return this;
}

// 遮罩层取消锁屏方法,unlock()
Base.prototype.unlock = function() {
	for(var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = 'none';
		document.documentElement.style.overflow = 'auto';
		removeEvent(window,'scroll',scrollTop);
	}
	return this;
}


//----------------------------------------------------------常用事件---------------------------------------------

// 设置鼠标移入移出的hover方法,hover(移入执行的fn,移出执行的fn)
Base.prototype.hover = function(overFn, outFn) {
	for(var i = 0; i < this.elements.length; i++) {
		//		this.elements[i].onmouseover = overFn;
		//		this.elements[i].onmouseout = outFn;
		addEvent(this.elements[i], 'mouseover', overFn);
		addEvent(this.elements[i], 'mouseout', outFn);
	}
	return this;
}

// 实现点击事件,click(点击执行的fn)
Base.prototype.click = function(fn) {
	for(var i = 0; i < this.elements.length; i++) {
		//		this.elements[i].addEventListener('click',fn)
		this.elements[i].onclick = fn;
	}
	return this;
}

// 触发浏览器窗口改变大小事件,resize(改变窗口尺寸执行的fn)
Base.prototype.resize = function(fn) {
	for(var i = 0; i < this.elements.length; i++) {
		var element = this.elements[i];
		addEvent(window, 'resize', function() {
			fn();
			if(element.offsetLeft > getInner().width - element.offsetWidth) {
				element.style.left = getInner().width - element.offsetWidth + 'px';
			}
			if(element.offsetTop > getInner().height - element.offsetHeight) {
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
Base.prototype.extend = function(name,fn){
	Base.prototype[name] = fn;
}