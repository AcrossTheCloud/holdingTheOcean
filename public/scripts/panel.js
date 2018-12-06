$(document).ready(function(){
    $('.option-item').click(function(){
        $('.panel-content').removeClass('active');
        $('.option-item').removeClass('active');

        var key = $(this).data('value');
        $(this).addClass('active');
        $(`#${key}Panel`).addClass('active');
        $('.info-panel').addClass('open');

        if(window.innerWidth <= 768){
            $('header').hide();
        }
    });

    $('div#jelly').click(function(){
        $(this).siblings('#send').click();
    });
});

function closeNav() {

}
