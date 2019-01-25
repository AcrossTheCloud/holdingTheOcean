var countDownDate = new Date("May 7, 2019 00:00:00").getTime();

$(document).ready(function(){
    var videoList = [
        "https://oceanarchive.io/media/Divers_01",
        "https://oceanarchive.io/media/Turtle_Glowing+Fishies",
        "https://oceanarchive.io/media/%5B1%5DDeepstar",
        "https://oceanarchive.io/media/%5B2%5DDeepstar",
        "https://oceanarchive.io/media/%5B3%5DDeepstar",
        "https://oceanarchive.io/media/%5B4%5DDeepstar"
    ]

    var videoFile = videoList[Math.floor(Math.random() * videoList.length)];

    var $video = $('video#bgVideo');
    // videoSrc = $('source', $video).attr('src', videoFile);
    var sources = $video.find('source');
    $(sources[0]).attr('src', videoFile+'.mp4');
    $(sources[1]).attr('src', videoFile+'.webm');

    $video[0].load();
    $video[0].play();
});
