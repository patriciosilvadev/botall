const fs = require("fs"); 
const moment = require("moment");
const qrcode = require("qrcode-terminal"); 
const { Client, MessageMedia } = require("whatsapp-web.js"); 
const mqtt = require("mqtt"); 
const listen = mqtt.connect("mqtt://test.mosquitto.org"); 
const fetch = require("node-fetch"); 
const User = require("./user.js"); 
const delay = require("delay"); 
let urlen = require("urlencode"); 
const puppeteer = require("puppeteer"); 
const cheerio = require("cheerio"); 
const SESSION_FILE_PATH = "./session.json";
// file is included here
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}
client = new Client({   
    
       puppeteer: {
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: false,
    args: [
      "--log-level=3", // fatal only
   
      "--no-default-browser-check",
      "--disable-infobars",
      "--disable-web-security",
      "--disable-site-isolation-trials",
      "--no-experiments",
      "--ignore-gpu-blacklist",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
    
      "--disable-extensions",
      "--disable-default-apps",
      "--enable-features=NetworkService",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    
      "--no-first-run",
      "--no-zygote"
    ]
    
    },        
    session: sessionCfg
});
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.

client.initialize();

// ======================= Begin initialize WAbot

client.on("qr", qr => {
  // NOTE: This event will not be fired if a session is specified.
  qrcode.generate(qr, {
    small: true
  });
  console.log(`[ ${moment().format("HH:mm:ss")} ] Please Scan QR with app!`);
});

client.on("authenticated", session => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] Authenticated Success!`);
  // console.log(session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", msg => {
  // Fired if session restore was unsuccessfull
  console.log(
    `[ ${moment().format("HH:mm:ss")} ] AUTHENTICATION FAILURE \n ${msg}`
  );
  fs.unlink("./session.json", function(err) {
    if (err) return console.log(err);
    console.log(
      `[ ${moment().format("HH:mm:ss")} ] Session Deleted, Please Restart!`
    );
    process.exit(1);
  });
});

client.on("ready", () => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] Whatsapp bot ready!`);
});

// ======================= Begin initialize mqtt broker

listen.on("connect", () => {
  listen.subscribe("corona", function(err) {
    if (!err) {
      console.log(`[ ${moment().format("HH:mm:ss")} ] Mqtt topic subscribed!`);
    }
  });
});

// ======================= WaBot Listen on Event

client.on("message_create", msg => {
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    // do stuff here
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  // console.log(after); // message after it was deleted.
  if (before) {
    console.log(before.body); // message before it was deleted.
  }
});

client.on("message_revoke_me", async msg => {
  // Fired whenever a message is only deleted in your own view.
  // console.log(msg.body); // message before it was deleted.
});

client.on("message_ack", (msg, ack) => {
  /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

  if (ack == 3) {
    // The message was read
  }
});

client.on("group_join", notification => {
  // User has joined or been added to the group.
  console.log("join", notification);
  notification.reply("User joined.");
});

client.on("group_leave", notification => {
  // User has left or been kicked from the group.
  console.log("leave", notification);
  notification.reply("User left.");
});

client.on("group_update", notification => {
  // Group picture, subject or description has been updated.
  console.log("update", notification);
});

client.on("disconnected", reason => {
  console.log("Client was logged out", reason);
});

// ======================= WaBot Listen on message

