import Router from 'koa-router';
import authCheck from '../middleware/authCheck';

import auth from './jwt';
import structure from './structure';

import connection from './connection';
import mark from './mark';
import user from './user';

const router = Router();

router.use(['/jwt/logout', '/api/*', '/structure/*'], authCheck);

router.use('/jwt', auth.routes(), auth.allowedMethods());
router.use('/api/', user.routes(), user.allowedMethods());
router.use('/api/', connection.routes(), connection.allowedMethods());
router.use('/api/', mark.routes(), mark.allowedMethods());
router.use('/', structure.routes(), structure.allowedMethods());

export default router;
