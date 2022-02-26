import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: true,
});

export const sendMail = async ({ from, html, subject, text, to }) => {
  await transporter.sendMail({
    from: from ?? process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

export default transporter;