client.on("message", async msg => {
 // console.log(
 //   `[ ${moment().format("HH:mm:ss")} ] Message:`,
 //   msg.from.replace("@c.us", ""),
//    `| ${msg.type}`,
 //   msg.body ? `| ${msg.body}` : ""
//  );


  if (msg.type == "ciphertext") {
    // Send a new message as a reply to the current one
    } else if (msg.body == "Assalamualaikum") {
    // Send a new message as a reply to the current one
    msg.reply("waalaikumsallam");
  }else if (msg.body.startsWith("!anime")) {
var fs = require('fs');
var chat = await msg.getChat();
var files = fs.readdirSync('./kwpin')

/* now files is an Array of the name of the files in the folder and you can pick a random name inside of that array */
var  gambar = files[Math.floor(Math.random() * files.length)] 
var yuli = fs.readFileSync(
        "./kwpin/"+ gambar,
        "base64"
      );
const media = new MessageMedia('image/jpg', yuli);

console.log(gambar);
client.sendMessage(media);
}
else if (msg.body.startsWith("!nh ")) {
const kode = msg.body.split(" ")[1];
const NanaAPI = require("nana-api");
const nana = new NanaAPI();
const https = require("https");
const fs = require("fs");
const { exec } = require("child_process");

// Get gallery from book ID or book link
nana.g(kode).then((g) => {
if (g == 'Book not found!'){
msg.reply("Kode nuklir nya salah , coba perhatiin lagi")
}else{
var url = "https://nhentai.net/g/"+ g.media_id +"/cover.jpg"

exec('wget "' + url + '" -O cover.jpg', (error, stdout, stderr) => {
 var teks = "Judul English  : "+ g.title.english.slice("0") +" \n \n Judul Japanese : "+ g.title.japanese +"\n \n Judul Pendek   : "+ g.title.pretty +"\n \n Kode Nuklir    : "+ g.id +" \n ";

let media = MessageMedia.fromFilePath('cover.jpg');
  client.sendMessage(msg.from, media, {
  caption: teks });
  if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
}
})

}
else if (msg.body.startsWith("!doujinshi ")) {
const kode = msg.body.split(" ")[1];
const NanaAPI = require("nana-api");
const nana = new NanaAPI();
const https = require("https");
const fs = require("fs");
const { exec } = require("child_process");

// Get gallery from book ID or book link
nana.g(kode).then((g) => {
if (g == 'Book not found!'){
msg.reply("Kode nuklir nya salah , coba perhatiin lagi")
}else{

var url = "https://nhentai.net/g/"+ g.media_id +"/cover.jpg"
var dl = "https://hdl.rurafs.me/download/nhentai/"+ g.id;

 var teks = "Judul English  : "+ g.title.english.slice("0") +" \n \n Judul Japanese : "+ g.title.japanese +"\n \n Judul Pendek   : "+ g.title.pretty +"\n \n Kode Nuklir    : "+ g.id +" \n \n Download Link : "+ dl+"";
exec('nhentai --id=' + g.id + ' -P mantap.pdf -o ./ --format=hentong/'+ g.id, (error, stdout, stderr) => {

let media = new MessageMedia('application/pdf','hentong/'+ g.id +'/mantap.pdf');
  client.sendMessage(media);
  if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
}
})

}
  else if (msg.body.startsWith("!fb ")) {
    msg.reply(`*Hai, Kita Proses Dulu Ya . . .*`);
    let link = msg.body.split(" ")[1];
  var namafile = "gue.mp4"
  var chat = await msg.getChat();
  const { exec } = require("child_process");
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });
    const page = await browser.newPage();
    await page
      .goto("https://id.savefrom.net/download-from-instagram", {
        waitUntil: "networkidle2",
      })
      .then(async () => {
        await page.type("#sf_url", `${link}`);
        await page.click("#sf_submit");
        try {
          msg.reply("Mendownload Video!");
          await page.waitForSelector(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const element = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const text = await (await element.getProperty("href")).jsonValue();
          const judul = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.meta > div"
          );
          const judul1 = await (await judul.getProperty("title")).jsonValue();
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > Berhasil Dilakukan`
          );
          msg.reply(
            `*BERHASIL!!!*
Judul : ${judul1}
        
        
 👾 Facebook Downloader By sanBot 👾`
          );
      
exec('wget "' + text + '" -O mp4/'+ namafile +'.mp4', (error, stdout, stderr) => {
  const media = MessageMedia.fromFilePath('mp4/'+ namafile +'.mp4');

  chat.sendMessage(media);
  if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
          browser.close();
        } catch (error) {
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > GAGAL Dilakukan`
          );
          msg.reply(
            `[GAGAL] PASTIKAN LINK VIDEO BERSIFAT PUBLIK DAN DAPAT DIAKSES OLEH SEMUA ORANG!*`
          );
          browser.close();
        }
      })
      .catch((err) => {
        console.log(
          `[${moment().format("hh:mm:ss")}][!fb][${msg.from}] > GAGAL Dilakukan`
        );
        msg.reply(
          `[GAGAL] Server Sedang Down!\n\nSilahkan Coba Beberapa Saat Lagi!`
        );
        browser.close();
      });
   
   
  }
 else if (msg.body.startsWith("!tw ")) {
    msg.reply(`*Hai, Kita Proses Dulu Ya . . .*`);
    let link = msg.body.split(" ")[1];
  var namafile = "tw.mp4"
  var chat = await msg.getChat();
  const { exec } = require("child_process");
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });
    const page = await browser.newPage();
    await page
      .goto("https://id.savefrom.net/download-from-instagram", {
        waitUntil: "networkidle2",
      })
      .then(async () => {
        await page.type("#sf_url", `${link}`);
        await page.click("#sf_submit");
        try {
          msg.reply("Mendownload Video!");
          await page.waitForSelector(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const element = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a a.data-quality=720 "
          );
      await page.click("link link-download subname ga_track_events download-icon");
          const text = await (await element.getProperty("href")).jsonValue();
          const judul = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.meta > div"
          );
          const judul1 = await (await judul.getProperty("title")).jsonValue();
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > Berhasil Dilakukan`
          );
          msg.reply(
            `*BERHASIL!!!*
Judul : ${judul1}
        
        
 👾 Twitter Downloader By sanBot 👾`
          );
      
exec('wget "' + text + '" -O mp4/'+ namafile +'.mp4', (error, stdout, stderr) => {
  const media = MessageMedia.fromFilePath('mp4/'+ namafile +'.mp4');

  chat.sendMessage(media);
  if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
          browser.close();
        } catch (error) {
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > GAGAL Dilakukan`
          );
          msg.reply(
            `[GAGAL] PASTIKAN LINK VIDEO BERSIFAT PUBLIK DAN DAPAT DIAKSES OLEH SEMUA ORANG!*`
          );
          browser.close();
        }
      })
      .catch((err) => {
        console.log(
          `[${moment().format("hh:mm:ss")}][!fb][${msg.from}] > GAGAL Dilakukan`
        );
        msg.reply(
          `[GAGAL] Server Sedang Down!\n\nSilahkan Coba Beberapa Saat Lagi!`
        );
        browser.close();
      });
   
   
  }   
else if (msg.body.startsWith("!translate ")) {
const translatte = require('translatte');
var codelang = msg.body.split("[")[1].split("]")[0];
var text = msg.body.split("]")[1];
translatte(text, {to: codelang}).then(res => {
    msg.reply(res.text);
}).catch(err => {
    msg.reply(err);
});
}
else if (msg.body.startsWith("#lirik ")) {
  var get = msg.body.split("!lirik ")[1];
  var artis = get.split("-")[0];

  var lirik = get.split("-")[1];
  const { getLyrics } = require("genius-lyrics-api");
const options = {
  apiKey: 'NvLyzudSQ3xvZNwGaMzleGIFEDSe6qeQHl6gShNALO3LUI40mmS-nDT611UED5E7',
  title: lirik,
  artist: artis,
  optimizeQuery: true
};

getLyrics(options).then((lyrics) => msg.reply(`

${lyrics}`));

}
  
