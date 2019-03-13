// const https = require('https');
// const http = require('http');
// const fs = require('fs');
const ytdesc = require('./ytdecs');
const download = require('./download');


const yargs = require('yargs');

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command('yt', 'youtube', {
    link: {
      describe: 'Youtube video url',
      demand: true,
      alias: 'l'
    },
  })
  .option('quality', {
    alias: 'q',
    describe: 'choose quality h-high, m-medium, l-low',
    choices: ['h', 'm', 'l'],
    default: 'h'
  })
  .help()
  .argv;

var command = process.argv[2];
var streamData = {};


if (command === 'yt') {
  // download.setFlags(argv.quality); // sets video quality to downloads global variable
  ytdesc.getURL(argv.link, (error, videoID) => {
    if (error) {
      console.log(error);
    } else {
      ytdesc.getVideoInfo(videoID, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          streamData = res;
          download.getFileInfoData(streamData);
        }
      });
    }
  });
}



// const file = fs.createWriteStream("file.web");          // need to save metadata
// const request = client.get("https://r1---sn-a5o35cxaa-jhce.googlevideo.com/videoplayback?key=yt6&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&txp=5535432&lmt=1551123631392823&ratebypass=yes&ipbits=0&itag=22&ei=Q5h-XIDqCfHGz7sP4_6MUA&c=WEB&mime=video%2Fmp4&ip=113.59.213.6&initcwndbps=360000&requiressl=yes&mm=31%2C29&source=youtube&pl=24&mn=sn-a5o35cxaa-jhce%2Csn-npoe7nes&dur=692.140&fvip=1&mt=1551800223&mv=m&id=o-AJhTaen91SHUdAYp8cepxWEM5M9WrBNEQeyxGuD90Nw3&ms=au%2Crdu&signature=D07A6EDF7465DCBE04EC3F8823FFAAD7757AD928.4D2CE5212F1531FEBD5B1AC41455DBDCE5AEBD22&expire=1551821987", function (response) {
//   response.pipe(file);
// });