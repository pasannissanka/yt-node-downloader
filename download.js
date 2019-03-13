const fs = require('fs');
const https = require('https');
const ProgressBar = require('progress');
const m3u8stream = require('m3u8stream');
const readline = require('readline');
const ytdesc = require('./ytdecs');

const format = require('./formats');


// global variables
// var qualityUser = 'h'; // TEMP


// function setFlags(vidQuality) { // TEMP - TODO get according to quality
//     qualityUser = vidQuality;
// }

function getStreamURL(data) {  // playerResponse.streamingData.adaptiveFormats = data /  streamData.url_encoded_fmt_stream_map = data
    for (i in data) {
        for (j in format.quality) {
            if (parseInt(data[i].itag) === format.quality[j].itag) {  // TODO : add conditions to get according to quality (h,m,l,a/o)
                var streamURLData = {
                    itag: format.quality[j].itag,
                    container: format.quality[j].container,
                    urlS: data[i].url
                };
                return streamURLData;
            }
        }
    }
}

function getFileInfoData(streamData) {
    var playerResponse = JSON.parse(streamData.player_response);  // 
    var vidTitle = ytdesc.sanitize(streamData.title, ' ');
    if (playerResponse.playabilityStatus.status === 'OK') {
        // callback(null, playerResponse); // playerResponse.streamingData.adaptiveFormats contains video only/audio only streams
        // checks url_encoded_fmt_stream_map first
        var streamURLData = getStreamURL(streamData.url_encoded_fmt_stream_map);
        // console.log(streamURLData);
        var adaptiveFormatData = getStreamURL(playerResponse.streamingData.adaptiveFormats);
        // console.log(adaptiveFormatData);
        // console.log(streamURLData);
        var downloadURL = new URL(streamURLData.urlS);
        var container = streamURLData.container;
        downloadVideo(vidTitle, downloadURL, container);
    } else {
        console.log("Copyright protected");
    }
}

function checkFileAvailablility(title, container) {
    var path = `./${title}.${container}`;
    var num = 0;
    while (fs.existsSync(path)) {
        num++;
        path = `./${title}(${num}).${container}`;
    }
    return path;
}

function downloadVideo(title, url, container) {
    var path = checkFileAvailablility(title, container);
    var file = fs.createWriteStream(path);
    https.get(url.href, (response) => {
        var total = parseInt(response.headers["content-length"], 10);
        console.log();
        var bar = new ProgressBar('  downloading [:bar] :current/:total :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: total
        });
        response.pipe(file);
        // console.log('WORKS');
        response.on('data', (chunk) => {
            bar.tick(chunk.length);
        });
    }).on('error', (e) => {
        console.log(e);
    }).on('end', () => {
        console.log('\n');
    });
}


// function downloadVideo(title, url, container) {
//     var path = checkFileAvailablility(title, container);
//     var file = fs.createWriteStream(path);
//     const stream = m3u8stream(url);
//     stream.pipe(file);
//     stream.on('progress', (segment, totalSegments, downloaded) => {
//         readline.cursorTo(process.stdout, 0);
//         process.stdout.write(
//             `${segment.num} of ${totalSegments} segments ` +
//             `(${(segment.num / totalSegments * 100).toFixed(2)}%) ` +
//             `${(downloaded / 1024 / 1024).toFixed(2)}MB downloaded`);
//     });
// }






// const file = fs.createWriteStream("file.web");          // need to save metadata
// const request = client.get("https://r1---sn-a5o35cxaa-jhce.googlevideo.com/videoplayback?key=yt6&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&txp=5535432&lmt=1551123631392823&ratebypass=yes&ipbits=0&itag=22&ei=Q5h-XIDqCfHGz7sP4_6MUA&c=WEB&mime=video%2Fmp4&ip=113.59.213.6&initcwndbps=360000&requiressl=yes&mm=31%2C29&source=youtube&pl=24&mn=sn-a5o35cxaa-jhce%2Csn-npoe7nes&dur=692.140&fvip=1&mt=1551800223&mv=m&id=o-AJhTaen91SHUdAYp8cepxWEM5M9WrBNEQeyxGuD90Nw3&ms=au%2Crdu&signature=D07A6EDF7465DCBE04EC3F8823FFAAD7757AD928.4D2CE5212F1531FEBD5B1AC41455DBDCE5AEBD22&expire=1551821987", function (response) {
//   response.pipe(file);
// });


module.exports = {
    getFileInfoData,
    // setFlags
}