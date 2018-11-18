
/* Set the width of the sidebar to 250px (show it) */
function openAbout() {
    document.getElementById("aboutPanel").style.width = "250px";
    document.getElementsByTagName('nav')[0].style.right = "250px"
}

function openLaunch() {
    document.getElementById("launchPanel").style.width = "240px";
    document.getElementsByTagName('nav')[0].style.right = "250px"
}

function openSubscribe() {
    document.getElementById("subscribePanel").style.width = "230px";
    document.getElementsByTagName('nav')[0].style.right = "250px"
}


/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementsByTagName('nav')[0].style.right = "0"
}


$(document).ready(function(){
    var topZ = 0;

    $('.option-item').click(function(){
        var key = $(this).data('value');

        console.log('option item clicked ---- ', key);

        $(`#${key}Panel`).addClass('open');
        $(`#${key}Panel`).css('z-index', topZ );
        $('nav').addClass('open');
        topZ++;
    })
})
