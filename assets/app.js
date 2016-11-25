$(document).ready(function() {
    $('#fullpage').fullpage({
        verticalCentered: true,
        // sectionsColor: ['#1b7ae4', '#1159bd'],
        keyboardScrolling: true,
        lazyLoading: true,
        dragAndMove: true,
        afterRender: function(){

            // // Start the video
            // callPlayer('video', 'playVideo');
        }
    });




});


// callPlayer("video", function() {
//     // This function runs once the player is ready ("onYouTubePlayerReady")
//     callPlayer("video", "playVideo");
// });
// // When the player is not ready yet, the function will be queued.
// // When the iframe cannot be found, a message is logged in the console.
// callPlayer("video", "playVideo");

//
//
// /**
//  * @author       Rob W <gwnRob@gmail.com>
//  * @website      http://stackoverflow.com/a/7513356/938089
//  * @version      20131010
//  * @description  Executes function on a framed YouTube video (see website link)
//  *               For a full list of possible functions, see:
//  *               https://developers.google.com/youtube/js_api_reference
//  * @param String frame_id The id of (the div containing) the frame
//  * @param String func     Desired function to call, eg. "playVideo"
//  *        (Function)      Function to call when the player is ready.
//  * @param Array  args     (optional) List of arguments to pass to function func*/
// function callPlayer(frame_id, func, args) {
//     if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
//     var iframe = document.getElementById(frame_id);
//     if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
//         iframe = iframe.getElementsByTagName('iframe')[0];
//     }
//
//     // When the player is not ready yet, add the event to a queue
//     // Each frame_id is associated with an own queue.
//     // Each queue has three possible states:
//     //  undefined = uninitialised / array = queue / 0 = ready
//     if (!callPlayer.queue) callPlayer.queue = {};
//     var queue = callPlayer.queue[frame_id],
//         domReady = document.readyState == 'complete';
//
//     if (domReady && !iframe) {
//         // DOM is ready and iframe does not exist. Log a message
//         window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
//         if (queue) clearInterval(queue.poller);
//     } else if (func === 'listening') {
//         // Sending the "listener" message to the frame, to request status updates
//         if (iframe && iframe.contentWindow) {
//             func = '{"event":"listening","id":' + JSON.stringify(''+frame_id) + '}';
//             iframe.contentWindow.postMessage(func, '*');
//         }
//     } else if (!domReady ||
//         iframe && (!iframe.contentWindow || queue && !queue.ready) ||
//         (!queue || !queue.ready) && typeof func === 'function') {
//         if (!queue) queue = callPlayer.queue[frame_id] = [];
//         queue.push([func, args]);
//         if (!('poller' in queue)) {
//             // keep polling until the document and frame is ready
//             queue.poller = setInterval(function() {
//                 callPlayer(frame_id, 'listening');
//             }, 250);
//             // Add a global "message" event listener, to catch status updates:
//             messageEvent(1, function runOnceReady(e) {
//                 if (!iframe) {
//                     iframe = document.getElementById(frame_id);
//                     if (!iframe) return;
//                     if (iframe.tagName.toUpperCase() != 'IFRAME') {
//                         iframe = iframe.getElementsByTagName('iframe')[0];
//                         if (!iframe) return;
//                     }
//                 }
//                 if (e.source === iframe.contentWindow) {
//                     // Assume that the player is ready if we receive a
//                     // message from the iframe
//                     clearInterval(queue.poller);
//                     queue.ready = true;
//                     messageEvent(0, runOnceReady);
//                     // .. and release the queue:
//                     while (tmp = queue.shift()) {
//                         callPlayer(frame_id, tmp[0], tmp[1]);
//                     }
//                 }
//             }, false);
//         }
//     } else if (iframe && iframe.contentWindow) {
//         // When a function is supplied, just call it (like "onYouTubePlayerReady")
//         if (func.call) return func();
//         // Frame exists, send message
//         iframe.contentWindow.postMessage(JSON.stringify({
//             "event": "command",
//             "func": func,
//             "args": args || [],
//             "id": frame_id
//         }), "*");
//     }
//     /* IE8 does not support addEventListener... */
//     function messageEvent(add, listener) {
//         var w3 = add ? window.addEventListener : window.removeEventListener;
//         w3 ?
//             w3('message', listener, !1)
//             :
//             (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
//     }
// }

