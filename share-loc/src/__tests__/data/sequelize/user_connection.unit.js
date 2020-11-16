/* eslint-disable no-underscore-dangle */
import { __RewireAPI__ as UserConnectionRewire } from '../../../data/sequelize/model/user_connection';
import { Op } from 'sequelize';
global.__getDictionary = index => {
	return index;
};

describe('initializeWhere', () => {
	it('no args', () => {
		const initializeWhere = UserConnectionRewire.__get__('initializeWhere');

		expect(initializeWhere()).toEqual({});
	});

	it('Make Where', () => {
		const initializeWhere = UserConnectionRewire.__get__('initializeWhere'); // 👈 the secret sauce

		expect(initializeWhere({}, { and: [{ status: { eq: 'PEDDING' } }] })).toEqual({
			[Op.and]: [
				{
					status: {
						[Op.eq]: 'PEDDING'
					}
				}
			]
		});
	});
});
