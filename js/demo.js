$(function () {
    //console.log($('#box').css('width'));
    //console.log(getStyle($('#box').getElement(0), 'width'));
    $('#button').toggle(function(){
        $('#box').css('background-color','#000000');
    },function(){
        $('#box').css('background-color','red');

    })


})