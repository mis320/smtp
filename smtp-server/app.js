const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser
const server = new SMTPServer({
  onData(stream, session, callback) {
    parser(stream, {}, (err, parsed) => {
      if (err)
        console.log("Error:", err)

      console.log(JSON.stringify(parsed.from, null, 4))
      console.log(JSON.stringify(parsed.to, null, 4))
      stream.on("end", () => {

      })
      server.on("error", err => {
        // console.log("Error %s", err.message);
      });
    })
  },
  socketTimeout: 15000,
  disabledCommands: ['AUTH']
});
server.listen(25, "127.0.0.1")