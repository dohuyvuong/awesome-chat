import nodeMailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { transMail } from "../../lang/vi";

let adminName = process.env.MAIL_USER_NAME;
let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;

/**
 *
 * @param {String} mailTo Recipient Email
 * @param {Object} data Account Info
 */
let sendAccountActivationMail = (mailTo, data) => {
  let transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });

  let template = fs.readFileSync(
    path.join(__dirname + "/../template/email_active_template.html"),
    { encoding: "utf8" }
  );
  let htmlContent = ejs.render(template, data);

  let options = {
    from: `"${adminName}" <${adminEmail}>`,
    to: mailTo,
    subject: transMail.mail_active_registration_subject,
    html: htmlContent,
  };

  return transporter.sendMail(options);
};

export default {
  sendAccountActivationMail,
};
