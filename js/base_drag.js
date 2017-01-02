$().extend('drag', function() {
	var tags = arguments;
	for(var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], 'mousedown', function(e) {
			//			e.preventDefault();
            if(Trim(this.innerHTML).length == 0) e.preventDefault();    // 当要拖动的区域没有内容时，低版本firefox会有问题，阻止默认行为可解决。
            var _this = this,
				diffX = e.clientX - _this.offsetLeft,
				diffY = e.clientY - _this.offsetTop;
            // 自定义拖拽区域
			var flag = false;

			for(var j = 0; j < tags.length; j++) {
				if(e.target == tags[j]){
					flag = true;
					break;   // 比如两个标签能拖动，点住第一个拖动时不用去判断第二个标签，所以只要点击的那个为true了就跳出循环。
				}
			}

			if(flag) {
				addEvent(document, 'mousemove', move);
				addEvent(document, 'mouseup', up);
			} else {
				removeEvent(document, 'mousemove', move);
				removeEvent(document, 'mouseup', up);
			}

			function move(e) {
				var Left = e.clientX - diffX,
					Top = e.clientY - diffY;
				if(Left < 0) {
					Left = 0;
				} else
				if(Left > getInner().width - _this.offsetWidth) {
					Left = getInner().width - _this.offsetWidth;
				}
				if(Top < 0) {
					Top = 0;
				} else
				if(Top > getInner().height - _this.offsetHeight) {
					Top = getInner().height - _this.offsetHeight;
				}
				_this.style.left = Left + 'px';
				_this.style.top = Top + 'px';
				if(typeof _this.setCapture != 'undefined') {        // 兼容ie  必须和releaseCapture成对出现，可以让鼠标滑动到浏览器窗口之外也可以捕获到事件
					_this.setCapture();         // ie浏览器中当鼠标移出浏览器窗口区域，又会超出我限制的拖拽边界，所以要处理这个bug。
				}
			}

			function up(e) {
				removeEvent(document, 'mousemove', move)
				removeEvent(document, 'mouseup', up)
				if(typeof _this.releaseCapture != 'undefined') {        // 当我不需要捕获鼠标信息时要释放掉，否则别的线程就没法使用setCapture了。
					_this.releaseCapture();
				}
			}
		})
	}
	return this;
})