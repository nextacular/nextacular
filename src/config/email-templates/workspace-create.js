const html = ({ code, name }) => {
  const link = `${process.env.NEXT_PUBLIC_URL}/teams/invite?code=${encodeURI(
    code
  )}`;

  return `
<body>
    <p>Hello there!</p>
    <p>You have created <strong>${name}</strong> workspace.</p>
    <p>Workspaces encapsulates your project's activities with your dedicated teammates.</p>
    <p>Start inviting your teammates by sharing this link: <a href="${link}">${link}</a></p>
    <p>In case you need any assistance, just hit reply.</p>
    <p>Cheers,<br />${process.env.EMAIL_FROM}</p>
</body>
`;
};

const text = ({ code, name }) => {
  const link = `${process.env.NEXT_PUBLIC_URL}/teams/invite?code=${encodeURI(
    code
  )}`;

  return `
Hello there!

You have created ${name} workspace.
Workspaces encapsulates your project's activities with your dedicated teammates.

Start inviting your teammates by sharing this link: ${link}

In case you need any assistance, just hit reply.

Cheers,
${process.env.EMAIL_FROM}
`;
};

export { html, text };
