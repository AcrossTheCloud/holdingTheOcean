var countDownDate = new Date("May 7, 2019 00:00:00").getTime();

// Update the count down every 1 second
var countDown = setInterval(function() {

    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("timer").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";

    // If the count down is over, write some text
    if (distance < 0) {
        clearInterval(countDown);
        document.getElementById("timer").innerHTML = "LIVE";
    }
}, 1000);

$(document).ready(function(){
    var videoList = [
        "https://s3.eu-west-2.amazonaws.com/oceanholding/footages/Deepstar3.mp4",
        "https://s3.eu-west-2.amazonaws.com/oceanholding/footages/Deepstar4.mp4"]

    var videoFile = videoList[Math.floor(Math.random() * videoList.length)];

    var $video = $('video#bgVideo'),
    videoSrc = $('source', $video).attr('src', videoFile);
    $video[0].load();
    $video[0].play();
});
