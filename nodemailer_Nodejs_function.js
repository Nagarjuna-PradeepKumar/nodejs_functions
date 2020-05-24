const nodemailer=require('nodemailer')
const dotenv= require('dotenv')
dotenv.config();

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.googlemailid,
        clientId: process.env.googlemailclientid,
        clientSecret: process.env.googlemailclientsecret,
        refreshToken: process.env.googlemailrefreshtoken,
    }
  });

async function sendthemail(receiver,subject,textmessage){
  report=transporter.sendMail({
    from:process.env.googlemailid,
    to: receiver,
    subject: subject,
    text: textmessage}
  ).then((ok) => {
    return 'sent';
}).catch((error) => {return'error'})
}

module.exports.sendthemail=sendthemail
