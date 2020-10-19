import validatePassword from '../../../domain/user/validatePassword';

global.__getDictionary = index => {
	return index;
};

describe('user/validatePassword', () => {
	// test('user/validatePassword.js', function() {
	test('Can not be empty', () => {
		expect(validatePassword()).toEqual(expect.arrayContaining(['__ERROR_EMPTY_PASSWORD__']));
		expect(validatePassword('')).toEqual(expect.arrayContaining(['__ERROR_EMPTY_PASSWORD__']));
	});
	test('Length', () => {
		expect(validatePassword('ss2')).toEqual(expect.arrayContaining(['__ERROR_PASSWORD_LENGTH__']));
		expect(validatePassword('01234567890123456')).toEqual(
			expect.arrayContaining(['__ERROR_PASSWORD_LENGTH__'])
		);
	});
	test('Contains at least one num or char', () => {
		expect(validatePassword('abcde')).toEqual(
			expect.arrayContaining(['__ERROR_PASSWORD_CONTAINS_NUM__'])
		);
		expect(validatePassword('12345')).toEqual(
			expect.arrayContaining(['__ERROR_PASSWORD_CONTAINS_CHAR__'])
		);
	});
	test('Accepts balid password', () => {
		expect(validatePassword('aBc45')).toEqual(expect.arrayContaining([]));
	});
});
