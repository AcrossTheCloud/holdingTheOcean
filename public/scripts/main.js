var liveStream = function() {
    var autoplay = false;
    if ($(window).width() > 480) {
        autoplay = true;
    }

    return lity('<div class="iframe-container"> \
        <svg class="closebtn" onclick="closeNav()" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18"><line class="lines" x2="17.68" y2="17.68"></line><line class="lines" x1="17.68" y2="17.68"></line></svg> \
        <iframe \
        src="https://player.twitch.tv/?client-id=brdrlyou2po431ot4owmi1zzjn6n0x&channel=oceanspaceorg&muted=true&autoplay=' + autoplay + '"\
        frameborder="0" \
        scrolling="no" \
        allowfullscreen="true"> \
        </iframe></div>');
}

$(document).ready(function(){
    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/streams?user_login=oceanspaceorg',
        headers: {
         "Accept":"application/vnd.twitchtv.v5+json",
         "Client-ID":"brdrlyou2po431ot4owmi1zzjn6n0x"
        }
    })
    .done( function(data) {
        if (data.data.length > 0) { 
            var lity = liveStream();

            var $liveStreamButton = $('#livestream');
            $liveStreamButton.fadeIn();
            $liveStreamButton.on('click', function () {
                lity = liveStream();
            });

            $(document).on('click', '.lity-content .closebtn', function () {
                lity.close();
            });
        }
    });

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
