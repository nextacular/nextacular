import { check } from 'express-validator';
import initMiddleware from '@/lib/server/init-middleware';
import validate from '@/lib/server/validate';

const rules = [
  check('slug')
    .isLength({ min: 1, max: 16 })
    .withMessage('Slug must be provided and must not exceed 16 characters')
    .isSlug()
    .isAlphanumeric(undefined, { ignore: '-' })
    .withMessage('Hyphenated alphanumeric characters only'),
];

const validateUpdateWorkspaceSlug = initMiddleware(validate(rules));

export default validateUpdateWorkspaceSlug;
