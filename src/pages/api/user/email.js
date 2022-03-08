import { getSession } from 'next-auth/react';

import { validateUpdateEmail } from '@/config/api-validation/index';
import { html, text } from '@/config/email-templates/email-update';
import { sendMail } from '@/lib/server/mail';
import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await getSession({ req });

    if (session) {
      await validateUpdateEmail(req, res);
      const { email } = req.body;
      await prisma.user.update({
        data: {
          email,
          emailVerified: null,
        },
        where: { id: session.user.userId },
      });
      await sendMail({
        html: html({ email }),
        subject: `[Nextacular] Email address updated`,
        text: text({ email }),
        to: [email, session.user.email],
      });
      res.status(200).json({ data: { email } });
    } else {
      res
        .status(401)
        .json({ errors: { error: { msg: 'Unauthorized access' } } });
    }
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
