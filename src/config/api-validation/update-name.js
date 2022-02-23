import { check } from 'express-validator';
import initMiddleware from '@/lib/server/init-middleware';
import validate from '@/lib/server/validate';

const rules = [
  check('name')
    .isLength({ min: 1, max: 32 })
    .withMessage('Name must be provided and must not exceed 32 characters'),
];

const validateUpdateName = initMiddleware(validate(rules));

export default validateUpdateName;
