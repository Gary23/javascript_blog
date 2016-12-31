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
        screen.lock();
    });
    $('#login .close').click(function () {
        login.css('display', 'none')
        screen.unlock();
    });
    //	登录框拖动
    login.drag($('#login h2').first());
})


