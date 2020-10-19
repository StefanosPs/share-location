import jwt from 'jsonwebtoken';

import passport from 'koa-passport';
import session from 'koa-session';
import passportLocal from 'passport-local';
import Boom from '@hapi/boom';

import * as usersModel from 'data/proxy/user';
import {findTokenByID, createToken, deleteToken} from 'data/sequelize/model/token';

const LocalStrategy = passportLocal.Strategy;

const APP_COOKIES_NAME = process.env.APP_COOKIES_NAME || 'abc';
const APP_SECRET = process.env.APP_SECRET || 'secret1101';
const APP_JWT_EXPIRATION = process.env.APP_JWT_EXPIRATION
	? process.env.APP_JWT_EXPIRATION * 60 * 1000
	: 60 * 60 * 1000;

const coockieOptions = {
	path: '/',
	overwrite: true,
	secure: false,
	httpOnly: true,
	SameSite: 'strict'
};

const subscriberCoockie = (ctx, id) => {
	const tokenExpires = new Date(new Date().getTime() + APP_JWT_EXPIRATION);
	ctx.cookies.set(APP_COOKIES_NAME, id, {
		...coockieOptions,
		expires: tokenExpires
	});
};

const checkValidToken = jwtPayload => {
	if (
		!(jwtPayload.expiration - APP_JWT_EXPIRATION < Date.now() && jwtPayload.expiration > Date.now())
	) {
		throw new Error('Your Current Session Has Been Expired');
	}
};

const strategy = new LocalStrategy(async (username, password, done) => {
	try {
		const check = await usersModel.userPasswordCheck({username, password});
		if (check.statusCode === 200) {
			return done(null, {
				user: {
					id: check.data[0].username,
					key: check.data[0].id,
					username: check.data[0].username,
					role: check.data[0].username,
					fullName: check.data[0].fullName
				}
			});
		}
		return done(new Error(check.message));
	} catch (e) {
		return done(e);
	}
});

passport.use(strategy);

passport.serializeUser((user, done) => {
	try {
		return done(null, user);
	} catch (e) {
		return done(e);
	}
});

passport.deserializeUser(async (username, done) => {
	try {
		const user = await usersModel.find(username);
		return done(null, user);
	} catch (e) {
		return done(e);
	}
});

export function initPassport(app) {
	app.use(session({}, app));

	app.use(passport.initialize());
	app.use(passport.session());
}

export async function ensureAuthenticated(token) {
	if (!token) throw new Error('No token');
	const [, tokenStr] = token.split(' ');

	let jwtPayload;
	try {
		jwtPayload = await jwt.verify(tokenStr, APP_SECRET);
	} catch (err) {
		throw Error(err);
	}
	checkValidToken(jwtPayload);
	return jwtPayload;
}
export async function ensureAuthenticatedHttp(ctx) {
	if (!ctx.headers.authorization) throw new Error('No token');
	const token = ctx.headers.authorization;

	ctx.request.jwtPayload = await ensureAuthenticated(token);
}

export const localAuthHandler = (ctx, next) => {
	return passport.authenticate('local', async (err, user, info) => {
		if (!user) {
			if (err && !info) {
				if (err.status) {
					throw Boom.boomify(err, {
						statusCode: err.status
					});
				}
				throw Boom.serverUnavailable(err.message);
			}

			let msg = '';
			if (info && info.message) msg = info.message;
			throw Boom.badData(msg);
		} else {
			try {
				const payload = {...user, expiration: Date.now() + APP_JWT_EXPIRATION};
				const secret = APP_SECRET;
				const token = jwt.sign(payload, secret, {
					expiresIn: APP_JWT_EXPIRATION
				});
				// console.log(user);
				const dbToken = await createToken({token, userId: user.user.key});
				subscriberCoockie(ctx, dbToken.id);

				ctx.body = {
					statusCode: 200,
					message: 'Login OK',
					data: [{token, tokenExpiry: APP_JWT_EXPIRATION}]
				};
			} catch (e) {
				throw Boom.badImplementation(e.message);
			}
		}
	})(ctx, next);
};

export const authRefresh = async ctx => {
	const refreshTokenId = ctx.cookies.get(APP_COOKIES_NAME, {
		signed: true
	});
	// console.log('refreshTokenId', refreshTokenId);
	const dbToken = await findTokenByID(refreshTokenId);
	if (!dbToken || !dbToken.id || dbToken.error) {
		throw Boom.badRequest(`The refresh token is not valid`);
	}

	let jwtPayload;
	try {
		// console.log(dbToken);
		jwtPayload = await jwt.verify(dbToken.token, APP_SECRET);
	} catch (err) {
		throw Error(err);
	}
	checkValidToken(jwtPayload);

	const result = await usersModel.getUser({id: dbToken.userId});

	if (!result || result.statusCode !== 200) {
		throw Error('User not found');
	}
	const user = result.data[0];
	if (user.username !== jwtPayload.user.id) {
		throw new Error('Wrong user');
	}

	try {
		const userObj = {user: jwtPayload.user};
		const payload = {...userObj, expiration: Date.now() + APP_JWT_EXPIRATION};
		const secret = APP_SECRET;
		const token = jwt.sign(payload, secret, {
			expiresIn: APP_JWT_EXPIRATION
		});
		await deleteToken(dbToken.id);
		const newDbToken = await createToken({token, userId: jwtPayload.user.key});
		subscriberCoockie(ctx, newDbToken.id);

		ctx.body = {
			statusCode: 200,
			message: 'Refresh ok',
			data: [{token, tokenExpiry: APP_JWT_EXPIRATION}]
		};
	} catch (e) {
		throw Boom.badImplementation(e.message);
	}
};

export const authDestroy = async ctx => {
	const refreshTokenId = ctx.cookies.get(APP_COOKIES_NAME, {
		signed: true
	});

	try {
		deleteToken(refreshTokenId);
		await ctx.logout();
		ctx.body = {
			statusCode: 200,
			message: 'Logout OK',
			data: []
		};
	} catch (error) {
		console.error(error);
	}
};
