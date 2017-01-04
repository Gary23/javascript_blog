//window.onload = function() {

$(function() {

})

$().ready(function() {
	// 个人中心
	$('#header .member').hover(function() {

		$('#header ul').show().animate({
			mul: {
				opacity: 100,
				height: 100
			},
			step: 10
		})
	}, function() {
		$('#header ul').animate({
			mul: {
				opacity: 30,
				height: 0
			},
			step: 10,
			fn: function() {
				$('#header ul').hide();
			}
		})
	})

	//遮罩画布
	var screen = $('#screen')

	// 注册框
	var reg = $('#reg')
	reg.center(600, 550).resize(function() {
		if(reg.css('display') == 'block') {
			screen.lock();
		}
	});
	$('#header .reg').click(function() {
		reg.center(600, 550).css('display', 'block');
		screen.lock().animate({
			'attr': 'o',
			'target': 40,
			'step': 10
		});
	});
	$('#reg .close').click(function() {
		reg.css('display', 'none')
		screen.animate({
			'attr': 'o',
			'target': 0,
			'step': 10,
			fn: function() {
				screen.unlock();
			}
		});
	});

	// 表单验证部分

	// 初始化表单，解决刷新问题
	$('form').first().reset();

	// 用户名的验证
	$('form').form('user').bind('focus', function() {
		$('#reg .info_user').css('display', 'block')
		$('#reg .error_user').css('display', 'none')
		$('#reg .success_user').css('display', 'none')
	}).bind('blur', function() {
		if(Trim($(this).value()) == '') {
			$('#reg .info_user').css('display', 'none')
			$('#reg .error_user').css('display', 'none')
			$('#reg .success_user').css('display', 'none')
		} else if(!checkUser()) {
			$('#reg .info_user').css('display', 'none')
			$('#reg .error_user').css('display', 'block')
			$('#reg .success_user').css('display', 'none')
		} else {
			$('#reg .info_user').css('display', 'none')
			$('#reg .error_user').css('display', 'none')
			$('#reg .success_user').css('display', 'block')
		}
	})

	function checkUser() {
		if(/^[\w]{2,20}$/.test(Trim($('form').form('user').value()))) return true;
	}

	// 密码验证
	$('form').form('pwd').bind('focus', function() {
		$('#reg .info_pwd').css('display', 'block')
		$('#reg .error_pwd').css('display', 'none')
		$('#reg .success_pwd').css('display', 'none')
	}).bind('blur', function() {
		if(Trim($(this).value()) == '') {
			$('#reg .info_pwd').css('display', 'none')
			$('#reg .error_pwd').css('display', 'none')
			$('#reg .success_pwd').css('display', 'none')
		} else {
			if(checkPwd()) {
				$('#reg .info_pwd').css('display', 'none')
				$('#reg .error_pwd').css('display', 'none')
				$('#reg .success_pwd').css('display', 'block')
			} else {
				$('#reg .info_pwd').css('display', 'none')
				$('#reg .error_pwd').css('display', 'block')
				$('#reg .success_pwd').css('display', 'none')
			}
		}
	})

	// 密码强度验证
	$('form').form('pwd').bind('keyup', function() {
		checkPwd();
	})

	// 密码验证函数
	function checkPwd() {
		// 密码验证的三个条件
		var value = Trim($('form').form('pwd').value());
		var value_length = value.length;
		var code_length = 0;
		// 密码验证的第一个条件是字符在6-20位之间
		if(value_length >= 6 && value_length <= 20) {
			$('#reg .info_pwd .q1').html('●').css('color', 'green');
		} else {
			$('#reg .info_pwd .q1').html('○').css('color', '#666');
		}
		// 密码验证的第二个条件是，字母或数组或非空字符，任意一个即可,value在上面处理了前后空格，现在中间也不能掺杂空格
		if(value.length > 0 && !/\s/.test(value)) {
			$('#reg .info_pwd .q2').html('●').css('color', 'green');

		} else {
			$('#reg .info_pwd .q2').html('○').css('color', '#666');

		}

		// 密码验证的第三个条件,大写子=字母、小写字母、数字、飞空字符两种
		if(/[\d]/.test(value)) {
			code_length++;
		}
		if(/[a-z]/.test(value)) {
			code_length++;
		}
		if(/[A-Z]/.test(value)) {
			code_length++;
		}
		if(/[^\w]/.test(value)) {
			code_length++;
		}
		if(code_length >= 2) {
			$('#reg .info_pwd .q3').html('●').css('color', 'green');
		} else {
			$('#reg .info_pwd .q3').html('○').css('color', '#666');
		}

		// 安全级别验证，一定要从高开始判断
		if(value_length >= 10 && code_length >= 3) {
			$('#reg .info_pwd .s1').css('color', 'green');
			$('#reg .info_pwd .s2').css('color', 'green');
			$('#reg .info_pwd .s3').css('color', 'green');
			$('#reg .info_pwd .s4').html('高').css('color', 'green');
		} else if(value_length >= 8 && code_length >= 2) {
			$('#reg .info_pwd .s1').css('color', '#f60');
			$('#reg .info_pwd .s2').css('color', '#f60');
			$('#reg .info_pwd .s3').css('color', '#ccc');
			$('#reg .info_pwd .s4').html('中').css('color', '#f60');
		} else if(value_length >= 1) {
			$('#reg .info_pwd .s1').css('color', 'maroon');
			$('#reg .info_pwd .s2').css('color', '#ccc');
			$('#reg .info_pwd .s3').css('color', '#ccc');
			$('#reg .info_pwd .s4').html('低').css('color', 'maroon');
		} else {
			$('#reg .info_pwd .s1').css('color', '#ccc');
			$('#reg .info_pwd .s2').css('color', '#ccc');
			$('#reg .info_pwd .s3').css('color', '#ccc');
			$('#reg .info_pwd .s4').html('').css('color', '#ccc');
		}
		// 要判断满足上面的三个条件才能注册
		if(value_length >= 6 && value_length <= 20 && !/\s/.test(value) && code_length >= 2) {
			return true;
		} else {
			return false;
		}

	}

	// 密码确认验证
	$('form').form('notpwd').bind('focus', function() {
		$('#reg .info_notpwd').css('display', 'block')
		$('#reg .error_notpwd').css('display', 'none')
		$('#reg .success_notpwd').css('display', 'none')
	}).bind('blur', function() {
		if(Trim($(this).value()) == '') {
			$('#reg .info_notpwd').css('display', 'none')
			$('#reg .error_notpwd').css('display', 'none')
			$('#reg .success_notpwd').css('display', 'none')
		} else if(checkNotepwd()) {
			$('#reg .info_notpwd').css('display', 'none')
			$('#reg .error_notpwd').css('display', 'none')
			$('#reg .success_notpwd').css('display', 'block')
		} else {
			$('#reg .info_notpwd').css('display', 'none')
			$('#reg .error_notpwd').css('display', 'block')
			$('#reg .success_notpwd').css('display', 'none')
		}
	})

	function checkNotepwd() {
		if(Trim($('form').form('notpwd').value()) == Trim($('form').form('pwd').value())) return true;
	}

	// 提问部分
	$('form').form('ques').bind('change', function() {
		if(checkQues()) {
			$('#reg .error_ques').css('display', 'none')
		}
	})

	function checkQues() {
		if($('form').form('ques').value == 0) return true;
	}

	//问题回答验证
	$('form').form('ans').bind('focus', function() {
		$('#reg .info_ans').css('display', 'block')
		$('#reg .error_ans').css('display', 'none')
		$('#reg .success_ans').css('display', 'none')
	}).bind('blur', function() {
		if(Trim($(this).value()) == '') {
			$('#reg .info_ans').css('display', 'none')
			$('#reg .error_ans').css('display', 'none')
			$('#reg .success_ans').css('display', 'none')
		} else if(checkAns()) {
			$('#reg .info_ans').css('display', 'none')
			$('#reg .error_ans').css('display', 'none')
			$('#reg .success_ans').css('display', 'block')
		} else {
			$('#reg .info_ans').css('display', 'none')
			$('#reg .error_ans').css('display', 'block')
			$('#reg .success_ans').css('display', 'none')
		}
	})

	function checkAns() {
		if($('form').form('ans').value().length >= 2 && $('form').form('ans').value().length <= 32) return true;
	}

	// 邮箱验证
	$('form').form('email').bind('focus', function() {
		// 补全界面     如果已经输入到了@就不显示补全界面了
		if($(this).value().indexOf('@') == -1) $('#reg .all_email').css('display', 'block')
			// 邮箱验证
		$('#reg .info_email').css('display', 'block')
		$('#reg .error_email').css('display', 'none')
		$('#reg .success_email').css('display', 'none')
	}).bind('blur', function() {
		$('#reg .all_email').css('display', 'none') // 补全界面

		if(Trim($(this).value()) == '') {
			$('#reg .info_email').css('display', 'none')
			$('#reg .error_email').css('display', 'none')
			$('#reg .success_email').css('display', 'none')
		} else if(checkEmail()) {
			$('#reg .info_email').css('display', 'none')
			$('#reg .error_email').css('display', 'none')
			$('#reg .success_email').css('display', 'block')
		} else {
			$('#reg .info_email').css('display', 'none')
			$('#reg .error_email').css('display', 'block')
			$('#reg .success_email').css('display', 'none')
		}
	})

	function checkEmail() {
		if(/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(Trim($('form').form('email').value()))) return true;
	}

	// 邮箱补全系统输入
	$('form').form('email').bind('keyup', function() {
		if($(this).value().indexOf('@') == -1) { // 实时判断，有@就不显示补全，没有就显示
			$('#reg .all_email').css('display', 'block');
			$('#reg .all_email li span').html($(this).value());
		} else {
			$('#reg .all_email').css('display', 'none');
		}

		if(event.keyCode == 40) { // 下方向按键  通过之前封装event已经做过兼容处理
			if(this.index == undefined || this.index >= $('#reg .all_email li').length() - 1) {
				this.index = 0;
			} else {
				this.index++;
			}
			$('#reg .all_email li').css('background', 'none'); // 排他思想
			$('#reg .all_email li').css('color', '#666');

			$('#reg .all_email li').eq(this.index).css('background', '#e5edf2');
			$('#reg .all_email li').eq(this.index).css('color', '#369');
		}

		if(event.keyCode == 38) { // 上方向按键
			if(this.index == undefined || this.index <= 0) {
				this.index = $('#reg .all_email li').length() - 1;
			} else {
				this.index--;
			}
			$('#reg .all_email li').css('background', 'none'); // 排他思想
			$('#reg .all_email li').css('color', '#666');

			$('#reg .all_email li').eq(this.index).css('background', '#e5edf2');
			$('#reg .all_email li').eq(this.index).css('color', '#369');
		}

		if(event.keyCode == 13) { // 回车键
			$(this).value($('#reg .all_email li').eq(this.index).text());
			$('#reg .all_email').css('display', 'none');
			this.index = undefined;
		}
	})

	// 点击补全选项就获取
	$('#reg .all_email li').bind('mousedown', function() {
		$('form').form('email').value($(this).text());
	})

	// 邮箱补全效果的移入移出
	$('#reg .all_email li').hover(function() {
		$(this).css('background', '#e5edf2');
		$(this).css('color', '#369');
	}, function() {
		$(this).css('background', 'none');
		$(this).css('color', '#666');
	})

	//日期部分表单选择
	var year = $('form').form('year');
	var month = $('form').form('month');
	var day = $('form').form('day');
	var day30 = [4, 6, 9, 11];
	var day31 = [1, 3, 5, 7, 8, 10, 12];
	// 注入年
	for(var i = 1950; i <= 2016; i++) {
		year.first().add(new Option(i, i), undefined);
	}
	//注入月
	for(var i = 1; i <= 12; i++) {
		month.first().add(new Option(i, i), undefined);
	}
	//注入日
	year.bind('change', select_day)
	month.bind('change', select_day)
	day.bind('change', function() {
		if(checkBirthday()) $('#reg .error_birthday').css('display', 'none')

	})

	//注入日的函数
	function select_day() {
		if(year.value() != 0 && month.value() != 0) { // 先判断年和月有没有值
			// 清理之前的注入，解决day累加的问题
			day.first().options.length = 1; // 强行让day下拉框只留下一个选项，

			var current_day = 0;

			if(inArray(day31, parseInt(month.value()))) { // 获取的是字符串，需要转换
				current_day = 31;
			} else if(inArray(day30, parseInt(month.value()))) {
				current_day = 30;
			} else {
				// 判断闰年和平年的2月，闰年：能被4整除，如果最后两位是00的年份(1900,2000),需要被400整除才行，所以判断(必须被4整除&&最后两位不是00的年份) || (判断能被400整除的)
				if((parseInt(year.value()) % 4 == 0 && parseInt(year.value()) % 100 != 0) || parseInt(year.value()) % 400 == 0) {
					current_day = 29;
				} else {
					current_day = 28;
				}
			}

			for(var i = 1; i <= current_day; i++) { // 在这里统一注入日
				day.first().add(new Option(i, i), undefined);
			}

		} else {
			day.first().options.length = 1; // 如果年和月没选择，那么日要清零
		}
	}

	function checkBirthday() {
		if(year.value() != 0 && month.value() != 0 && day.value() != 0) return true;
	}

	//备注部分
	$('form').form('ps').bind('keyup', checkPs).bind('paste', function() {
		setTimeout(check_ps, 50); // 解决鼠标右键粘贴后检测字数不执行的问题， 粘贴事件执行时间早，所以当'paste'执行时文字并没有获取到自然无法检测字数，所以让'paste'事件延迟50毫秒
	})

	// 清尾
	$('#reg .ps .clear').click(function() {
		$('form').form('ps').value($('form').form('ps').value().substring(0, 200));
		checkPs()
	})

	//检测备注字数的函数
	function checkPs() {
		var num = 200 - $('form').form('ps').value().length;
		if(num >= 0) {
			$('#reg .ps').eq(0).css('display', 'block');
			$('#reg .ps .num').eq(0).html(num);
			$('#reg .ps').eq(1).css('display', 'none');
			return true;
		} else {
			$('#reg .ps').eq(0).css('display', 'none');
			$('#reg .ps .num').eq(1).html(Math.abs(num)).css('color', 'red');
			$('#reg .ps').eq(1).css('display', 'block');
			return false;
		}
	}

	//提交
	$('form').form('sub').click(function() {
		var flag = true;
		if(!checkUser()) {
			$('#reg .error_user').css('display', 'block');
			flag = false;
		}
		if(!checkPwd()) {
			$('#reg .error_pwd').css('display', 'block');
			flag = false;
		}
		if(!checkNotepwd()) {
			$('#reg .error_notpwd').css('display', 'block');
			flag = false;
		}
		if(checkQues()) {
			$('#reg .error_ques').css('display', 'block');
			flag = false;
		}
		if(!checkAns()) {
			$('#reg .error_ans').css('display', 'block');
			flag = false;
		}
		if(!checkEmail()) {
			$('#reg .error_email').css('display', 'block');
			flag = false;
		}
		if(!checkBirthday()) {
			$('#reg .error_birthday').css('display', 'block');
			flag = false;
		}
		if(!checkPs()) {
			flag = false;
		}
		if(flag) {
			ajax({
				method: 'get',
				url: '/project/javascript-blog/php/demo.php',
				data: $('form').eq(0).serialize(),
				success: function(data) {
					alert(data);
				},
				async: true
			})
		}

	})

	// 登录框
	var login = $('#login')
	login.center(350, 250).resize(function() {
		if(login.css('display') == 'block') {
			screen.lock();
		}
	});
	$('#header .login').click(function() {
		login.center(350, 250).css('display', 'block');
		screen.lock().animate({
			'attr': 'o',
			'target': 40,
			'step': 10
		});
	});
	$('#login .close').click(function() {
		login.css('display', 'none')
		screen.animate({
			'attr': 'o',
			'target': 0,
			'step': 10,
			fn: function() {
				screen.unlock();
			}
		});
	});

	//	登录框拖动
	login.drag($('#login h2').first());
	reg.drag($('#reg h2').first());

	// 百度分享
	$('#share').css('top', getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height'))) / 2 + 'px')

	$(window).bind('scroll', function() {
		$('#share').css('top', getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height'))) / 2 + 'px')

	});

	//addEvent(window, 'scroll', function () {
	//    $('#share').css('top', getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height'))) / 2 + 'px')
	//
	//})

	// 百度分享伸缩
	$('#share').hover(function() {
		$(this).animate({
			'attr': 'x',
			'target': 0
		})
	}, function() {
		$(this).animate({
			'attr': 'x',
			'target': -211
		})
	})

	// 导航部分
	$('#nav .about li').hover(function() {
		var target = $(this).first().offsetLeft;
		$('#nav .nav_bg').animate({
			attr: 'x',
			target: target + 20,
			speed: 10,
			fn: function() {
				$('#nav .white').animate({
					attr: 'x',
					target: -target,

				})
			}
		})
	}, function() {
		$('#nav .nav_bg').animate({
			attr: 'x',
			target: 20,
			speed: 10,
			fn: function() {
				$('#nav .white').animate({
					attr: 'x',
					target: 0,
					t: 6
				})
			}
		})
	})

	$('#sidebar h2').toggle(function() {
		$(this).next().animate({
			mul: {
				height: 0,
				opacity: 0
			}
		})
	}, function() {
		$(this).next().animate({
			mul: {
				height: 150,
				opacity: 100
			}
		})
	})

	//轮播图部分初始化      // 页面刚打开时候的样子
	$('#banner img').opacity(0);
	$('#banner img').eq(0).opacity(100);
	$('#banner ul li').css('color', '#999')
	$('#banner ul li').eq(0).css('color', '#333')
	$('#banner strong').html($('#banner img').eq(0).attr('alt'))
	var bannerIndex = 1; // 轮播计时器
	var bannerType = 1;

	// 自动轮播图
	var bannerTimer = setInterval(bannerFn, 2000)

	// 手动控制轮播图
	$('#banner ul li').hover(function() {
		clearInterval(bannerTimer)
		banner(this, bannerIndex == 0 ? $('#banner ul li').length() - 1 : bannerIndex - 1) // 传入参数前一张的索引

	}, function() {
		bannerIndex = $(this).index() + 1;
		bannerTimer = setInterval(bannerFn, 2000)
	})

	function banner(obj, prev) { // 传入的是DOM对象，所以$(obj)才能用.css
		// 传入的参数obj不管是li还是img都无所谓，我只要取它们索引值就行。它们的索引值相同，
		// 这是负责点的部分
		$('#banner ul li').css('color', '#999');
		$(obj).css('color', '#333');
		$('#banner strong').html($('#banner img').eq($(obj).index()).attr('alt'))

		// 这是负责轮播的部分
		if(bannerType == 1) { // 值为1时是透明度运动
			$('#banner img').eq(prev).animate({ //轮播时两张图片切换时透明度接不上，会导致变白再显示下一张，所以让上一张渐渐透明度变0，有个过度。
				attr: 'o',
				target: 0,
				t: 30,
				step: 10
			}).css('zIndex', '1'); // 上一张层级设为较低的才会被切换的第二章覆盖。否则一直是最后一张。
			$('#banner img').eq($(obj).index()).animate({
				attr: 'o',
				target: 100,
				t: 30,
				step: 10
			}).css('zIndex', '2')
		} else if(bannerType == 2) { // 值为2时是上下运动
			$('#banner img').eq(prev).animate({
				attr: 'y',
				target: 166,
				t: 17,
				step: 10
			}).css('zIndex', '1').opacity(100);;
			$('#banner img').eq($(obj).index()).animate({
				attr: 'y',
				target: 0,
				t: 17,
				step: 10
			}).css('top', '-166px').css('zIndex', '2').opacity(100);
		}
		//$('#banner img').eq($(obj).index()).css('display','block');

	}

	function bannerFn() {
		if(bannerIndex >= $('#banner ul li').length()) bannerIndex = 0;
		banner($('#banner ul li').eq(bannerIndex).first(), bannerIndex == 0 ? $('#banner ul li').length() - 1 : bannerIndex - 1);
		bannerIndex++;
	}

	// 懒加载部分
	var waitLoad = $('.wait_load');
	waitLoad.opacity(0);
	$(window).bind('scroll', waitLoadFn)
	$(window).bind('resize', waitLoadFn)

	function waitLoadFn() {
		setTimeout(function() {
			for(var i = 0; i < waitLoad.length(); i++) {
				var _this = waitLoad.getElement(i); // 每次取出遍历到的图片的DOM对象。否则循环中的事件访问不到i的值，其实就相当于自定义属性。

				if(getInner().height + getScroll().top >= offsetTop(_this)) { // 判断整个窗口高度 + 卷曲值 如果 >= 图片的位置就加载
					$(_this).attr('src', $(_this).attr('xsrc')).animate({
						attr: 'o',
						target: 100,
						t: 30,
						step: 10
					})
				}

			}
		}, 100)
	}

	// 预加载部分,图片弹窗,和登录注册一样，只是加上了卷曲值
	var photoBig = $('#photo_big')
	photoBig.center(620, 511).resize(function() {
		if(photoBig.css('display') == 'block') {
			screen.lock();
		}
	});

	// 点击懒加载的图片列表触发的事件
	$('#photo dl dt img').click(function() {
		photoBig.center(620, 511).css('display', 'block');
		screen.lock().animate({
			'attr': 'o',
			'target': 40,
			'step': 10
		});
		// 大图片加载
		var tempImg = new Image(); // 创建一个临时区域的图片对象

		$(tempImg).bind('load', function() { // load是image对象的事件，图片加载完之后才执行的事件
				$('#photo_big .big img').attr('src', tempImg.src).animate({
					attr: 'o',
					target: 100,
					t: 30,
					step: 10
				}).css({
					'width': '600px',
					'height': '450px',
					'top': '0'
				}).opacity(0);
			})
			// 这里只要写了.src就能加载到缓存中，不需要再去调用
		tempImg.src = $(this).attr('bigsrc'); // ie8浏览器必须将src地址放在load事件的后面，

		// 让前后的图片预加载
		var children = this.parentNode.parentNode;
		//		var prev = prevIndex($(children).index(), children.parentNode); // 当前节点的前一个索引和后一个索引
		//		var next = nextIndex($(children).index(), children.parentNode);
		//
		//		var prevImg = new Image();
		//		var nextImg = new Image();
		//
		//		prevImg.src = $('#photo dl dt img').eq(prev).attr('bigsrc'); // 打开当前图片会加载前一张和后一张到缓存中
		//		nextImg.src = $('#photo dl dt img').eq(next).attr('bigsrc');
		//		
		//		$('#photo_big .big .left').attr('src',prevImg.src)		// 图片左右切换的src
		//		$('#photo_big .big .right').attr('src',nextImg.src)
		//		$('#photo_big .big img').attr('index',$(children).index())

		prevNextImg(children)

		if(offsetTop(photoBig.first()) <= 0 + getScroll().top) {
			photoBig.css('top', 0 + getScroll().top + 'px');
		}

	});

	$('#photo_big .close').click(function() {
		photoBig.css('display', 'none')
		screen.animate({
			'attr': 'o',
			'target': 0,
			'step': 10,
			fn: function() {
				screen.unlock();
			}
		});
		$('#photo_big .big img').attr('src', "img/loading.gif").css({
			'width': '32px',
			'height': '32px',
			'top': '190px'
		})

	});
	// 拖拽
	photoBig.drag($('#photo_big h2').first());

	// 图片的左右箭头划过显示
	$('$photo_big .big .left').hover(function() {
		$('$photo_big .big .sl').animate({
			attr: 'o',
			target: 50,
			t: 30,
			step: 10
		})
	}, function() {
		$('$photo_big .big .sl').animate({
			attr: 'o',
			target: 0,
			t: 30,
			step: 10
		})
	})

	$('$photo_big .big .right').hover(function() {
			$('$photo_big .big .sr').animate({
				attr: 'o',
				target: 50,
				t: 30,
				step: 10
			})
		}, function() {
			$('$photo_big .big .sr').animate({
				attr: 'o',
				target: 0,
				t: 30,
				step: 10
			})
		})
		// 上一张图片
	$('#photo_big .big .left').click(function() {
		$('#photo_big .big img').attr('src', "img/loading.gif").css({ // 两张图片切换时，如果网速不快会显示loading这张图片
			'width': '32px',
			'height': '32px',
			'top': '190px'
		})

		var currentImg = new Image();
		$(currentImg).bind('load', function() {
			$('#photo_big .big img').attr('src', currentImg.src).animate({ // .left的src是上一张的src，所以在这里将src的地址赋值给当前img，就显示到了上一张的src
				attr: 'o', // 这个索引值是弹出大图框之后获取到的大图的索引
				target: 100,
				t: 30,
				step: 10
			}).opacity(0).css({
				'width': '600px',
				'height': '450px',
				'top': '0'
			});
		})

		currentImg.src = $(this).attr('src')

		// 获取小图列表的dl，只能从小图中去求索引，然后用在大图上，因为大图的src是点击只有才生成的，没法获取索引
		var children = $('#photo dl dt img').getElement(prevIndex($('#photo_big .big img').attr('index'), $('#photo').first())).parentNode.parentNode;
		prevNextImg(children);
	})

	// 下一张图片
	$('#photo_big .big .right').click(function() {
		$('#photo_big .big img').attr('src', "img/loading.gif").css({ // 两张图片切换时，如果网速不快会显示loading这张图片
			'width': '32px',
			'height': '32px',
			'top': '190px'
		})

		var currentImg = new Image();
		$(currentImg).bind('load', function() {
			$('#photo_big .big img').attr('src', currentImg.src).animate({
				attr: 'o',
				target: 100,
				t: 30,
				step: 10
			}).opacity(0).css({
				'width': '600px',
				'height': '450px',
				'top': '0'
			});
		})

		currentImg.src = $(this).attr('src')

		var children = $('#photo dl dt img').getElement(nextIndex($('#photo_big .big img').attr('index'), $('#photo').first())).parentNode.parentNode;
		prevNextImg(children);
	})

	// 大图左右切换的函数
	function prevNextImg(children) {
		var prev = prevIndex($(children).index(), children.parentNode); // 此时打开的大图索引=2，left.src=1,right.src=3.
		var next = nextIndex($(children).index(), children.parentNode); // 我点击left的时候，需要做到：大图索引=left.src,left.src=0,right.src=2
		// 所以$(children).index()是此时大图的上一张的，而prev是上一张的上一张。
		// 因为我点击之后上一张就变为看到的大图，那么就需要在同时将点击之前上一张的上一张的src赋值给left.src
		var prevImg = new Image();
		var nextImg = new Image();

		prevImg.src = $('#photo dl dt img').eq(prev).attr('bigsrc');
		nextImg.src = $('#photo dl dt img').eq(next).attr('bigsrc');

		$('#photo_big .big .left').attr('src', prevImg.src) // 再重新赋值图片左右的src
		$('#photo_big .big .right').attr('src', nextImg.src)
		$('#photo_big .big img').attr('index', $(children).index())

		$('#photo_big .big .index').html($(children).index() + 1 + '/' + $('#photo dl dt img').length()); // 图片左下角的索引
	}

	// 调用ajax
	//	$(document).click(function(){
	//		ajax({
	//			method:'get',
	//			url:'/project/javascript-blog/php/demo.php',
	//			data:{
	//				'name':'tom',
	//				'age':100
	//			},
	//			success:function(data){
	//				alert(data);
	//			},
	//			async:true
	//		})
	//	})

})