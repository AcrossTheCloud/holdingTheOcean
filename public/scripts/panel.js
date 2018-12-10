$(document).ready(function(){
    $('.option-item').click(function(){
        $('.panel-content').removeClass('active');
        $('.option-item').removeClass('active');

        var key = $(this).data('value');
        $(this).addClass('active');
        $(`#${key}Panel`).addClass('active');
        $('.info-panel').addClass('open');

        $('.message span').hide();
    });

    $('div#jelly').click(function(){
        $(this).siblings('#send').click();
    });


    $('header').click(function(){
        if($('.info-panel').hasClass('open')){
            $('.info-panel').removeClass('open');
        }
    });
});

function closeNav() {
    $('.info-panel').removeClass('open');
}
