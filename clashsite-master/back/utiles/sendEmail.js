const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, html }) => {
  if (!email) {
    throw new Error("Recipient email is required");
  }

  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT) || 465;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const secure = (process.env.EMAIL_SECURE || "true").toLowerCase() === "true";

  if (!host || !user || !pass) {
    console.warn(
      "Email transport not configured. Skipping email send for",
      subject
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: `"clashvip" <${user}>`,
    to: email,
    subject,
    html,
  });

  return true;
};

module.exports = sendEmail;
