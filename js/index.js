//window.onload = function() {

$(function () {





})

$().ready(function(){
    // 个人中心
    $('#header .member').hover(function () {
        $('#header ul').show();
    }, function () {
        $('#header ul').hide();
    })

    // 登录框
    var login = $('#login')
    var screen = $('#screen')
    login.center(350, 250).resize(function () {
        if (login.css('display') == 'block') {
            screen.lock();
        }
    });
    $('#header .login').click(function () {
        login.center(350, 250).css('display', 'block');
        screen.lock().animate({
            'attr':'o',
            'target':40,
            'step':10
        });
    });
    $('#login .close').click(function () {
        login.css('display', 'none')
        screen.animate({
            'attr':'o',
            'target':0,
            'step':10,
            fn:function(){
                screen.unlock();
            }
        });
    });
    //	登录框拖动
    login.drag($('#login h2').first());

    // 百度分享
    $('#share').css('top',(getInner().height - parseInt(getStyle($('#share').first(),'height'))) / 2 + 'px')

    // 百度分享伸缩
    $('#share').hover(function(){
        $(this).animate({
            'attr':'x',
            'target':0
        })
    },function(){
        $(this).animate({
            'attr':'x',
            'target':-211
        })
    })





})


