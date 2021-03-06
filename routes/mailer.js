var nodemailer = require('nodemailer');
var Person = require('../models/Person.js');
var _ = require('lodash');

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: 'Mandrill',
  auth: {
    user: 'skorlir@gmail.com',
    pass: 'BIT8tELthNj7CAObeJ_M4Q'
  }
});

var template = "<p>Hi ###,<br><p>Some of you received emails containing the wrong link for logging in to your personal portal account; that was due to a bad line of code in the email generator. <br><p> The problem is now corrected. Please find below a fixed version of the email you received earlier, with a correct link. <br><p>Feel free to contact this email address with a direct reply if you have any additional problems. Apologies for any inconvenience.<br><p>====================================================<br><p> Thank you for registering for and attending Northwestern's first-ever Startup Career Fair. Startups unanimously praised the amount of talent and diversity of background in attendance at the fair. <br><p>In order for startups to get in touch with you, please take 20 seconds to upload your resume to the \"talent portal\" our team has created. Even if you already registered before the fair we ask that you re-upload your resume because startups will only have access to the talent portal.<br><p>You can upload your resume in 3 easy steps: <br><p>1) Follow this link: http://epic-talent-portal.herokuapp.com/register?id=reallylong# and set a password<br><p>2) Click the 'upload resume' button and upload your resume.<br><p>3) You should now be able to see your resume by clicking on its filename. Click 'save changes,' and you're done.<br><br><p>If you have any questions, please email contact@nuisepic.com. <br><p>Thanks!<p>The EPIC Team";

function mailAll(contacts) {
  contacts.forEach(function(contact) {
    var to = contact.email;
    var html = template.split('reallylong#').join(contact._id.toString());
    html = html.split('###').join(contact.name.replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase() }));
    var newmsg = {to: to, from: 'The EPIC Team <contact@nuisepic.com', subject: "FIXED: ACTION REQUIRED : Upload your resume for startups ", html: html};
    setTimeout(function() {
      smtpTransport.sendMail(newmsg, function(error, resp) {
        if(error) console.log(error);
        else console.log("Message successfully sent to " + to);
      });
    }, 1000);
  });
}

module.exports = function() {
  
  Person.find().exec(function(err, batch) {
    if(err) console.log(err);
    else mailAll(batch);
  });
  
}