else if (msg.body.startsWith("!fb ")) {

const request = require('request');
var req = msg.body.split(" ")[1];
const { exec } = require("child_process");
var crypto = require('crypto');
var fs = require('fs'); 
var chat = await msg.getChat();
var filename = 'video'+crypto.randomBytes(4).readUInt32LE(0)+'saya';
var path = require('path');
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://fbdownloader.net/download/?url='+ req,
},function(error, response, body){
    let $ = cheerio.load(body);
   var gehu = $('a[rel="noreferrer no-follow"]').attr('href');
msg.reply("bentarr lagi di proses dulu ya .. 😣");
exec('wget "' + gehu + '" -O mp4/gue.mp4', (error, stdout, stderr) => {
     const media = MessageMedia.fromFilePath('mp4/gue.mp4');
chat.sendMessage(media);
   
  if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    msg.reply("yahh gagal 😭");
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}else if (msg.body.startsWith("!igv ")) {
    msg.reply(`*Hai, Kita Proses Dulu Ya . . .*`);
    let link = msg.body.split(" ")[1];
  var namafile = link.split("/p/")[1].split("/")[0];
  var chat = await msg.getChat();
  const { exec } = require("child_process");
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });
    const page = await browser.newPage();
    await page
      .goto("https://id.savefrom.net/download-from-instagram", {
        waitUntil: "networkidle2",
      })
      .then(async () => {
        await page.type("#sf_url", `${link}`);
        await page.click("#sf_submit");
        try {
          msg.reply("Mendownload Video!");
          await page.waitForSelector(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const element = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const text = await (await element.getProperty("href")).jsonValue();
          const judul = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.meta > div"
          );
          const judul1 = await (await judul.getProperty("title")).jsonValue();
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > Berhasil Dilakukan`
          );
          msg.reply(
            `*BERHASIL..!!!*
Judul : ${judul1}
        
        
 👾 Instagram Video Downloader By sanBot 👾
 
 Sedang mengirimkan video .. 🎬`
          );

exec('wget "' + text + '" -O mp4/'+ namafile +'.mp4', (error, stdout, stderr) => {
  const media = MessageMedia.fromFilePath('mp4/'+ namafile +'.mp4');

  chat.sendMessage(media);
  if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
          browser.close();
        } catch (error) {
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > GAGAL Dilakukan`
          );
          msg.reply(
            `[GAGAL] PASTIKAN LINK VIDEO BERSIFAT PUBLIK DAN DAPAT DIAKSES OLEH SEMUA ORANG!*`
          );
          browser.close();
        }
      })
      .catch((err) => {
        console.log(
          `[${moment().format("hh:mm:ss")}][!fb][${msg.from}] > GAGAL Dilakukan`
        );
        msg.reply(
          `[GAGAL] Server Sedang Down!\n\nSilahkan Coba Beberapa Saat Lagi!`
        );
        browser.close();
      });
   
   
  } 
  else if (msg.body.startsWith("!igp ")) {
    msg.reply(`*Hai, Kita Proses Dulu Ya . . .*`);
    let link = msg.body.split(" ")[1];
  var namafile = link.split("/p/")[1].split("/")[0];
  var chat = await msg.getChat();
  const { exec } = require("child_process");
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });
    const page = await browser.newPage();
    await page
      .goto("https://id.savefrom.net/download-from-instagram", {
        waitUntil: "networkidle2",
      })
      .then(async () => {
        await page.type("#sf_url", `${link}`);
        await page.click("#sf_submit");
        try {
          msg.reply("Mendownload Video!");
          await page.waitForSelector(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const element = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const text = await (await element.getProperty("href")).jsonValue();
          const judul = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.meta > div"
          );
          const judul1 = await (await judul.getProperty("title")).jsonValue();
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > Berhasil Dilakukan`
          );
          msg.reply(
            `*BERHASIL..!!!*
Judul : ${judul1}
        
        
 👾 Instagram Photo Downloader By sanBot 👾
 
 Sedang mengirimkan Photo .. 🎬`
          );

exec('wget "' + text + '" -O mp4/'+ namafile +'.jpg', (error, stdout, stderr) => {
  const media = MessageMedia.fromFilePath('mp4/'+ namafile +'.jpg');

  chat.sendMessage(media);
  if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
          browser.close();
        } catch (error) {
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > GAGAL Dilakukan`
          );
          msg.reply(
            `[GAGAL] PASTIKAN LINK VIDEO BERSIFAT PUBLIK DAN DAPAT DIAKSES OLEH SEMUA ORANG!*`
          );
          browser.close();
        }
      })
      .catch((err) => {
        console.log(
          `[${moment().format("hh:mm:ss")}][!fb][${msg.from}] > GAGAL Dilakukan`
        );
        msg.reply(
          `[GAGAL] Server Sedang Down!\n\nSilahkan Coba Beberapa Saat Lagi!`
        );
        browser.close();
      });
   
   
  } 
else if (msg.body.startsWith("#brainly ")) {
var hh = msg.body.split("!brainly ")[1]
var tanya = hh.replace(/ /g, "%20");
const fetch = require('node-fetch')

const url = "https://tools.aqin.my.id/api/brainly/?q="+ tanya
var regex = /<br\s*[\/]?>/gi;
const solution = () => {
  fetch(url).then(res => res.json()).then((res) => {
    
res.data.questionSearch.edges.slice(-5).forEach(item => {
  var tanyaan = item.node.content
    item.node.answers.nodes.slice(-5).forEach(item => { 
 var jawaban = item['content']
 var g = jawaban.replace(regex, "\n")
 var h  = g.replace(/<[^>]*>?/gm, '');
  msg.reply(
        `
        
      ======================
    
        Pertanyaan : 
    
      *${tanyaan.replace(regex, "\n")}*
      
      
      Jawaban : 
    
      *${h}*
    ======================
      `);
   
      })
      console.log("=========")
    })
  })
}

solution();

}

