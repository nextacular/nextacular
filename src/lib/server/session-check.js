import { getSession } from 'next-auth/react';

const validateMiddleware = () => {
  return async (req, res, next) => {
    const session = await getSession({ req });
    const errors = [];

    if (!session) {
      errors.push({ param: 'session', msg: 'Unauthorized access' });
    } else {
      return next(session);
    }

    const errorObject = {};
    errors.forEach((error) => (errorObject[error.param] = error));
    res.status(401).json({ errors: errorObject });
  };
};

export default validateMiddleware;
