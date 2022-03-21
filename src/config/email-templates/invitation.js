const html = ({ code, name }) => {
  const link = `${process.env.APP_URL}/teams/invite?code=${encodeURI(code)}`;

  return `
<body>
    <p>Hello there!</p>
    <p>You have been invited to join <strong>${name}</strong> workspace.</p>
    <p>Workspaces encapsulates your project's activities with your dedicated teammates.</p>
    <p>Login into your account or you may open this link: <a href="${link}">${link}</a></p>
    <p>In case you need any assistance, just hit reply.</p>
    <p>Cheers,<br />${process.env.EMAIL_FROM}</p>
</body>
`;
};

const text = ({ code, name }) => {
  const link = `${process.env.APP_URL}/teams/invite?code=${encodeURI(code)}`;

  return `
Hello there!

You have been invited to join ${name} workspace.
Workspaces encapsulates your project's activities with your dedicated teammates.

Login into your account or you may open this link: ${link}

In case you need any assistance, just hit reply.

Cheers,
${process.env.EMAIL_FROM}
`;
};

export { html, text };