else if (msg.body.startsWith("!sial ")) {
const request = require('request');
var req = msg.body;
var tanggal = req.split(" ")[1];
var kk = req.split(" ")[2];
var bulan = kk.replace("0", "");
var tahun = req.split(" ")[3];
const emojiRegex = require('emoji-regex');

const emoye =kk + bulan + tahun ;
 
const regex = emojiRegex();
let match;
if(match = regex.exec(emoye)) {
  const emoji = match[0];
  msg.reply(emoji);
}else{
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/primbon_hari_naas.php',
  body: "tgl="+ tanggal +"&bln="+ bulan +"&thn="+ tahun +"&submit=+Submit%21+"
},function(error, response, body){
    let $ = cheerio.load(body);
var y = $.html().split('<b>PRIMBON HARI NAAS</b><br><br>')[1];
    var t = y.split('.</i><br><br>')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
    var d = h.replace("&amp;", '&')
console.log(""+ d);
msg.reply(` 

-----------------------------------

 Cek Hari Naas Kamu ~
 
 
 ${d}
 
 
 ----------------------------------
  👾 sanBot 2020👾
 
 `); 
});
}
}

else if (msg.body.startsWith("!pasangan ")) {
const request = require('request');
var req = msg.body;
var gh = req.split("!pasangan ")[1];

var namamu = gh.split("&")[0];
var pasangan = gh.split("&")[1];
const emojiRegex = require('emoji-regex');

const emoye =""+ namamu +""+ pasangan;
 
const regex = emojiRegex();
let match;
if(match = regex.exec(emoye)) {
  const emoji = match[0];
  msg.reply(emoji);
}else{
  console.log("oke")
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/kecocokan_nama_pasangan.php?nama1='+ namamu +'&nama2='+ pasangan +'&proses=+Submit%21+',
 
},function(error, response, body){
    let $ = cheerio.load(body);
var y = $.html().split('<b>KECOCOKAN JODOH BERDASARKAN NAMA PASANGAN</b><br><br>')[1];
    var t = y.split('.<br><br>')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
    var d = h.replace("&amp;", '&')
console.log(""+ d);
msg.reply(` 

-----------------------------------

 *Cek Kecocokan Jodoh Berdasarkan Nama ~*
 
 
 ${d}
 
 
 ----------------------------------
  👾 sanBot 2020 👾
 
 `); 
});
}
}
else if (msg.body.startsWith("!xnxx")) {
msg.reply('Katakanlah kepada orang laki-laki yang beriman: Hendaklah mereka menahan pandangannya dan memelihara kemaluannya; yang dmeikian itu adalah lebih suci bagi mereka. Sesungguhnya Allah Maha Mengetahui apa yang mereka perbuat.');
}
else if (msg.body.startsWith("!ytmp3 ")) {
var url = msg.body.split(" ")[1];
var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
var chat = await msg.getChat();
const { exec } = require("child_process");
if(videoid != null) {
   console.log("video id = ",videoid[1]);
} else {
    msg.reply("Videonya gavalid gan.");
}
msg.reply(" Tunggu sebentar kak .. Lagi di proses ☺");
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "ffmpeg", 
    "outputPath": "./mp3",    // Where should the downloaded and en>
    "youtubeVideoQuality": "highest",       // What video quality sho>
    "queueParallelism": 100,                  // How many parallel down>
    "progressTimeout": 2000                 // How long should be the>
});

//Download video and save as MP3 file
YD.download(videoid[1]);

YD.on("finished", function(err, data) {


const musik = MessageMedia.fromFilePath(data.file);
msg.reply(` 
 
   Mp3 Berhasil di download
   
  ----------------------------------

Nama File : *${data.videoTitle}*
Nama : *${data.title}*
Artis : *${data.artist}*

   ----------------------------------
👾Ytmp3 WhatsApp By sanBot👾
`);
chat.sendMessage(musik);
});
YD.on("error", function(error) {
    console.log(error);
});

