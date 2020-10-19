import Router from 'koa-router';

import getListStructure from './list';
import getTableStructure from './table';

const router = Router({
	prefix: 'structure/'
});
// const router = Router();

router.get('structure.list', 'list/:table', getListStructure);
router.get('structure.table', 'table/:table', getTableStructure);

export default router;
