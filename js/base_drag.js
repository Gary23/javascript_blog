$().extend('drag', function(tags) {
	for(var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i], 'mousedown', function(e) {
			//			e.preventDefault();
			if(Trim(this.innerHTML).length == 0) e.preventDefault();
			var _this = this,
				diffX = e.clientX - _this.offsetLeft,
				diffY = e.clientY - _this.offsetTop;

			// 自定义拖拽区域
			var flag = false;

			for(var i = 0; i < tags.length; i++) {
				if(e.target == tags[i]){
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
				if(typeof _this.setCapture != 'undefined') {
					_this.setCapture();
				}
			}

			function up(e) {
				removeEvent(document, 'mousemove', move)
				removeEvent(document, 'mouseup', up)
				if(typeof _this.releaseCapture != 'undefined') {
					_this.releaseCapture();
				}
			}
		})
	}
	return this;
})