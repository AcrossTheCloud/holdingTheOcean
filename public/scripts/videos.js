$(document).ready(function() {
    var
        $videosSection = $('#videosSection'),
        $player = $('#videosSection .videoContainer video'),
        $overlay = $('#videosSection .overlay'),
        resizeTimeout = null;

    $('#videosSection .closeVideosButton').click(function() {
        $player.get(0).pause();

        $videosSection.fadeOut(1000, function () {
            $videosSection.removeClass('open');
            $videosSection.css('z-index', -20);
        });
    });

    $('#videosSection .top.left, .joanjonas').click(function() {
        if( $('header').hasClass('open') ) { return; }

        var $jj = $('#joanjonas_text');
        $jj.css('z-index', 6);
        $jj.fadeIn(function () {
            $videosSection.css('z-index', -20);
        });
    });

    $('#joanjonas_text .closeButton').click(function() {
        var $jj = $('#joanjonas_text');
        $jj.fadeOut(function() {
            $videosSection.css('z-index', 5);
            $jj.css('z-index', -20);
        });
    });

    $('.watch .view').click(function() {
        if( $('header').hasClass('open') ) { return; }

        var
             isPaused = $player.get(0).paused;

        $overlay.fadeIn();
        $videosSection.css('z-index', 5);

        $videosSection.fadeIn(1000, function () {
            if(!$player.get(0).duration) {
                $('#videosSection .video').get(0).click();
            } else if (isPaused) {
                $player.get(0).play();
            }
            $videosSection.addClass('open');
        });
    });


    $('#videosSection .video').click(function() {
        if ( !$(this).hasClass('currentlyPlaying') ) {
            $overlay.fadeIn();

            loadVideo( $(this).data('videourl') );
            $('#videosSection .video.currentlyPlaying').removeClass('currentlyPlaying');
            $(this).addClass('currentlyPlaying');
        }
    });

    function loadVideo(url) {
        $player.find('.webm').attr('src', url + '.webm');
        $player.find('.mp4').attr('src', url + '.mp4');
        $player.get(0).load();
    }


    $player.get(0).onloadeddata = function() {
        if ($(window).width() > 1200) {
            $overlay.fadeOut(function() {
                $player.get(0).play();
            })
        } else {
            $overlay.fadeOut();
        }
    };

    $(window).on('load resize', function () {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function () {
            if ($(window).width() > 1200) {
                $player.get(0).controls = false;
                $player.get(0).loop = true;
            } else {
                $player.get(0).controls = true;
                $player.get(0).loop = false;
            }
        }, 500)
    });

});
