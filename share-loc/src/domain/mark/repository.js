// import logger from '../../logger';
import Mark from './mark';
import MarkError from './error';

/**
 * Return the sanitized Mark
 * @param {object} param0
 * @param {number} param0.userId
 * @param {object} param0.position
 * @returns {Mark}
 */
function sanitizedMark({userId, position}) {
	return new Mark({
		userId: parseInt(userId, 10),
		position
	});
}

/**
 * Get the number of the Marks
 *
 * @throws {Error}
 *
 * @param {number} userId - The userId
 * @returns {number}
 */
export async function countMark(userId) {
	if (!(this && this.countMark)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}

	const cnt = await this.countMark(userId);
	return cnt;
}

/**
 * Create a Mark
 *
 * @throws {Error}
 * @throws {MarkError}
 *
 * @param {Mark} mark
 * @returns {(Mark|undefined)}
 */
export async function createUpdateMark(mark) {
	if (!(this && this.createUpdateMark)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}
	if (!mark.userId) {
		throw new MarkError(
			this,
			422,
			[{field: 'userId', message: global.__getDictionary('__ERROR_USER_ID__')}],
			`createUpdateMark:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
		);
	}
	if (mark instanceof Mark) {
		const resMark = await this.createUpdateMark(mark.userId, mark.position);
		return resMark ? sanitizedMark(resMark) : undefined;
	}

	throw new MarkError(
		this,
		422,
		[],
		`createUpdateMark:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
	);
}

export async function getMark(userId, params = {}) {
	if (!(this && this.getMark)) {
		throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
	}
	const markArray = await this.getMark(userId, params);
	return markArray ? markArray.map(el => sanitizedMark(el)) : undefined;
}

// export async function getConnectionWatcher(watcherUserId, params = {}) {
//   if (!this.getConnectionWatcher) {
//     throw new Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'));
//   }
//   if (!watcherUserId) {
//     throw MarkError('Empty watcherUserId');
//   }

//   const users = await this.getConnectionWatcher(watcherUserId, params);
//   return users ? users.map(el => el.observeUserId) : undefined;
// }

// // export async function deleteMark(id) {
// //   if (!this.deleteMark) {
// //     logger.error('Bind failed');
// //     throw new MarkError(null, 500, [], 'Bind failed');
// //   }

// //   if (!id) {
// //     logger.error('Empty ID');
// //     throw new MarkError(null, 500, [], 'Empty ID');
// //   }

// //   return this.deleteMark(id);
// // }
// export async function getUsers(params = {}) {
//   if (!this.getUser) {
//     logger.error('Bind failed');
//     throw new MarkError(null, 500, [], 'Bind failed');
//   }

//   const resp = await this.getUser(params);

//   if (resp && resp.statusCode === 200) {
//     return resp.data.map(el => sanitizedUser(el));
//   }
//   return [];
// }
