import Router from 'koa-router';

const router = Router();

router.get('/health', async ctx => {
	// const {response} = ctx;
	// response.status = 200;
	// response.body = 'OK';
	const isLoggedIn = ctx.headers.authorization;
	// HTTP/1.1 101 Switching Protocols
	// ctx.status=101;
	ctx.body = {
		ok: 'ok',
		isLoggedIn
	};
});

export default router;
