const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser
const http = require("http")
var email = {
  'date': new Date() / 1000
}
const server = new SMTPServer({
  onData(stream, session, callback) {
    parser(stream, {}, (err, parsed) => {

      try {
        console.log(parsed.to.value);
        const emailAddress = parsed.to.value[0]['address']
        const emailName = parsed.to.value[0]['name']
        console.log(emailAddress);
        const text = JSON.stringify(parsed.textAsHtml || parsed.text || parsed.html, null, 4).replace(/"/ig, '')
        emailPush(emailAddress, text)
        if (emailName.length >= 1) {
          emailPush(emailName, text)
        }
      } catch (error) {
        console.log("error", new String(error));
      }
      server.on("error", err => {
        // console.log("Error %s", err.message);
      });
    })
    return callback();
  },
  socketTimeout: 15000,
  disabledCommands: ['AUTH']
});

const clear = () => {
  if ((new Date() / 1000 - email['date']) >= 600) {
    email['date'] = new Date() / 1000
    email = {}
  }
}
const emailPush = (to, text) => {
  clear()
  email[to] = text
}
let serverHttp = http.createServer(
  function (req, res) {

    if (req.url.slice(1)=="ip") {
      let ip =getClientIp(req)
      console.log(ip);
      res.write(ip)
      res.end()
    }else{
      getEmailBody(req.url.slice(1), res)
    }
    
  }
)
//@gmailchain.asia
const getEmailBody = (data, res) => {


  if (data.length > 0) {
    console.log(email);
    console.log(data);
    let wdata = email[data] || ""


    
    res.write(wdata)
  } else {
    res.write('unKonwn')
  }
  res.end()
}
function getClientIp(req) {
  let ip = ""
  try {
      ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
          req.connection.remoteAddress || // 判断 connection 的远程 IP
          req.socket.remoteAddress || // 判断后端的 socket 的 IP
          req.connection.socket.remoteAddress;
  } catch (error) {

  }
  return ip
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
