var
    $audio = $('#audioPanel .player audio'),
    audioURL = 'https://streaming.oceanarchive.io/audio_test/',
    currentlyPlaying = 0;

function getPlayList () {
    var
        $playListContainer = $('#audioPanel .playlist ul');

    $.getJSON( audioURL + 'playlist.json' , function( data ) {
        $.each( data, function( index, key ) {
            var files = {};

            // If we have multiple files
            if(key.files && Object.keys(key.files).length > 0) {
                $.each( key.files, function(type, file) {
                    files[type] = audioURL + file;
                });
            // If we have a single file, just use the m4a type, the key doesn't matter in the end as they all end up in <source>
            } else if(key.file && key.file.length > 0) {
                files["m4a"] = audioURL + key.file;
            }

            $playListContainer.append('<li data-index="'+ index +'" data-files=\''+ JSON.stringify(files) +'\' onclick="playAudio(this, true)">' + key.name + '</li>')
        });

        // Add active to the first LI and load it in the player.
        var $firstAudioFile = $('#audioPanel .playlist ul li:first-child');
        $firstAudioFile.addClass('active');
        playerLoadFile($firstAudioFile.data('files'));

        $playListContainer.fadeIn();
        $('#audioPanel .player audio').fadeIn();
    });
}

function playAudio(element, loop) {
    var
        player = $audio.get(0),
        $element = $(element),
        files = $element.data('files'),
        index = $element.data('index');

    // If we're already playing this one, don't do anything.
    if(currentlyPlaying === index) return false;

    currentlyPlaying = index;

    // Remove and add active class
    $('#audioPanel .player audio li.active').removeClass('active');
    $element.addClass('active');

    playerLoadFile(files);

    player.loop = loop;
    player.play();
}

/**
 *
 * Loads the given audio files into the player
 *
 * @param files JSON Object
 * @param play Boolean
 */
function playerLoadFile(files) {
    $.each(files, function(type, url) {
        $audio.find('.' + type).attr('src', url);
    });

    $audio.get(0).load();
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