YD.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
});
}
else if (msg.body.startsWith("!cekresi ")) {
const fetch = require('node-fetch')
var nomor = msg.body.split("-n ")[1].split("-k")[0];

var kurir = msg.body.split("-k ")[1];
if (nomor.length === 0){
console.log("nomor resi belum diisi");

}if (kurir.length === 0){
console.log("kurir belum diisi")
}else{
const cekResi = (courier, waybill) => new Promise(async (resolve, reject) => {
  const opts = {
    method: 'POST',
    headers: {
      key: 'e079daba710176abe3c4e8edf375cb8e',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams([['waybill', waybill], ['courier', courier]])
  }

  fetch('https://pro.rajaongkir.com/api/waybill', opts)
    .then(res => res.json())
    .then(result => {
console.log(result.rajaongkir)
      msg.reply(`


Code kurir : ${result.rajaongkir.result.summary.replace("...", "").courier_code}
Kurir : ${result.rajaongkir.result.summary.replace("...", "").courier_name} 
Nomor Resi : ${result.rajaongkir.result.summary.replace("...", "").waybill_number}
Kode Service : ${result.rajaongkir.result.summary.replace("...", "").courier_name}
Pengirim : ${result.rajaongkir.result.summary.replace("...", "").shipper_name}
Penerima : ${result.rajaongkir.result.summary.replace("...", "").receiver_name}
Status  :${result.rajaongkir.result.summary.replace("...", "").status}

Asal dan Tujual : ${result.rajaongkir.result.summary.replace("...", "").origin} ke ${result.rajaongkir.result.summary.replace("...", "").destination}
`);
      resolve(result.rajaongkir)
    })
    .catch(err => reject(err))
console.log("error")
})
cekResi(kurir, nomor);

}
}

else if (msg.body.startsWith("!tts")) {
  var texttomp3 = require("text-to-mp3");
    var fs = require("fs");
  var chat = await msg.getChat();
var suara = msg.body.split("!tts ")[1];
var text = suara.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
var fn = "tts/gue.mp3";
const emojiRegex = require('emoji-regex');

const emoye =text;
 
const regex = emojiRegex();
let match;
if(match = regex.exec(emoye)) {
  const emoji = match[0];
  msg.reply(emoji);
}else{
  console.log("oke");
if(process.argv.indexOf("-?")!== -1){
  console.log("TextToMp3 bach use the TextToMp3 library wich use the google translate public API to generate an mp3 with ");
  console.log("-t \t\t\t Provide the Text here with \" arround the text \", limited to 200 characters");
  console.log("-f \t\t\t Provide the file name of MP3 you whant generate, otherways it will be generated automatically");
  console.log("");
  return;
}


if(process.argv.indexOf("-t")!== -1)
  text=suara;

if(process.argv.indexOf("-f")!== -1)
  fn=suara;

text = text.replace(/ +(?= )/g,'');//remove all multiple space

if(typeof text ===  "undefined" || text === ""
  || typeof fn === "undefined" || fn === "") { // just if I have a text I'm gona parse
  console.log("missing required params, check out the help with -?");
}


//HERE WE GO
texttomp3.getMp3(text, function(err, data){
  if(err){
    console.log(err);
    return;
  }

  if(fn.substring(fn.length-4, fn.length) !== ".mp3"){ // if name is not well formatted, I add the mp3 extention
    fn+=".mp3";
  }
  var file = fs.createWriteStream(fn); // write it down the file
  file.write(data);
 
  console.log("MP3 SAVED!");
  
});
await new Promise(resolve => setTimeout(resolve, 500));
if(text.length > 200){ // check longness of text, because otherways google translate will give me a empty file
 msg.reply("terlalu panjang .. disini gabisa lebih dari 200 karakter teks")
}else{
  const media = MessageMedia.fromFilePath(fn);

  chat.sendMessage(media);
}
}

}
else if (msg.body.startsWith("!quotes bucin")) {
const request = require('request');
request.get({
  headers: {
'user-agent' : 'Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36'
},
  url: 'https://jagokata.com/kata-bijak/kata-cinta.html',
},function(error, response, body){
    let $ = cheerio.load(body);
    var author = $('a[class="auteurfbnaam"]').contents().first().text();
   var kata = $('q[class="fbquote"]').contents().first().text();

client.sendMessage(
        msg.from,
        `
     _${kata}_
        
    

  *~${author}*
         `
      );

});
}
else if (msg.body.startsWith("!quotes bijak")) {
const request = require('request');
request.get({
  headers: {
'user-agent' : 'Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36'
},
  url: 'https://jagokata.com/kata-bijak/acak.html',
},function(error, response, body){
    let $ = cheerio.load(body);
    var author = $('a[class="auteurfbnaam"]').contents().first().text();
   var kata = $('q[class="fbquote"]').contents().first().text();

client.sendMessage(
        msg.from,
        `
     _${kata}_
        
    

  *~${author}*
         `
      );

});
}else if (msg.body.startsWith("!sticker ")) {
async function msgHandler (client, message) {
    try {
        // console.log(message)
        const { type, body, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message
        const { id, pushname } = sender
        const { name } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['!sticker', '!stiker']
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

        if (cmd) {
            if (!isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname))
            if (isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(name))
            const args = body.trim().split(' ')
            switch (cmd[0]) {
                case '!sticker':
                case '!stiker':
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64)
                    } else if (args.length == 2) {
                        var isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
                        const url = args[1]
                        if (url.match(isUrl)) {
                            await client.sendStickerfromUrl(from, url, { method: 'get' })
                                .catch(err => console.log('Caught exception: ', err))
                        } else {
                            client.sendText(from, 'Url yang kamu kirim tidak valid')
                        }
                    } else {
                        client.sendText(from, 'Tidak ada gambar! Untuk membuat sticker kirim gambar dengan caption #stiker')
                    }
                    break
                case '#help':
                        client.sendText(from, 'yahaa mana ada help')
                    break
            }
        } else {
            if (!isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

process.on('Something went wrong', function (err) {
    console.log('Caught exception: ', err
      );

});
}else if (msg.body.startsWith("!nama ")) {
const cheerio = require('cheerio');
const request = require('request');
var nama = msg.body.split("!nama ")[1];
var ruk = nama.replace(/ /g,"+");
var req = ruk.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,"janganemoji");
const emojiRegex = require('emoji-regex');

const text =req;
 
const regex = emojiRegex();
let match;
if(match = regex.exec(req)) {
  const emoji = match[0];
  msg.reply(`gaboleh pake ${emoji} cok`);
}else{
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/arti_nama.php?nama1='+ req +'&proses=+Submit%21+',
},function(error, response, body){
    let $ = cheerio.load(body);
    var y = $.html().split('arti:')[1];
    var t = y.split('method="get">')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
console.log(""+ h);
msg.reply(
            `
      *Arti Dari Namamu*

  ----------------------------------
         Nama _*${nama}*_ ${h}
  ----------------------------------

  👾sanBot👾
`
        );
});
}
}
else if (msg.body.startsWith("!sifat ")) {
const cheerio = require('cheerio');
const request = require('request');
var req = msg.body.split("[")[1].split("]")[0];
var nama = req.replace(/ /g," ");
var pesan = msg.body;
var y = pesan.replace(/ /g,"+ ");
var tanggal = y.split("]+")[1].split("-")[0];
var bulan = y.split("-")[1];
var tahun = y.split("-")[2];
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/sifat_karakter_tanggal_lahir.php',
  body:    "nama="+ req +"&tanggal="+ tanggal +"&bulan="+ bulan +"&tahun="+ tahun +"&submit=+Submit%21+"
},function(error, response, body){
 let $ = cheerio.load(body);
    $('title').after('body')
    var y = $.html().split('<b>Nama :</b>')[1];
    var t = y.split('</i><br><br>')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
console.log(""+ h);
            msg.reply(
            `
            *Sifat Dari Nama dan Tanggal Lahir*
         
  ----------------------------------
         Nama ${h}
  ----------------------------------

  👾Primbon WhatsApp By sanBot👾
`
        );
});
  }else if (msg.body.startsWith("!bpk ")) {
function HumanToABG(form){
    var abgteks="";
    var stemp;
    var i,j;
    var acak;
    var aseli=form.aseli.value;
    
    var TabelHuruf="AEGIOSZ";
    var TabelAngka="4361052"; //01234567890
    
    var TabelVokal="AIUEO";
    
    if(aseli.length)
    {
      //modifikasi huruf besar kecil kecil
      if(form.pilihan[0].checked==true)
      {
        for(i=0;i<aseli.length;i++)
       {
          acak = Math.round(2*Math.random())
          if(acak)
              abgteks=abgteks+aseli.charAt(i).toLowerCase();
            else
              abgteks=abgteks+aseli.charAt(i).toUpperCase();
       }
     }  
     else
      abgteks=aseli;
     
     //Modifikasi huruf jadi angka
     var terganti=0;
     stemp="";
     if(form.pilihan[1].checked==true)
      {
        for(i=0;i<aseli.length;i++)
       {
          acak=Math.round(2*Math.random())
          terganti=0;
          if(acak)
          {
            
            for(j=0;j<TabelHuruf.length;j++)
            { 
              if(abgteks.charAt(i).toUpperCase()==TabelHuruf.charAt(j))
              {
                stemp=stemp+TabelAngka.charAt(j);
                
                terganti=1;
                break;
              }
            }
          }       
          
          if(terganti==0) //huruf tidak dapat diganti 
            stemp=stemp+abgteks.charAt(i);
       }
       abgteks=stemp;
     }  
    
    //disingkat-singkat biar pendek
    stemp="";
    if(form.pilihan[2].checked==true)
      {
        for(i=0;i<aseli.length;i++)
       {
          acak=Math.round(2*Math.random())
          terganti=0;
          if(acak)
          {
            
            for(j=0;j<TabelVokal.length;j++)
            { 
              if(aseli.charAt(i).toUpperCase()==TabelVokal.charAt(j)) {if((aseli.charAt(i-1)!=" ")&&(i>0)) {//stemp=stemp+TabelAngka.charAt(j); hilangkan saja
                  terganti=1;}break;}}} if(terganti==0) //huruf tidak dapat diganti 
            stemp=stemp+abgteks.charAt(i);}abgteks=stemp;}  form.abg.value=abgteks;}
else{form.abg.value="Ya, anda harus memasukan karakter dulu";}}
console.log(""+ h);
            msg.reply(
            `
            *Sifat Dari Nama dan Tanggal Lahir*
         
  ----------------------------------
         Nama ${h}
  ----------------------------------

  👾Primbon WhatsApp By sanBot👾
`
        );
  }else if (msg.body.startsWith("!bbb ")) {
const url = msg.body.split(" ")[1];

var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
var chat = await msg.getChat();
if(videoid != null) {
   console.log("video id = ",videoid[1]);
} else {
    msg.reply("Videonya gavalid gan.");
}
msg.reply(" Tunggu sebentar kak .. Lagi di proses ☺");

const exec = require('child_process').exec;

function os_func() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
           exec(cmd, (error, stdout, stderr) => {
             if (error) {
                reject(error);
                return;
            }
            resolve(stdout)
           });
       })
   }
}
var os = new os_func();

