var
    hasPlaylist = false,
    $audio = $('#audioPanel .player audio'),
    player = $audio.get(0),
    $playerContainer = $('#audioPanel .player'),
    audioURL = 'https://streaming.oceanarchive.io/audio_test/',
    currentlyPlaying = 0,
    totalVideos = 0,
    resizeTimeout;


$(document).ready(function () {
    // Audio Player
    audioPlayerEvents();

    // This is to fix the playlist not being full height on different resolutions
    $(window).on('resize', function () {
        setHeight();
    });

});

// This is to fix the playlist not being full height on different resolutions
function setHeight() {
    resizeTimeout = setTimeout(function () {
        var
            windowHeight = $(window).height(),
            playerHeight = $('#audioPanel .player').outerHeight(true),
            controlsHeight = $('#audioPanel .playlist .controls').outerHeight(true),
            navHeight = $('#options').outerHeight(true);
        $('#audioPanel').css('height', function () {
            return windowHeight - navHeight;
        });
        $('#audioPanel .playlist').css('height', function () {
            return windowHeight - navHeight - controlsHeight;
        });
        $('#audioPanel .playlist ul').css('height', function () {
            return windowHeight - navHeight - playerHeight - controlsHeight;
        });
    }, 500);
}

function getPlayList () {
    var
        $playListContainer = $('#audioPanel .playlist ul');

    $('#audioPanel .wrapper').show();
    $('#audioPanel .noVideos').hide();

    $.getJSON( audioURL + 'playlist.json' , function( data ) {
        var files = {};

        $.each( data, function( index, key ) {

            // If we have multiple files
            if(key.files && Object.keys(key.files).length > 0) {
                $.each( key.files, function(type, file) {
                    files[type] = audioURL + file;
                });
            // If we have a single file, just use the m4a type, the key doesn't matter in the end as they all end up in <source>
            } else if(key.file && key.file.length > 0) {
                files["m4a"] = audioURL + key.file;
            }

            var
                playButton = '<span class="play button"><img src="icons/font-awesome/play-circle-regular-yellow.svg"/></span>';

            $playListContainer.append('<li class="audio'+ index +'" data-index="'+ index +'" data-files=\''+ JSON.stringify(files) +'\' onclick="playAudio(this, true)">' + key.name + playButton +'</li>')
            totalVideos++;
        });

        if(Object.keys(files).length > 0) {
            // Add active to the first LI and load it in the player.
            var $firstAudioFile = $('#audioPanel .playlist ul li:first-child');
            $firstAudioFile.addClass('active');
            playerLoadFile($firstAudioFile.data('files'));

            $playListContainer.fadeIn();
            $('#audioPanel .player audio').fadeIn();
            $('#audioPanel .playlist .controls').fadeIn();

            hasPlaylist = true;
        } else {
            $('#audioPanel .noVideos').show();
            $('#audioPanel .wrapper').hide();
        }
    });
}

var audioLoop = {
    start : function() {
        player.loop = false; // make sure we don't look the same audio file

        if(player.paused) player.play(); // if we've paused, play it.


        player.onended = function () {
            var nextCount = currentlyPlaying;
            nextCount++;

            if(nextCount >= totalVideos) nextCount = 0;

            playAudio($('.audio' + nextCount), false);
        };

        $('#audioPanel .playlist .controls .startLoop').fadeOut(function () {
            $('#audioPanel .playlist .controls .stopLoop').fadeIn();
        });
    },

    stop : function() {
        player.onended = null;

        $('#audioPanel .playlist .controls .stopLoop').fadeOut(function () {
            $('#audioPanel .playlist .controls .startLoop').fadeIn();
        });

        player.loop = true;

        stopAudio();
    }
};

/**
 * There's no stop, just pause
 */
function stopAudio() {
    player.pause();
}

function playAudio(element, loop) {
    var
        $element = $(element),
        files = $element.data('files'),
        index = $element.data('index');

    // If we're already playing this one, don't do anything.
    if(currentlyPlaying === index) return false;

    $playerContainer.LoadingOverlay('show');
    currentlyPlaying = index;

    // Remove and add active class
    $('#audioPanel .playlist ul li.active').removeClass('active');
    $element.addClass('active');

    playerLoadFile(files);

    player.loop = loop;
}

/**
 *
 * Sets up any HTML5 Audio events
 *
 */
function audioPlayerEvents() {

    // Once the audio has loaded enough, remove the overlay
    player.oncanplay = function() {
        $playerContainer.LoadingOverlay('hide');
        player.play();
    };
}

/**
 *
 * Loads the given audio files into the player
 *
 * @param files JSON Object
 */
function playerLoadFile(files) {
    $.each(files, function(type, url) {
        $audio.find('.' + type).attr('src', url);
    });

    player.load();
}

/**

 Below is the expected format for the JSON response

 With a mix of Single file and Multiple Files

**/

/*
[
    {
        "file":"235428__allanz10d__calm-ocean-breeze-simulation.m4a",
        "name":"simulated calm ocean breeze"
    },
    {
        "file":"372181__amholma__ocean-noise-surf.m4a",
        "name":"ocean surf"
    },
    {
        "file":"408555__felix-blume__amazonian-dolphins.m4a",
        "name":"Amazonian dolphins"
    },
    {
        "files": {
            "m4a": "82325__kevoy__diving-with-whales.m4a",
            "ogg": "files two"
        },
        "name":"diving with whales"
    }
]

 */
