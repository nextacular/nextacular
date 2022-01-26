import { validationResult } from 'express-validator';

const validateMiddleware = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const errorObject = {};
    errors.array().forEach((error) => (errorObject[error.param] = error));
    res.status(422).json({ errors: errorObject });
  };
};

export default validateMiddleware;