os.execCommand('ytdl ' + url + ' -q highest -o mp4/'+ videoid[1] +'.mp4').then(res=> {
    const media = MessageMedia.fromFilePath('mp4/'+ videoid[1] +'.mp4');
chat.sendMessage(media);
}).catch(err=> {
    console.log("os >>>", err);
})

 }
  else if (msg.body.startsWith("!ytmp3 ")) {
    // Send a new message to the same chat
    msg.reply(` 
  
fitur ini di hapus .. 
silahkan tanya owner kenapa
`);
  }   else if (msg.body == "!donate" ||
    msg.body === "donasi ") {
    // Send a new message to the same chat
    client.sendMessage(msg.from, ` 
> No Dana  = 08975767944
> No Ovo   = 08975767944
> No Gopay = 08975767944
   
Jika ingin bertanya boleh chat kesini
wa.me/628975767944
  `);
  }
     else if (msg.body == "!rules" ||
    msg.body === "rules ") {
    // Send a new message to the same chat
    client.sendMessage(msg.from, ` 
  Rules ... !!!


• *Jangan spam bot ..*
 
• *Jangan rusuh kalo bot gaaktif*
• *Jangan telfon / vc bot nya ..*
     ( _auto block_ )
• *Jangan req yang aneh aneh ..*
  _seperti mendownload video ber jam jam_
  
• *Sesuai kan perintah dengan formatnya..*

_salah format dan bot error = block_

Konsekuensi :

 Melanggar rules bot akan keluar 
atau member yang nge rusuh harus di kick 


Rules ini untuk kenyamanan semua yang memakai
bot ini


  `);
  }
 
  else if (msg.body.startsWith("!sendto ")) {
    // Direct send a new message to specific id
    let number = msg.body.split(" ")[1];
    let messageIndex = msg.body.indexOf(number) + number.length;
    let message = msg.body.slice(messageIndex, msg.body.length);
    number = number.includes("@c.us") ? number : `${number}@c.us`;
    let chat = await msg.getChat();
    chat.sendSeen();
    client.sendMessage(number, message);
  }
  else if (msg.body == "bot" ||
    msg.body === "Bot") {
    // Send a new message to the same chat
    client.sendMessage(msg.from, "Gabut bangettt sihhh.. 🤭");
  }
    else if (msg.body == ":(" ||
    msg.body === "sedih" ||
    msg.body === "😭"  ||
    msg.body === "😢") {
    // Send a new message to the same chat
    msg.reply ("Jangan sedih ya .. aku ada disini kok , coba ceritain apa masalah nya 😊🤗");
  }
      else if (msg.body == "makasih" ||
    msg.body === "Makasih" ||
    msg.body === "thanks"  ||
    msg.body === "Thanks") {
    // Send a new message to the same chat
    msg.reply ("Sama Sama sahabat");
  }
  else if (msg.body.startsWith("!loker ")) {
const teks = msg.body.split("!loker ")[1];
var req = teks.split("[")[1].split("]")[0];
var kerjaan = teks.split("]")[1];
const indeed = require('indeed-scraper');

const queryOptions = {
  host: 'id.indeed.com',
  query: kerjaan,
  city: req,
  radius: '100',
  level: 'entry_level',
  jobType: 'fulltime',
  maxAge: '7',
  sort: 'date',
  limit: 100
};

indeed.query(queryOptions).then(res => {
client.sendMessage(msg.from, 
`
==============================
Nama Posisi :  *${res[0].title}*

Pekerjaan   : *${res[0].summary.replace("...", "").replace("...", "")}*

Perusahaan  : *${res[0].company}*

Tempat      : *${res[0].location}*

Waktu       : *${res[0].postDate}*

Link           : *${res[0].url}*

==============================

Nama Posisi :  *${res[1].title}*

Pekerjaan   : *${res[1].summary.replace("...", "")}*

Perusahaan  : *${res[1].company}*

Tempat      : *${res[1].location}*

Waktu       : *${res[1].postDate}*

Link           : *${res[1].url}*

==============================

Nama Posisi :  *${res[2].title}*

Pekerjaan   : *${res[2].summary.replace("...", "")}*

Perusahaan  : *${res[2].company}*

Tempat      : *${res[2].location}*

Waktu       : *${res[2].postDate}*

Link           : *${res[2].url}*

==============================

Nama Posisi :  *${res[3].title}*

Pekerjaan   : *${res[3].summary.replace("...", "")}*

Perusahaan  : *${res[3].company}*

Tempat      : *${res[3].location}*

Waktu       : *${res[3].postDate}*

Link           : *${res[3].url}*

==============================

`);

});
}

 else if (msg.body == "p" ||
    msg.body === "P") {
    // Send a new message to the same chat
    client.sendMessage(msg.from, "Coba ucapin Assalamualaikum");
  } else if (msg.body == "halo" || msg.body == "hai") {
    client.sendMesssage(msg.from, "kenapa sob");
  }  else if (msg.body == "!menu" ||
    msg.body === "!help") {
 client.sendMessage(msg.from, 
   `
   👾 List Menu Bot 👾:

*CEK DAFTAR MENU DENGAN PERINTAH*
*!rules*  = Untuk Melihat Rules
*!menu1*  = Just for fun
*!menu2*  = Horoscope / Ramalan
*!menu3*  = Downloader
*!menu4*  = NSFW Menu
*!bot*    = Untuk Melihat Harga
*!donate* = Untuk donasi
*!about*  = About Admin Bot
*!grup*   = Untuk Menampilkan Link Grup

WhatsApp Bot 2020 By sanBot
`);
}
   else if (msg.body == "!menu1"){
client.sendMessage(msg.from, `

<>Fun Menu<>

>*!translate* [codebahasa] teks
 contoh !translate [en] selamat pagi sayang ?
 
 untuk code bahasa bisa di cek dengan perintah *#codbah*
 
>*!tts* teks
*Ubah teks ke suara*
 contoh !tts ihsan ganteng
 
>*!iquotes bijak*
  untuk menampilkan quotes bijak

>*!quotes bucin*
  untuk menampilkan quotes bucin
 `);
 }
 else if (msg.body == "!menu2"){
 client.sendMessage(msg.from, `

<>Horoscope / Ramalan<>
 
>*!nama* <nama>
 *cari arti dari namamu* 

 contoh !nama Muslida Ayu 
 
>*!sifat* [nama] tt-mm-yy
 *cari sifat berdasarkan nama dan tanggal lahir* 

 contoh !sifat [Muslida Ayu] 03-007-2003 

>*!sial* tt mm yy
 *cek hari apes mu* 

 contoh !sial 17 08 1945 

>*!pasangan* namamu & pasanganmu
 *Cek kecocokan jodoh* 

 contoh !pasangan Ihsan & Ayu 
`);

}
else if (msg.body == "!menu3"){
 client.sendMessage(msg.from, `
 

<>DOWNLOADER MENU<>

>*!fb* <url>
 *_downloader facebook_* 
 
>*!igv* <url>
 *download video/stories instagram* 
 
>*!igp* <url>
 *download foto instagram* 

>*!ytmp3* <url>
 *konversi youtube ke mp3* 
`);
}
else if (msg.body == "!menu4"){
 client.sendMessage(msg.from, `

 <>NSFW MENU<>
    
>*!nh* code!
 *Nhentai info code* 
 
>*!doujinshi* code
 *download doujin from nhentai* 
 
>*!xnxx* keyword
 *download mantap mantap* (require usia)
 
 `);
 }else if (msg.body == "!bot"){
 client.sendMessage(msg.from, `

    <>sanBot menu<>
    
 > Akun Azure Education = 35K
 > Pasang Bot Whatsapp
   - Full Fiture   = 60k/Bulan
   - Bot Sticker   = 30k/Bulan
 > RDP
   - 4cpu 8gb ram  = 40k/Bulan
   - 4cpu 16gb ram = 70k/Bulan
 > VPS
   - 4cpu 8gb ram  = 40k/Bulan
   - 4cpu 16gb ram = 70k/Bulan
 > Youtube Premium
   - admin = 15k
   - invit = 5k

Mau Order Langsung Aja Cusss
wa.me/628975767944
 
 `);
 }else if (msg.body == "!about"){
 client.sendMessage(msg.from, `
 
<>About Me<>
> Nama : Ihsan

> Link Sosmed
  -https://fb.com/sanzyourbae
  -https://instagram.com/isnzxc

Jangan Lupa di Follow 

`);
}else if (msg.body == "!grup"){
client.sendMessage(msg.from, `

https://chat.whatsapp.com/IcvsAWjTQFz7NVXNvkAYgJ

 `);
 }else if (msg.body == "#codbah") {
    msg.reply(`
  Bahasa                Code
######               #####
English                 |  en
Esperanto            |  eo
Estonian              |  et
Finnish                |  fi
French                 |  fr
Frisian                 |  fy
Galician               |  gl
Georgian              |  ka
German               |  de
Greek                   |  el
Gujarati               |  gu
Haitian Creole    |  ht
Hausa                  |  ha
Hawaiian            |  haw (ISO-639-2)
Hebrew               |  he or iw
Hindi                   |  hi
Hmong                |  hmn (ISO-639-2)
Hungarian          |  hu
Icelandic             |  is
Igbo                     |  ig
Indonesian         |  id
Irish                     |  ga
Italian                  |  it
Japanese             |  ja
Javanese              |  jv
Kannada              |  kn
Kazakh                 |  kk
Khmer                  |  km
Kinyarwanda      |  rw
Korean                 |  ko
Kurdish               |  ku
Kyrgyz                |  ky
Lao                      |  lo
Latin                   |  la
Latvian               |  lv
Lithuanian         |  lt
Luxembourg     |  lb
Macedonian      |  mk
Malagasy           |  mg
Malay                 |  ms
Malayalam        |  ml
Maltese               |  mt
Maori                  |  mi
Marathi               |  mr
Myanmar.          |  my
Nepali                 |  ne
Norwegian          |  no
Nyanja.               |  ny
Odia (Oriya)        |  or
Pashto                |  ps
Persian               |  fa
Polish                 |  pl
Portuguese.        |  pt
Punjabi               |  pa
Romanian           |  ro
Russian               |  ru
Samoan               |  sm
Scots Gaelic        |  gd
Serbian               |  sr
Sesotho               |  st
Shona                 |  sn
Sindhi                 |  sd
Slovak                 |  sk
Slovenian            |  sl
Somali                 |  so
Spanish               |  es
Sundanese          |  su
Swahili                |  sw
Swedish               |  sv
Tagalog.               |  tl
Tajik                     |  tg
Tamil                    |  ta
Tatar                     |  tt
Telugu                  |  te
Thai                      |  th
Turkish                |  tr
Turkmen              |  tk
Ukrainian             |  uk
Urdu                      |  ur
Uyghur                  |  ug
Uzbek                    |  uz
Vietnamese          |  vi
Welsh                   |  cy
Xhosa                   |  xh
Yiddish                 |  yi
Yoruba                  |  yo
Zulu                      |  zu
      ` );
  } else if (msg.body == "!leave") {
    // Leave the group
    let chat = await msg.getChat();
    if (chat.isGroup) {
      chat.leave();
    } else {
      msg.reply("This command can only be used in a group!");
    }
  } else if (msg.body.startsWith("!yts ")) {
    let axios = require('axios').default;

async function search_youtube(username) {
    let request = await axios.get(`https://www.youtube.com/results?search_query=${username}&disable_polymer=1`);
    let body = request.data;
    let page = String(body);
    let page_source = page.split(" ");
    let title = []; //output title(s) array
    let id = []; //output id(s) array
    for (let index = 0; index<page_source.length; index+=2) {
        element = page_source[index];
        if (element.substring(0,15) == 'href="/watch?v='  && element.length == 27) {
            id.push(element.substring(15, element.length -1));
        };
    };
    for (let index = 0; index<page_source.length; index++) {
        let element = page_source[index];
        let element_next = page_source[index+2];
        if (element.substring(0,23) == 'data-sessionlink="itct=' && element_next.substring(0,7) == 'title="') {   
            let buffer = "";
            let init = page_source[index+2];
            buffer+= init;
            let sub_index = index + 3;
            let end = index + 43;
            while (sub_index<end) {
                let this_element = page_source[sub_index];
                let next_element = page_source[sub_index+1];
                if (this_element[this_element.length-1]== '"' && next_element == 'rel="spf-prefetch"') {
                    buffer+=(" "+this_element);
                    title.push(buffer.substring(7, buffer.length -1));
                    break;
                }
                else {buffer+=(" "+this_element);};
                sub_index+=1;
            };
        };
    };
    return [id, title]; //returned array having two sub-arrays of result video ids and names.
};

//calling async function
var search = msg.body.split(" ")[1];
(async () => {
    let callback = await search_youtube(search);
    for (let index in callback[0]) {
     var id =  callback[0][index];
     var title = callback[1][index];
        msg.reply(`
    
    Pencarian yang di temukan..

///////////////////////

ID VIDEO : *${id}*
Judul : *_${title}_*

//////////////////////

*Salin ID videonya saja , lalu gunakan untuk 
mendownload video atau mp3 di bot ini*

fitur ini berguna untuk kaum fakir kuota 
yang hanya punya kuota chat haha

👾 sanBot 2020 👾

`);
    };
})();

  }
});

