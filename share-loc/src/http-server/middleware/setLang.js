import logger from 'logger';
import {initDictionary, acceptsLanguages} from '../../i18n';

export default async function setLang(ctx, next) {
	const lang = ctx.path.substring(1, 3);
	const validLangs = acceptsLanguages();

	if (ctx.query.lang === 'en') {
		logger.info(`Set active ctx.lang ${ctx.query.lang}`);
		global.__getDictionary = initDictionary(ctx.query.lang);
	} else if (validLangs.includes(lang)) {
		logger.info(`Set active lang=${lang}`);
		global.__getDictionary = initDictionary('en');
		ctx.path = ctx.path.substring(3);
	} else {
		logger.info(`Set default active lang`);
		global.__getDictionary = initDictionary('en');
	}

	ctx.acceptsLanguages(validLangs);

	await next();
}
