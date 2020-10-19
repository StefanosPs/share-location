import * as Token from './model/token';
import * as UserConnection from './model/user_connection';
import * as Mark from './model/mark';

export default {
	...Token,
	...UserConnection,
	...Mark
};
