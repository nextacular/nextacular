import initMiddleware from '@/lib/server/init-middleware';
import validate from '@/lib/server/session-check';

const validateSession = initMiddleware(validate());

export default validateSession;
