var
  $videosSection = $('#videosSection'),
  $player = $('#videosSection video'),
  $overlay = $('#videosSection .overlay'),
  resizeTimeout = null;

$(document).ready(function() {
    // Livestream video buttons load the video section
    $('.videoLinks .video').click( function() {
        var _video = $(this);
        closeJoanJonas(function() {

            closeLiveStream( function () {
                $('video#bgVideo').css('opacity', 0).get(0).pause();
                if (!$(_video).hasClass('currentlyPlaying')) {
                  openVideoSection($(this).data('videourl'), function () {
                    loadVideo($(_video).data('videourl'));
                    $('.videoLinks .video.currentlyPlaying').removeClass('currentlyPlaying');
                    $(_video).addClass('currentlyPlaying');
                  });
                } else {
                  if(!$('body').hasClass('videoSectionOpen')) {
                    openVideoSection(null,function () {
                      $overlay.fadeOut(function () {
                        $player.get(0).play();
                      });
                    });
                  }
                }
          
              });
          });
    });

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


function openVideoSection(url, callback) {
    var
      isPaused = $player.get(0).paused;

    $overlay.fadeIn();

    $videosSection.fadeIn(1000, function () {
        if(url) {
            loadVideo(url);
        } else {
            if(!$player.get(0).duration) {
                $('#videosSection video').get(0).click();
            } else {
                if (isPaused) {
                    $player.get(0).play();
                }
            }
        }
        $videosSection.addClass('open');
        $('body').addClass('videoSectionOpen');

        if (typeof callback === 'function') callback();
    });
}

function closeVideoSection(callback) {
    $('body').removeClass('videoSectionOpen');
    $videosSection.fadeOut(function () {
        $player.get(0).pause();

        $('video#bgVideo').css('opacity', 1).get(0).play();

        if (typeof callback === 'function') callback();
    });
}

function loadVideo(url) {
    $player.find('.webm').attr('src', url + '.webm');
    $player.find('.mp4').attr('src', url + '.mp4');
    $player.get(0).load();
}
