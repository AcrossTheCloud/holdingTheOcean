$(document).ready(function(){
    $('.option-item').click(function(){
        closeJoanJonas();
        closeLiveStream();
        closeVideoSection();
                $('body').addClass('noscroll open');

                $('.panel-content').removeClass('active');
                $('.option-item').removeClass('active');

                var
                    key = $(this).data('value'),
                    $infoPanel = $('.info-panel');

                $(this).addClass('active');
                $('#' + key + 'Panel').addClass('active');

                if($(this).data('fullscreen') === true) { // jQuery Data is smart about some types, so it'll return a boolean
                    $infoPanel.addClass('fullscreen');
                }

                $infoPanel.addClass('open');

                $('header').addClass('open');

                $('.message span').hide();

            });

    $('div.jelly').click(function(){
        $(this).siblings('.send').click();
    });
    });
    
function openNav(){
    $('body').addClass('noscroll');
    $('.info-panel').addClass('open');
    $('#aboutPanel').addClass('active');
    $('.option-item[data-value="about"]').addClass('active');
}
function closeNav() {
    $('body').removeClass('noscroll open');
    $('video#bgVideo').fadeTo(1000, 1).get(0).play();
    $('.info-panel').removeClass('open fullscreen');
    $('.option-item.active').removeClass('active');
    $('header').removeClass('open');
}
