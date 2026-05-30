import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';

import initMiddleware from '@/lib/server/init-middleware';
import validate from '@/lib/server/session-check';

const validate_ = initMiddleware(validate());

const validateSession = (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session> => validate_(req, res) as Promise<Session>;

export default validateSession;
