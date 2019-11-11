const Nexmo = require('nexmo');
const nodemailer = require('nodemailer');
var secret = require('./config/secrets')

const nexmo = new Nexmo({
    apiKey: secret.apiKey,
    apiSecret: secret.apiSecret
});

module.exports = {
	sendSMS: function(userName, phone){  
	return (req, res, next) => {
        nexmo.message.sendSms('Nexmo', '40732151293', 'Hello Trainer,'+ userName + ' just requested for you to train him. You can try and contact him and see what is all about. Here is his phone number: ' + userPhone, (err, response) =>{
            if(err){
                console.log(err);
            } else {
                if(response.messages[0]['status'] === '0') {
                    console.log("Message was sent");
                } else{
                    console.log(`Message failed with error: ${response.messages[0]['error-text']}`)
                }
            }
        })
    }
},

  	sendTrainerMail: function(trainer, user){
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 587,
            secure: false,
            auth: {
              user: 'chirciu_iulian@yahoo.com',
              pass: secret.pass
            }
          });
              let info = transporter.sendMail({
                from: 'chirciu_iulian@yahoo.com',
                to: trainer.email,
                subject: 'Someone requested to be a part of your trainee team',
                text: "Hello Trainer, Someone just subscribed to you. He wants you to train him . Here is his phone no so you can contact him ",
                html: "<b> Hello " + trainer.Name + " </b> <br> <b> &nbsp; &nbsp; " + "<font size='3' color='red'>" + user.Name + "</font>" + " "+ "<font size='3' color='red'>"  + user.Surname + "</font>"+  " has just subscribed to your services. You can contact him on his e-mail:  "+ "<font size='3' color='red'>" + user.email + "</font>" +"</b>"
        });
        console.log("Message sent: %s", info.messageId);
    },

    sendContactMail: function(user, subject, message){
            let transporter = nodemailer.createTransport({
                host: 'smtp.mail.yahoo.com',
                port: 587,
                secure: false,
                auth: {
                  user: 'chirciu_iulian@yahoo.com',
                  pass: secret.pass
                }
              });
                  let info = transporter.sendMail({
                    from: 'chirciu_iulian@yahoo.com',
                    to: "fitit.contact100@gmail.com",
                    subject: subject,
                    text: "The text message will not be sent as there is an HTML version of the email ",
                    html: "<b>" + message + "</b>" + "<br>" + "<br>" + "<b> This mail has been sent by " + "<font size='3' color='red'>" + user.username + "</font>" + " , and his email is " + "<font size='3' color='red'>" + user.email + "</font>"+ " </b>"
            });
            console.log("Message sent: %s", info.messageId);
    },

    sendPasswordMail: function(user, newPass){
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 587,
            secure: false,
            auth: {
              user: 'chirciu_iulian@yahoo.com',
              pass: secret.pass
            }
          });
              let info = transporter.sendMail({
                from: 'chirciu_iulian@yahoo.com',
                to: user.email,
                subject: "Password Changed",
                text: "The text message will not be sent as there is an HTML version of the email ",
                html: "<b> Hello" + user.username +"</b>" + "<br>" + "<br>" + "<b> Your new password is now " + "<font size='3' color='red'>" + newPass + "</font>"
        });
        console.log("Message sent: %s", info.messageId);
}
}