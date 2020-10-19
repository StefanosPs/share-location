import Router from 'koa-router';
import user from './user';

import authorizationCheck from '../middleware/authCheck';
import passwordCheck from './password-check';

const router = Router();

/**
 * @api {post} /api/password-check Validate Login data
 * @apiDescription ...
 * @apiVersion 1.0.0
 * @apiName Validate User
 * @apiGroup General
 *
 * @apiParam  {String} username The username
 * @apiParam  {String{5..15}} password The password
 *
 * @apiExample {curl} Example usage:
 *      curl -i -X POST --header "Content-Type: application/json" -d '{"username": "test", "password": "t3$T1101"}' http://127.0.0.1:3000/api/user/password-check
 */

router.use('/api/', authorizationCheck);
router.post('user.passwordCheck', '/api/password-check', passwordCheck);

router.use('/api/', user.routes(), user.allowedMethods());

export default router;
