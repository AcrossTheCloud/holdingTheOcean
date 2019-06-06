$(function() {
  OA_Logo_Lucid_Code();
  loadVideos()
});


function OA_Logo_Lucid_Code() {
  setTimeout(function() {
    $('#logo .left, #logo .right').addClass('init');
  }, 2750);  //2750
}

function loadVideos() {
  if ( $(window).width() > 768 ) {

    var $video = $('#video video');
    $('#video .mp4').attr('src', 'https://streaming.ocean-archive.org/media/OA_trailer.mp4');
    $('#video .webm').attr('src', 'https://streaming.ocean-archive.org/media/OA_trailer.webm');

    $video[0].load();
    $video[0].play();
  }
}
