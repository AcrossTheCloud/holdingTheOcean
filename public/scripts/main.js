var queryStringParams = {};
var parseQueryStringParams = function() {
    var regex = new RegExp('([^?=&+]+)(=([^&]*))?', 'g');
    var results = location.search.match( regex );

    $.each(results, function (key, value) {
        var split = value.split('=');
        queryStringParams[split[0]] = split[1];
    });
};

// Stop opening sections really quickly
var buttonClickTimeout = false;
var setButtonClickTimeout = function() {
    buttonClickTimeout = setTimeout(function () {
        clearTimeout(buttonClickTimeout);
        buttonClickTimeout = false;
    }, 500);
};

$(document).ready(function(){
    parseQueryStringParams();

    var videoList = [
        "https://ocean-archive.org/media/Divers_01",
        "https://ocean-archive.org/media/Turtle_Glowing+Fishies",
        "https://ocean-archive.org/media/%5B1%5DDeepstar",
        "https://ocean-archive.org/media/%5B2%5DDeepstar",
        "https://ocean-archive.org/media/%5B3%5DDeepstar",
        "https://ocean-archive.org/media/%5B4%5DDeepstar"
    ];

    var videoFile = videoList[Math.floor(Math.random() * videoList.length)];

    var $video = $('video#bgVideo');
    // videoSrc = $('source', $video).attr('src', videoFile);
    var sources = $video.find('source');
    $(sources[0]).attr('src', videoFile+'.mp4');
    $(sources[1]).attr('src', videoFile+'.webm');

    $video[0].load();
    $video[0].play();

    $('.leftStickyJoan, .joanjonas_text_button').click(function() {
        if(!buttonClickTimeout) setButtonClickTimeout();
        else return;

        $('.videoLinks div.active').removeClass('active');
        $('.videoLinks div.joanjonas_text_button').addClass('active');

        closeVideoSection(function() {
            closeLiveStream(function() {
                $('video#bgVideo').fadeTo(1000, 0).get(0).pause();
                $('.joanjonas_text').fadeIn();
                $('#oceanspace').fadeIn();
                $('body').addClass('joanjonasTextOpen');
            });
        });
    });


    $('.leftStickyHeader').click(function () {
        if(!buttonClickTimeout) setButtonClickTimeout();
        else return;

        $('.videoLinks div.active').removeClass('active');

        closeJoanJonas(function() {
            closeVideoSection(function() {
                closeLiveStream(function() {
                    $('video#bgVideo').fadeTo(1000, 1).get(0).play();
                    var $videosSection = $('#videosSection');

                    $videosSection.fadeOut(1000, function () {
                        $videosSection.removeClass('open');
                        $videosSection.css('z-index', -20);
                    });
                });
            });
        });
    });

    // let bgVideo = $('#bgVideo').get(0);
    // // Pause the background video whenever a lightbox has opened.
    // $(document).on('lity:open', function(event, instance) {
    //     bgVideo.pause();
    // });
    // // Resume the background video whenever a lightbox has closed.
    // $(document).on('lity:close', function(event, instance) {
    //     bgVideo.play();
    // });


    // Setup lightbox click and populate it with a html5 video player.
    // $(document).on('click', '.lightboxVideo', function () {
    //     var
    //         videoURL = $(this).data('videourl');
    //
    //     lity('<video muted autoplay controls width="100%">\n' +
    //         '    <source src="' + videoURL + '.mp4" type="video/mp4">\n' +
    //         '    <source src="' + videoURL + '.webm" type="video/webm">\n' +
    //         '</video>');
    // });

    // Setup the carousel
    // var
    //     $carousel = $('.owl-carousel'),
    //     $carouselPrevButton = $('.carouselWrapper .control.prev'),
    //     $carouselNextButton = $('.carouselWrapper .control.next');

    // Show / hide the arrows if the item counts are lower/equal the item counts per window width
    // Only use this if we're not using loop: true on Owl.
    // $carousel.on('initialized.owl.carousel resized.owl.carousel', function (event) {
    //     var
    //        windowWidth = $(window).width(),
    //        itemCount = event.item.count;
    //
    //     if(
    //         (windowWidth > 600 && windowWidth < 1000) && itemCount < 4
    //         ||
    //         windowWidth > 1000 && itemCount < 6
    //     ) {
    //         $carouselPrevButton.hide();
    //         $carouselNextButton.hide();
    //     } else {
    //         $carouselPrevButton.show();
    //         $carouselNextButton.show();
    //     }
    // });
    //
    // $carousel.owlCarousel({
    //     margin: 10,
    //     responsiveClass: true,
    //     loop: true,
    //
    //     responsive: {
    //         0: {
    //             items: 1,
    //             nav: false,
    //             dots: false
    //         },
    //         600: {
    //             items: 4,
    //             nav: false,
    //             dots: false
    //         },
    //         1000: {
    //             items: 6,
    //             nav: false,
    //             dots: false
    //         }
    //     }
    // });
    //
    // // Next and Prev buttons
    // $carouselPrevButton.click(function() {
    //     $carousel.trigger('prev.owl.carousel');
    // });
    // $carouselNextButton.click(function() {
    //     $carousel.trigger('next.owl.carousel');
    // });

});

function closeJoanJonas(callback) {
    $('body').removeClass('joanjonasTextOpen');
    $('#oceanspace').fadeOut();
    $('.joanjonas_text').fadeOut("slow", function() {
        if (typeof callback === 'function') return callback();
    });
}
