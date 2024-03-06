const nodemailer=require('nodemailer');
const { options } = require('../app');



const sendEmail =async(options)=>{
    const transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })

    const mailOptions ={
        from : process.env.SMPT_MAIL,
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    await transporter.sendMail(mailOptions);
}


module.exports=sendEmail;