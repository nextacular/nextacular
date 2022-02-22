import { TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';

import { validateUpdateWorkspaceSlug } from '../../../../../config/api-validation';
import prisma from '../../../../../../prisma';
import api from '../../../../../lib/common/api';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await getSession({ req });

    if (session) {
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
