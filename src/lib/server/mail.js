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
  const data = {
    from: from ?? process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  process.env.NODE_ENV === 'production'
    ? await transporter.sendMail(data)
    : console.log(data);
};

export default transporter;
