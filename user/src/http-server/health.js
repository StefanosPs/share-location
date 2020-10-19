import Router from 'koa-router';

const router = Router();

router.get('/health', async ctx => {
	ctx.body = 'OK';
});

export default router;
