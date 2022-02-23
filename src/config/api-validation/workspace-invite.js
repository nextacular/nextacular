import { TeamRole } from '@prisma/client';
import { check } from 'express-validator';
import initMiddleware from '@/lib/server/init-middleware';
import validate from '@/lib/server/validate';

const rules = [
  check('members')
    .isArray()
    .withMessage('Members data must be a list of emails and roles'),
  check('members.*.email').isEmail().withMessage('Email must be valid'),
  check('members.*.role')
    .isIn([TeamRole.MEMBER, TeamRole.OWNER])
    .withMessage('Rule must either be MEMBER or OWNER'),
];

const validateWorkspaceInvite = initMiddleware(validate(rules));

export default validateWorkspaceInvite;
