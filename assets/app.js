$(document).ready(function() {
    $('#fullpage').fullpage({
        verticalCentered: true,
        sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE'],
        afterRender: function(){

            // Start the video
            callPlayer('video', 'playVideo');
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



/**
 * @author       Rob W <gwnRob@gmail.com>
 * @website      http://stackoverflow.com/a/7513356/938089
 * @version      20131010
 * @description  Executes function on a framed YouTube video (see website link)
 *               For a full list of possible functions, see:
 *               https://developers.google.com/youtube/js_api_reference
 * @param String frame_id The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 *        (Function)      Function to call when the player is ready.
 * @param Array  args     (optional) List of arguments to pass to function func*/
function callPlayer(frame_id, func, args) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }

    // When the player is not ready yet, add the event to a queue
    // Each frame_id is associated with an own queue.
    // Each queue has three possible states:
    //  undefined = uninitialised / array = queue / 0 = ready
    if (!callPlayer.queue) callPlayer.queue = {};
    var queue = callPlayer.queue[frame_id],
        domReady = document.readyState == 'complete';

    if (domReady && !iframe) {
        // DOM is ready and iframe does not exist. Log a message
        window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
        if (queue) clearInterval(queue.poller);
    } else if (func === 'listening') {
        // Sending the "listener" message to the frame, to request status updates
        if (iframe && iframe.contentWindow) {
            func = '{"event":"listening","id":' + JSON.stringify(''+frame_id) + '}';
            iframe.contentWindow.postMessage(func, '*');
        }
    } else if (!domReady ||
        iframe && (!iframe.contentWindow || queue && !queue.ready) ||
        (!queue || !queue.ready) && typeof func === 'function') {
        if (!queue) queue = callPlayer.queue[frame_id] = [];
        queue.push([func, args]);
        if (!('poller' in queue)) {
            // keep polling until the document and frame is ready
            queue.poller = setInterval(function() {
                callPlayer(frame_id, 'listening');
            }, 250);
            // Add a global "message" event listener, to catch status updates:
            messageEvent(1, function runOnceReady(e) {
                if (!iframe) {
                    iframe = document.getElementById(frame_id);
                    if (!iframe) return;
                    if (iframe.tagName.toUpperCase() != 'IFRAME') {
                        iframe = iframe.getElementsByTagName('iframe')[0];
                        if (!iframe) return;
                    }
                }
                if (e.source === iframe.contentWindow) {
                    // Assume that the player is ready if we receive a
                    // message from the iframe
                    clearInterval(queue.poller);
                    queue.ready = true;
                    messageEvent(0, runOnceReady);
                    // .. and release the queue:
                    while (tmp = queue.shift()) {
                        callPlayer(frame_id, tmp[0], tmp[1]);
                    }
                }
            }, false);
        }
    } else if (iframe && iframe.contentWindow) {
        // When a function is supplied, just call it (like "onYouTubePlayerReady")
        if (func.call) return func();
        // Frame exists, send message
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
    /* IE8 does not support addEventListener... */
    function messageEvent(add, listener) {
        var w3 = add ? window.addEventListener : window.removeEventListener;
        w3 ?
            w3('message', listener, !1)
            :
            (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
    }
}


/**
 * Weather API
 */

var info = {};
var cities = [
    {name:'Belgrade',utc:'+2'},
    {name:'Tokio',utc:'-4'},
    {name:'Moscow',utc:'+8'},
    {name:'Paris',utc:'+2'},
    {name:'London',utc:'+2'},
    {name:'New York',utc:'+2'},
    {name:'Beijing',utc:'+8'}
];
var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
var current = 0;




function init(){
    var date = new Date();
    $('.date').text(monthNames[date.getMonth()]+' '+date.getDate());
    $('.year').text(date.getFullYear());

    //fetch weather data
    for(var i = 0; i < cities.length; i++){
        var date = new Date();
        $.getJSON('http://api.openweathermap.org/data/2.5/weather?APPID=c458144dcb333ecebc0dca40460acf7b&q='+cities[i].name+'&callback=?&units=metric', null,
            function(data) {
                if(data.cod == '404')return;
                info[data.name] = {
                    name:data.name,
                    country:data.sys.country,
                    temp:data.main.temp,
                    weather:data.weather[0].main,
                    des:data.weather[0].description,
                    hum:data.main.humidity,
                    wind:data.wind.speed
                };

            }).success(function(data){
            if(data.name == 'Beijing')
                update();

        });
    }

}
setTimes();
init();


//set the local times in degrees so it shows in the clock
function setTimes(){
    var date = new Date();
    for(var j = 0; j < cities.length; j++){
        var hours = (date.getUTCHours() > 11)? date.getUTCHours() - 12 + parseInt(cities[j].utc,10) : date.getUTCHours() + parseInt(cities[j].utc,10);
        cities[j].hours = (hours/12)*360;
        cities[j].minoutes = (date.getUTCMinutes()/60)*360;

    }

}

//update all information for each place
function update(){
    $('.update').addClass('anim');
    var city = info[cities[current].name];

    $('.place').text(city.name+','+city.country);
    $('.temp span').html(city.temp+'<sup>o</sup>C');
    $('.main').text(city.weather);
    $('.des').text(city.des);
    $('.wind span').html(city.wind+'m/s');
    $('.humidity span').html(city.hum+'%');
    $('.hour').css('transform','rotate('+cities[current].hours+'deg)');
    $('.min').css('transform','rotate('+cities[current].minoutes+'deg)');
    current = (current + 1) % 18;
    setTimeout(update,6000);
}

//after fade animation has finished remove the class that caused it so it can be reused
$('.update').on('webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', function() {
    $('.anim').removeClass('anim');
});


