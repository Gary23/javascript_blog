window.onload = function() {
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
    // 而ie6、7、8的方法会在iframe加载完成后才执行


	// 个人中心
	$('.member').hover(function() {
		$('#header ul').show();
	}, function() {
		$('#header ul').hide();
	})

	// 登录框
	var login = $('#login')
	var screen = $('#screen')
	login.center(350, 250).resize(function() {
		if(login.css('display') == 'block') {
			screen.lock();
		}
	});
	$('.login').click(function() {
		login.center(350, 250).css('display', 'block');
		screen.lock();
	});
	$('.close').click(function() {
		login.css('display', 'none')
		screen.unlock();
	});

	//	登录框拖动
	login.drag([$('h2').getElement(0)]);


    alert(window.sys.chrome);
}