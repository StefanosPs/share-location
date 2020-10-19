import auth from 'koa-basic-auth';

const userName = process.env.BASIC_AUTH_USERNAME || 'usersrv';
const password = process.env.BASIC_AUTH_PASSWORD || 'basic-auth-password';

// export default async function authorizationCheck(ctx, next) {
//   return auth({name: userName, pass: password});
// }
const authorizationCheck = auth({name: userName, pass: password});
export default authorizationCheck;
