const url = require('url');
var request = require('request');
const fs = require('fs');


function getURL(url, callback) {
    var link = new URL(url);
    var videoID = link.searchParams.get('v');
    if (videoID.length !== 11) {
        callback('Invalid Input');
    } else {
        callback(undefined, videoID);
    }
}

function qsToJson(qs) {
    // function from : https://github.com/pste/youtube.get-video-info 

    var res = {};
    var pars = qs.split('&');
    var kv, k, v;
    for (i in pars) {
        kv = pars[i].split('=');
        k = kv[0];
        v = kv[1];
        res[k] = decodeURIComponent(v);
    }
    return res;
}


function getVideoInfo(id, callback) {
    //// function from : https://github.com/pste/youtube.get-video-info

    var url = new URL('http://www.youtube.com/get_video_info?hl=en?html5=1');
    url.searchParams.set('video_id', id);

    request(url.href, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var getVideoInfo = qsToJson(body);
            // remapping urls into an array of objects
            var temp = getVideoInfo["url_encoded_fmt_stream_map"];
            if (temp) {
                temp = temp.split(',');
                for (i in temp) {
                    temp[i] = qsToJson(temp[i]);
                }
                getVideoInfo["url_encoded_fmt_stream_map"] = temp;
            }

            // done
            callback(null, getVideoInfo);
        }
        else {
            console.log('(youtube.get-video.info) HTTP response not 200/OK');
            callback(err, null);
        }
    });
}

function getTitle(streamData) {
    var title = streamData.title;
    return title;
}


function sanitize(input, replacement) {
    var illegalRe = /[\/\?<>\\:\*\|":]/g;
    var plus = /[+.]/g;
    var controlRe = /[\x00-\x1f\x80-\x9f]/g;
    var reservedRe = /^\.+$/;
    var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    var sanitized = input
        .replace(plus, replacement)
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement);
    return sanitized;
}

function getStreamLink(streamData) {
    var data = streamData.url_encoded_fmt_stream_map;
    console.log(playerStatus);
    // var url = '';
    for (i in data) {
        if (data[i].itag === '22') {
            var url = new URL(data[i].url);
            return url;
        }
    }
}


module.exports = {
    getURL,
    getVideoInfo,
    getTitle,
    getStreamLink, sanitize
}