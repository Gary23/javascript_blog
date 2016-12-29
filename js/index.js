window.onload = function() {
	// 个人中心
	$().getClass('member').hover(function() {
		$().getTag('ul', 'header').show();
	}, function() {
		$().getTag('ul', 'header').hide();
	})

	// 登录框
	var login = $().getId('login')
	var screen = $().getId('screen')
	login.center(350, 250).resize(function() {
		if(login.css('display') == 'block') {
			screen.lock();
		}
	});
	$().getClass('login').click(function() {
		login.center(350, 250).css('display', 'block');
		screen.lock();
	});
	$().getClass('close').click(function() {
		login.css('display', 'none')
		screen.unlock();
	});

	//	登录框拖动
	login.drag([$().getTag('h2').getElement(0)]);


}