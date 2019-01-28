$(document).ready(function(){
    $('.option-item').click(function(){
        $('.panel-content').removeClass('active');
        $('.option-item').removeClass('active');

        var key = $(this).data('value');
        $(this).addClass('active');
        $(`#${key}Panel`).addClass('active');
        $('.info-panel').addClass('open');
        $('header').addClass('open');

        $('.message span').hide();
    });

    $('div.jelly').click(function(){
        $(this).siblings('.send').click();
    });


    $('header').click(function(){
        var $infoPanel = $('.info-panel');
        if($infoPanel.hasClass('open')){
            $infoPanel.removeClass('open');
        }
    });
});

function closeNav() {
    $('.info-panel').removeClass('open');
    $('.option-item').removeClass('active');
}
