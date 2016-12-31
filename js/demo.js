$(function () {
    //console.log($('#box').css('width'));
    //console.log(getStyle($('#box').getElement(0), 'width'));
    $('#button').click(function(){
        $('#box').animate({
            'attr':'h',
            'target':500,
            'step':1,
            't':17,
            'type':1,
            'speed':50
        });

    })
})