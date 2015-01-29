var secrets = require('../../config/secrets');
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'Mandrill',
  auth: {
    user: secrets.mandrill.user,
    pass: secrets.mandrill.password
  }
});

module.exports.sendEmail = function(to, subject, body, callback){
  transporter.sendMail({
    from: "no-reply@__APP_NAME_LOWER_CASED__.com",
    to: to,
    subject: subject,
    html: body
  }, function(error, response){
    if(error){
      console.log(error);
      callback(error, response);
    }else if (typeof callback == 'function'){
      callback(null, response);
    }
  });
};
