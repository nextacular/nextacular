const html = ({ email }) => {
  return `
<body>
    <p>Hello there!</p>
    <p>You have requested to update your email address to: <strong>${email}</strong></p>
    <p>Login with your new email address to refresh your session.</p>
    <p>In case you need any assistance, just hit reply.</p>
    <p>Cheers,<br />${process.env.EMAIL_FROM}</p>
</body>
`;
};

const text = ({ email }) => {
  return `
Hello there!

You have requested to update your email address to: ${email}

Login with your new email address to refresh your session.

In case you need any assistance, just hit reply.

Cheers,
${process.env.EMAIL_FROM}
`;
};

export { html, text };
