/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
// import logger from 'logger';

const captureArray = param => {
	if (Array.isArray(param)) {
		return param.map(value => {
			return captureArray(value);
		});
	}
	if (typeof param === 'object') {
		const objKeys = Object.keys(param);
		if (objKeys.length < 1) return param;

		const numKeys = [...Array(objKeys.length).keys()];
		if (objKeys.every((val, index) => +val === numKeys[index])) {
			return Object.values(param).map((value, index) => {
				return captureArray(param[index]);
			});
		}

		Object.keys(param).map(key => {
			// eslint-disable-next-line no-param-reassign
			param[key] = captureArray(param[key]);
		});
	}

	return param;
};

export default async function validateRequest(ctx, next) {
	if (ctx.request.query) {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in ctx.request.query) {
			const match = key.match(/(?<=\[).+?(?=\])/g);
			if (!Array.isArray(match)) continue;

			const varName = key.substr(0, key.indexOf('['));

			if (!varName) continue;

			if (!ctx.request.query[varName]) ctx.request.query[varName] = {};

			let pointer = ctx.request.query[varName];
			for (let index = 0; index < match.length - 1; index += 1) {
				if (!pointer[match[index]]) {
					pointer[match[index]] = {};
				}
				pointer = pointer[match[index]];
			}
			pointer[match[match.length - 1]] = ctx.request.query[key];
			delete ctx.request.query[key];

			ctx.request.query[varName] = captureArray(ctx.request.query[varName]);
			// pointer = ctx.request.query[key];
		}
	}

	await next();
}
