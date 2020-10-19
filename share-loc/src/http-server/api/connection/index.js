import Router from 'koa-router';
import create from './create';
import get, {gerValidObserver} from './get';
import put from './put';
import deleteConnection from './delete';

const router = Router();

router.post('connections.create', 'connections', create);
router.post('connections.usercreate', 'user/:watcherUserId/connections', create);

router.get('connections.get', 'connections', get);
router.get('connections.getid', 'connections/:id', get);
router.get('connections.getvalidobserver', 'connections/valid/observer', gerValidObserver);

router.get('connections.userget', 'user/:watcherUserId/connections', get);
router.get('connections.usergetid', 'user/:watcherUserId/connections/:id', get);

router.put('connections.put', 'connections/:id', put);
router.put('connections.userput', 'user/:watcherUserId/connections/:id', put);

router.delete('connections.delete', 'connections/:id', deleteConnection);
router.delete('connections.userdelete', 'user/:watcherUserId/connections/:id', deleteConnection);

export default router;
