import initializeGetOrder from '../../../domain/user/initializeGetOrder';

describe('user/initializeGetOrder.js', () => {
	test('empty arguments', async () => {
		expect(initializeGetOrder()).toEqual(expect.arrayContaining([]));
		expect(initializeGetOrder('id')).toEqual(expect.arrayContaining([]));
		expect(initializeGetOrder('', 'DESC')).toEqual(expect.arrayContaining([]));
		expect(initializeGetOrder('', '')).toEqual(expect.arrayContaining([]));
	});
});
