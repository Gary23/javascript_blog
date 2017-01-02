//window.onload = function() {

$(function () {


})

$().ready(function () {
    // 个人中心
    $('#header .member').hover(function () {

        $('#header ul').show().animate({
            mul: {
                opacity: 100,
                height: 100
            },
            step: 10
        })
    }, function () {
        $('#header ul').animate({
            mul: {
                opacity: 30,
                height: 0
            },
            step: 10,
            fn: function () {
                $('#header ul').hide();
            }
        })
    })

    //遮罩画布
    var screen = $('#screen')

    // 注册框
    var reg = $('#reg')
    reg.center(600, 550).resize(function () {
        if (reg.css('display') == 'block') {
            screen.lock();
        }
    });
    $('#header .reg').click(function () {
        reg.center(600, 550).css('display', 'block');
        screen.lock().animate({
            'attr': 'o',
            'target': 40,
            'step': 10
        });
    });
    $('#reg .close').click(function () {
        reg.css('display', 'none')
        screen.animate({
            'attr': 'o',
            'target': 0,
            'step': 10,
            fn: function () {
                screen.unlock();
            }
        });
    });

    // 表单验证部分

    // 初始化表单，解决刷新问题
    $('form').first().reset();

    // 用户名的验证
    $('form').form('user').bind('focus', function () {
        $('#reg .info_user').css('display', 'block')
        $('#reg .error_user').css('display', 'none')
        $('#reg .success_user').css('display', 'none')
    }).bind('blur', function () {
        if (Trim($(this).value()) == '') {
            $('#reg .info_user').css('display', 'none')
            $('#reg .error_user').css('display', 'none')
            $('#reg .success_user').css('display', 'none')
        } else if (/[\w]{2,20}/.test(Trim($(this).value())) && $(this).value().length >= 2 && $(this).value().length <= 20) {
            $('#reg .info_user').css('display', 'none')
            $('#reg .error_user').css('display', 'none')
            $('#reg .success_user').css('display', 'block')
        } else {
            $('#reg .info_user').css('display', 'none')
            $('#reg .error_user').css('display', 'block')
            $('#reg .success_user').css('display', 'none')
        }
    })

    // 密码验证
    $('form').form('pwd').bind('focus', function () {
        $('#reg .info_pwd').css('display', 'block')
        $('#reg .error_pwd').css('display', 'none')
        $('#reg .success_pwd').css('display', 'none')
    }).bind('blur', function () {
        if (Trim($(this).value()) == '') {
            $('#reg .info_pwd').css('display', 'none')
            $('#reg .error_pwd').css('display', 'none')
            $('#reg .success_pwd').css('display', 'none')
        } else {
            if (checkPwd(this)) {
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
    $('form').form('pwd').bind('keyup', function () {
        checkPwd(this);

    })
    // 密码验证函数
    function checkPwd(_this) {
        // 密码验证的三个条件
        var value = Trim($(_this).value());
        var value_length = value.length;
        var code_length = 0;
        var flag = false;
        // 密码验证的第一个条件是字符在6-20位之间
        if (value_length >= 6 && value_length <= 20) {
            $('#reg .info_pwd .q1').html('●').css('color', 'green');
        } else {
            $('#reg .info_pwd .q1').html('○').css('color', '#666');
        }
        // 密码验证的第二个条件是，字母或数组或非空字符，任意一个即可,value在上面处理了前后空格，现在中间也不能掺杂空格
        if (value.length > 0 && !/\s/.test(value)) {
            $('#reg .info_pwd .q2').html('●').css('color', 'green');

        } else {
            $('#reg .info_pwd .q2').html('○').css('color', '#666');

        }

        // 密码验证的第三个条件,大写子=字母、小写字母、数字、飞空字符两种
        if (/[\d]/.test(value)) {
            code_length++;
        }
        if (/[a-z]/.test(value)) {
            code_length++;
        }
        if (/[A-Z]/.test(value)) {
            code_length++;
        }
        if (/[^\w]/.test(value)) {
            code_length++;
        }
        if (code_length >= 2) {
            $('#reg .info_pwd .q3').html('●').css('color', 'green');
        } else {
            $('#reg .info_pwd .q3').html('○').css('color', '#666');
        }

        // 安全级别验证，一定要从高开始判断
        if (value_length >= 10 && code_length >= 3) {
            $('#reg .info_pwd .s1').css('color', 'green');
            $('#reg .info_pwd .s2').css('color', 'green');
            $('#reg .info_pwd .s3').css('color', 'green');
            $('#reg .info_pwd .s4').html('高').css('color', 'green');
        } else if (value_length >= 8 && code_length >= 2) {
            $('#reg .info_pwd .s1').css('color', '#f60');
            $('#reg .info_pwd .s2').css('color', '#f60');
            $('#reg .info_pwd .s3').css('color', '#ccc');
            $('#reg .info_pwd .s4').html('中').css('color', '#f60');
        } else if (value_length >= 1) {
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
        if (value_length >= 6 && value_length <= 20 && !/\s/.test(value) && code_length >= 2) flag = true;

        return flag;
    }


    // 密码确认验证
    $('form').form('notpwd').bind('focus', function () {
        $('#reg .info_notpwd').css('display', 'block')
        $('#reg .error_notpwd').css('display', 'none')
        $('#reg .success_notpwd').css('display', 'none')
    }).bind('blur', function () {
        if (Trim($(this).value()) == '') {
            $('#reg .info_notpwd').css('display', 'none')
            $('#reg .error_notpwd').css('display', 'none')
            $('#reg .success_notpwd').css('display', 'none')
        } else if (Trim($(this).value()) == Trim($('form').form('pwd').value())) {
            $('#reg .info_notpwd').css('display', 'none')
            $('#reg .error_notpwd').css('display', 'none')
            $('#reg .success_notpwd').css('display', 'block')
        } else {
            $('#reg .info_notpwd').css('display', 'none')
            $('#reg .error_notpwd').css('display', 'block')
            $('#reg .success_notpwd').css('display', 'none')
        }
    })

    //问题回答验证
    $('form').form('ans').bind('focus', function () {
        $('#reg .info_ans').css('display', 'block')
        $('#reg .error_ans').css('display', 'none')
        $('#reg .success_ans').css('display', 'none')
    }).bind('blur', function () {
        if (Trim($(this).value()) == '') {
            $('#reg .info_ans').css('display', 'none')
            $('#reg .error_ans').css('display', 'none')
            $('#reg .success_ans').css('display', 'none')
        } else if ($(this).value().length >= 2 && $(this).value().length <= 32) {
            $('#reg .info_ans').css('display', 'none')
            $('#reg .error_ans').css('display', 'none')
            $('#reg .success_ans').css('display', 'block')
        } else {
            $('#reg .info_ans').css('display', 'none')
            $('#reg .error_ans').css('display', 'block')
            $('#reg .success_ans').css('display', 'none')
        }
    })

    // 邮箱验证
    $('form').form('email').bind('focus', function () {
        // 补全界面     如果已经输入到了@就不显示补全界面了
        if ($(this).value().indexOf('@') == -1) $('#reg .all_email').css('display', 'block')
        // 邮箱验证
        $('#reg .info_email').css('display', 'block')
        $('#reg .error_email').css('display', 'none')
        $('#reg .success_email').css('display', 'none')
    }).bind('blur', function () {
        $('#reg .all_email').css('display', 'none')      // 补全界面

        if (Trim($(this).value()) == '') {
            $('#reg .info_email').css('display', 'none')
            $('#reg .error_email').css('display', 'none')
            $('#reg .success_email').css('display', 'none')
        } else if (/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(Trim($(this).value()))) {
            $('#reg .info_email').css('display', 'none')
            $('#reg .error_email').css('display', 'none')
            $('#reg .success_email').css('display', 'block')
        } else {
            $('#reg .info_email').css('display', 'none')
            $('#reg .error_email').css('display', 'block')
            $('#reg .success_email').css('display', 'none')
        }
    })

    // 邮箱补全系统输入
    $('form').form('email').bind('keyup', function () {
        if ($(this).value().indexOf('@') == -1) {         // 实时判断，有@就不显示补全，没有就显示
            $('#reg .all_email').css('display', 'block');
            $('#reg .all_email li span').html($(this).value());
        } else {
            $('#reg .all_email').css('display', 'none');
        }

        if (event.keyCode == 40) {        // 下方向按键  通过之前封装event已经做过兼容处理
            if (this.index == undefined || this.index >= $('#reg .all_email li').length() - 1) {
                this.index = 0;
            } else {
                this.index++;
            }
            $('#reg .all_email li').css('background', 'none');       // 排他思想
            $('#reg .all_email li').css('color', '#666');

            $('#reg .all_email li').eq(this.index).css('background', '#e5edf2');
            $('#reg .all_email li').eq(this.index).css('color', '#369');
        }

        if (event.keyCode == 38) {         // 上方向按键
            if (this.index == undefined || this.index <= 0) {
                this.index = $('#reg .all_email li').length() - 1;
            } else {
                this.index--;
            }
            $('#reg .all_email li').css('background', 'none');       // 排他思想
            $('#reg .all_email li').css('color', '#666');

            $('#reg .all_email li').eq(this.index).css('background', '#e5edf2');
            $('#reg .all_email li').eq(this.index).css('color', '#369');
        }

        if (event.keyCode == 13) {        // 回车键
            $(this).value($('#reg .all_email li').eq(this.index).text());
            $('#reg .all_email').css('display', 'none');
            this.index = undefined;
        }
    })

    // 点击补全选项就获取
    $('#reg .all_email li').bind('mousedown', function () {
        $('form').form('email').value($(this).text());
    })

    // 邮箱补全效果的移入移出
    $('#reg .all_email li').hover(function () {
        $(this).css('background', '#e5edf2');
        $(this).css('color', '#369');
    }, function () {
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
    for (var i = 1950; i <= 2016; i++) {
        year.first().add(new Option(i, i), undefined);
    }
    //注入月
    for (var i = 1; i <= 12; i++) {
        month.first().add(new Option(i, i), undefined);
    }
    //注入日
    year.bind('change', select_day)
    month.bind('change', select_day)

    //注入日的函数
    function select_day(){
        if (year.value() != 0 && month.value() != 0) {     // 先判断年和月有没有值
            // 清理之前的注入，解决day累加的问题
            day.first().options.length = 1;      // 强行让day下拉框只留下一个选项，

            var current_day = 0;

            if (inArray(day31, parseInt(month.value()))) {      // 获取的是字符串，需要转换
                current_day = 31;
            } else if (inArray(day30, parseInt(month.value()))) {
                current_day = 30;
            } else {
                // 判断闰年和平年的2月，闰年：能被4整除，如果最后两位是00的年份(1900,2000),需要被400整除才行，所以判断(必须被4整除&&最后两位不是00的年份) || (判断能被400整除的)
                if ((parseInt(year.value()) % 4 == 0 && parseInt(year.value()) % 100 != 0) || parseInt(year.value()) % 400 == 0) {
                    current_day = 29;
                } else {
                    current_day = 28;
                }
            }

            for (var i = 1; i <= current_day; i++) {            // 在这里统一注入日
                day.first().add(new Option(i, i), undefined);
            }

        } else {
            day.first().options.length = 1;         // 如果年和月没选择，那么日要清零
        }
    }

    //备注部分
    $('form').form('ps').bind('keyup',check_ps).bind('paste',function(){
        setTimeout(check_ps,50);            // 解决鼠标右键粘贴后检测字数不执行的问题， 粘贴事件执行时间早，所以当'paste'执行时文字并没有获取到自然无法检测字数，所以让'paste'事件延迟50毫秒
    })

    // 清尾
    $('#reg .ps .clear').click(function(){
        $('form').form('ps').value($('form').form('ps').value().substring(0,5));
        check_ps();
    })

    //检测备注字数的函数
    function check_ps (){
        var num = 5 - $('form').form('ps').value().length;
        if(num >= 0){
            $('#reg .ps').eq(0).css('display','block');
            $('#reg .ps .num').eq(0).html(num);
            $('#reg .ps').eq(1).css('display','none');
        }else{
            $('#reg .ps').eq(0).css('display','none');
            $('#reg .ps .num').eq(1).html(Math.abs(num)).css('color','red');
            $('#reg .ps').eq(1).css('display','block');
        }
    }


// 登录框
    var login = $('#login')
    login.center(350, 250).resize(function () {
        if (login.css('display') == 'block') {
            screen.lock();
        }
    });
    $('#header .login').click(function () {
        login.center(350, 250).css('display', 'block');
        screen.lock().animate({
            'attr': 'o',
            'target': 40,
            'step': 10
        });
    });
    $('#login .close').click(function () {
        login.css('display', 'none')
        screen.animate({
            'attr': 'o',
            'target': 0,
            'step': 10,
            fn: function () {
                screen.unlock();
            }
        });
    });
//	登录框拖动
    login.drag($('#login h2').first());
    reg.drag($('#reg h2').first());

// 百度分享
    $('#share').css('top', getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height'))) / 2 + 'px')


    addEvent(window, 'scroll', function () {
        $('#share').css('top', getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(), 'height'))) / 2 + 'px')

    })

// 百度分享伸缩
    $('#share').hover(function () {
        $(this).animate({
            'attr': 'x',
            'target': 0
        })
    }, function () {
        $(this).animate({
            'attr': 'x',
            'target': -211
        })
    })

// 导航部分
    $('#nav .about li').hover(function () {
        var target = $(this).first().offsetLeft;
        $('#nav .nav_bg').animate({
            attr: 'x',
            target: target + 20,
            speed: 10,
            fn: function () {
                $('#nav .white').animate({
                    attr: 'x',
                    target: -target,

                })
            }
        })
    }, function () {
        $('#nav .nav_bg').animate({
            attr: 'x',
            target: 20,
            speed: 10,
            fn: function () {
                $('#nav .white').animate({
                    attr: 'x',
                    target: 0,
                    t: 6
                })
            }
        })
    })


    $('#sidebar h2').toggle(function () {
        $(this).next().animate({
            mul: {
                height: 0,
                opacity: 0
            }
        })
    }, function () {
        $(this).next().animate({
            mul: {
                height: 150,
                opacity: 100
            }
        })
    })


//console.log($('form').getElement(0).user);

})


