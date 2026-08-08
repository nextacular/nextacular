import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const host = process.env.EMAIL_SERVER_HOST;
const port = process.env.EMAIL_SERVER_PORT
  ? Number(process.env.EMAIL_SERVER_PORT)
  : undefined;

if (port !== undefined && !Number.isInteger(port)) {
  throw new Error(
    `EMAIL_SERVER_PORT must be an integer, received "${process.env.EMAIL_SERVER_PORT}"`
  );
}

// `secure` means "open the connection with TLS immediately", which is only
// correct for implicit-TLS ports (465). Everything else — 587, 25, Mailpit's
// 1025 — starts in plaintext and upgrades via STARTTLS.
const secure = process.env.EMAIL_SERVER_SECURE
  ? process.env.EMAIL_SERVER_SECURE === 'true'
  : port === 465;

/**
 * A raw `host` wins over `service`. Nodemailer's `service` shorthand only
 * resolves names from its built-in well-known list, so providers outside that
 * list (and the local Mailpit container) need an explicit host/port.
 */
export const emailConfig: SMTPTransport.Options = {
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  ...(host ? { host, port, secure } : { service: process.env.EMAIL_SERVICE }),
};

const transporter = nodemailer.createTransport(emailConfig);

export type SendMailInput = {
  from?: string;
  html: string;
  subject: string;
  text: string;
  to: string | string[];
};

export const sendMail = async ({
  from,
  html,
  subject,
  text,
  to,
}: SendMailInput): Promise<void> => {
  const data = {
    from: from ?? process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  if (process.env.NODE_ENV === 'production') {
    await transporter.sendMail(data);
  } else {
    // eslint-disable-next-line no-console
    console.log(data);
  }
};

export default transporter;
