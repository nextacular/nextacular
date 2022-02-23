import { check } from 'express-validator';
import initMiddleware from '@/lib/server/init-middleware';
import validate from '@/lib/server/validate';

const rules = [
  check('domainName')
    .isFQDN()
    .withMessage('Domain name must be a fully qualified domain name'),
];

const validateAddDomain = initMiddleware(validate(rules));

export default validateAddDomain;
