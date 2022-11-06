const SMTPConnection = require("nodemailer/lib/smtp-connection");
//引入module
const nodemailer = require("nodemailer");
//发送邮件
async function sendMail(){
	//html 页面内容
	const html = '<h1>查看html邮件哦</h1>';
	console.log(html);
	let transporter = nodemailer.createTransport({
	    host: "127.0.0.1",
	    port: 25,
        ignoreTLS:true
	 });
	let mailOptions = {
			from: '<1223@127.0.0.1:25>', // sender address
		    to: "<12213@127.0.0.1:25>",
            text: "Hello world?", // plain text body
		    subject: "一封邮件", // Subject line
		    html: html // html body
	};

	transporter.sendMail(mailOptions);

	setTimeout(()=>{
		transporter.close()
	},5000)
	
}

sendMail()
// for (let index = 0; index < 100; index++) {
// 	sendMail()
// }