/**
 * Time
 */

window.onload = init;

function init() {
    window.setInterval(time, 66);
}

function time() {
    var tim = new Date();
    var clockDiv = document.getElementById("clock");
    clockDiv.innerHTML = tim.getHours() + ":" + tim.getMinutes();
}


/**
 * Weather API
 */

$(document).ready(function() {
    $.simpleWeather({
        location: 'Belgrade, SR',
        woeid: '',
        unit: 'c',
        success: function(weather) {

            html = '<ul class="bg-temp">' +
                '<li>Beograd</li>' +
                '<li>'+weather.temp+'&deg;'+weather.units.temp+'</li>' +
                '</ul>'


            html += '<h2 class="bg-icon"><i class="icon-'+weather.code+'"></i></h2>';
            html += '<ul class="row bg-days">'
            for(var i=0;i<6;i++) {
                html += '<li class="col-sm-2">' +
                        '<ul>' +
                            '<li class="bg-mini-icon"><i class="icon-'+weather.forecast[i].code+'"></i></li>' +
                            '<li class="bg-mini-day">'+weather.forecast[i].day+'</li>' +
                            '<li class="bg-mini-temp">'+weather.forecast[i].high+'&deg;</li>' +
                        '</ul>' +
                    '</li>';
            }
            html += '</ul>'

            $("#belgrade").html(html);
        },
        error: function(error) {
            $("#belgrade").html('<p>'+error+'</p>');
            location.reload();
        }
    });
});

// Tokio
$.simpleWeather({
    location: 'Tokio',
    woeid: '',
    unit: 'c',
    success: function(weather) {
        html = '<ul class="other-cities">';
        html += '<li><i class="icon-'+weather.code+'"></i></li>';
        html += '<li>'+weather.city+'</li>';
        html += '<li>'+weather.temp+'&deg;'+weather.units.temp+'</li>';
        html += '</ul>';

        $("#tokio").html(html);
    },
    error: function(error) {
        $("#tokio").html('<p>'+error+'</p>');
        location.reload();
    }
});

// Moscow

$.simpleWeather({
    location: 'Moscow, RU',
    woeid: '',
    unit: 'c',
    success: function(weather) {
        html = '<ul class="other-cities">';
        html += '<li><i class="icon-'+weather.code+'"></i></li>';
        html += '<li>'+weather.city+'</li>';
        html += '<li>'+weather.temp+'&deg;'+weather.units.temp+'</li>';
        html += '</ul>';

        $("#moscow").html(html);
    },
    error: function(error) {
        $("#moscow").html('<p>'+error+'</p>');
        location.reload();
    }
});

// Moscow
$.simpleWeather({
    location: 'Paris',
    woeid: '',
    unit: 'c',
    success: function(weather) {
        html = '<ul class="other-cities">';
        html += '<li><i class="icon-'+weather.code+'"></i></li>';
        html += '<li>'+weather.city+'</li>';
        html += '<li>'+weather.temp+'&deg;'+weather.units.temp+'</li>';
        html += '</ul>';

        $("#paris").html(html);
    },
    error: function(error) {
        $("#paris").html('<p>'+error+'</p>');
        location.reload();
    }
});

// London
$.simpleWeather({
    location: 'London, GB',
    woeid: '',
    unit: 'c',
    success: function(weather) {
        html = '<ul class="other-cities">';
        html += '<li><i class="icon-'+weather.code+'"></i></li>';
        html += '<li>'+weather.city+'</li>';
        html += '<li>'+weather.temp+'&deg;'+weather.units.temp+'</li>';
        html += '</ul>';

        $("#london").html(html);
    },
    error: function(error) {
        $("#london").html('<p>'+error+'</p>');
        location.reload();
    }
});