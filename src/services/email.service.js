const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const config = require("../config/config"); 
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const transport = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass,
  },
  secure: config.email.smtp.secure,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
});

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const sendEmailWithRetry = async (mailOptions, retryCount = 3) => {
  try {
    await transport.sendMail(mailOptions);
    logger.info(`Email sent to ${mailOptions.to}`); // ✅ FIXED
  } catch (error) {
    if (retryCount > 0) {
      logger.warn(`Failed to send email, retrying... (${retryCount} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return sendEmailWithRetry(mailOptions, retryCount - 1);
    } else {
      logger.error(`Failed to send email after retries: ${error.message}`);
      throw error;
    }
  }
};

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  try {
    await sendEmailWithRetry(msg);
  } catch (error) {
    console.error(`Failed to send email to ${to}: ${error.message}`);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Email sending failed");
  }
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`; // ✅ FIXED
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (to, token, name) => {
  const subject = "Email Verification";
  const logoUrl = "https://storage.googleapis.com/yachan_avatars_asset/yachan.png";
  const templatePath = path.join(__dirname, "../email/verificationEmailTemplate.ejs");
  const html = await ejs.renderFile(templatePath, {
    name,
    token,
    logoUrl,
  });

  const mailOptions = {
    from: config.email.from,
    to,
    bcc: ["webadmin@thepuja.co"],
    subject,
    html,
  };

  await sendEmailWithRetry(mailOptions);
};

const sendPasswordChangeNotificationEmail = async (to, name) => {
  const subject = "Password Changed Notification";
  const logoUrl = "https://storage.googleapis.com/yachan_avatars_asset/yachan.png";
  const templatePath = path.join(__dirname, "../email/passwordChangedTemplate.ejs");
  const html = await ejs.renderFile(templatePath, {
    name,
    logoUrl,
  });

  const mailOptions = {
    from: config.email.from,
    to,
    bcc: ["webadmin@thepuja.co"],
    subject,
    html,
  };

  await sendEmailWithRetry(mailOptions);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendPasswordChangeNotificationEmail,
};