listen.on("message", (topic, message) => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] MQTT: ${message.toString()}`);
  fs.readFile("./CoronaService/user.json", "utf-8", function(err, data) {
    if (err) throw err;
    const userData = JSON.parse(data);
    for (var i = 0; i < userData.length; i++) {
      let number = userData[i].user;
      // number = number.includes('@c.us') ? number : `${number}@c.us`;
      setTimeout(function() {
        console.log(
          `[ ${moment().format("HH:mm:ss")} ] Send Corona Update to ${number}`
        );
        if (message.toString() === "New Update!") {
          fs.readFile("./CoronaService/data.json", "utf-8", function(
            err,
            data
          ) {
            if (err) throw err;
            const localData = JSON.parse(data);
            const newCases = localData.NewCases === "" ? 0 : localData.NewCases;
            const newDeaths =
              localData.NewDeaths === "" ? 0 : localData.NewDeaths;
            client.sendMessage(
              number,
              `
                    *COVID-19 Update!!*
Negara: ${localData.Country}

Kasus aktif: ${localData.ActiveCases}
Total Kasus: ${localData.TotalCases}
*Kasus Baru: ${newCases}*
        
Meninggal: ${localData.TotalDeaths}
*Meninggal Baru: ${newDeaths}*
        
Total Sembuh: ${localData.TotalRecovered}
                    
Dicek pada: ${moment()
                .format("LLLL")
                .replace("pukul", "|")} WIB
Sumber: 
_https://www.worldometers.info/coronavirus/_
                    `
            );
          });
        }
        // Delay 3 Sec
      }, i * 3000);
    }
  });
});