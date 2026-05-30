import { TeamRole } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { validateSession } from '@/config/api-validation';
import { getMember, toggleRole } from '@/prisma/services/membership';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'PUT') {
    await validateSession(req, res);
    const { memberId } = req.body as { memberId: string };
    // NOTE: this awaits getMember so the role toggle reads the real value.
    // Prior JS code was missing the await and silently demoted every target.
    // Full authorization fix (workspace-ownership check) lives on the
    // security/v1.4.2 branch; this file only carries the minimal change
    // required for TypeScript compilation.
    const member = await getMember(memberId);
    const nextRole =
      member?.teamRole === TeamRole.MEMBER ? TeamRole.OWNER : TeamRole.MEMBER;
    await toggleRole(memberId, nextRole);
    res.status(200).json({ data: { updatedAt: new Date() } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
