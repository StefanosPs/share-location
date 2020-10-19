import Router from 'koa-router';
import create from './create';
import get from './get';

const router = Router();

router.post('connections.create', 'mark', create);
// router.post('connections.usercreate', 'user/:watcherUserId/connections', create);

router.get('connections.get', 'mark', get);
router.get('connections.getid', 'mark/:id', get);

// router.get('connections.userget', 'user/:watcherUserId/connections', get);
// router.get('connections.usergetid', 'user/:watcherUserId/connections/:id', get);

// router.put('connections.put', 'connections/:id', put);
// router.put('connections.userput', 'user/:watcherUserId/connections/:id', put);

// router.delete('connections.delete', 'connections/:id', deleteConnection);
// router.delete('connections.userdelete', 'user/:watcherUserId/connections/:id', deleteConnection);

export default router;
