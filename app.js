const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser
const http = require("http")
var email = {
  'date': new Date() / 1000

}
const server = new SMTPServer({
  onData(stream, session, callback) {
    parser(stream, {}, (err, parsed) => {
      const emailAddress = parsed.to.value[0]['address']
      const emailName = parsed.to.value[0]['name']
      console.log(emailAddress);
      const text = JSON.stringify(parsed.textAsHtml || parsed.text || parsed.html, null, 4).replace(/"/ig, '')
      emailPush(emailAddress, text)
      emailPush(emailName, text)
      
      server.on("error", err => {
        // console.log("Error %s", err.message);
      });
    })
    return callback();
  },
  socketTimeout: 15000,
  disabledCommands: ['AUTH']
});

const emailPush = (to, text) => {
  if ((new Date() / 1000 - email['date']) >= 600) {
    email['date'] = new Date() / 1000
    email = {}
  }
  
  if (email[to]) {
    email[to].push(text)
  } else {
    email[to] = []
    email[to].push(text)
  }
 
}
let serverHttp = http.createServer(
  function (req, res) {

    getEmailBody(req.url.slice(1), res)
  }
)
//@gmailchain.asia
const getEmailBody = (data, res) => {
  if (data.length > 0) {
    console.log(email);
    console.log(data);
    let thisEmailData = email[data]&&email[data].reverse()
    let resData = ''
    if (thisEmailData) {
      thisEmailData.forEach(element => {
        resData = resData + element + "\n" + "===--=======---======---===--==--====" + "\n" + "\n"
      });
    }

    //const emda = JSON.stringify(email[data], null, 4) || "[]"
    res.write(resData)
  } else {
    res.write('unKonwn')
  }
  res.end()
}
// 0.0.0.0
// 127.0.0.1
// setTimeout(() => {
//   server.listen(25, "127.0.0.1")
// }, 1000)
// setTimeout(() => {
//   serverHttp.listen(8080, "127.0.0.1")
// }, 1500);

setTimeout(() => {
  server.listen(25, "0.0.0.0")
}, 1000)
setTimeout(() => {
  serverHttp.listen(8080, "0.0.0.0")
}, 1500);
