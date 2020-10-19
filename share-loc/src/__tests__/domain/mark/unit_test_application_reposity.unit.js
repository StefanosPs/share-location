/* eslint no-await-in-loop: "error" */
import {countMark, createUpdateMark, getMark} from '../../../domain/mark/repository';

// process.env.SEQUELIZE_CONNECT = global.SEQUELIZE_CONNECT;
import Mark from '../../../domain/mark/mark';
import MarkError from '../../../domain/mark/error';

import DBSequelize from '../../../data/sequelize';
import DBProxy from '../../../data/proxy';

const DB = {...DBSequelize, ...DBProxy};
// console.log(DB);

global.__getDictionary = index => {
	return index;
};

const markAr = [];
describe('mark/repository.js', () => {
	beforeAll(async () => {
		try {
			const marks = await DB.getMark();
			const results = [];
			for (let index = 0; index < marks.length; index += 1) {
				const el = marks[index];
				results.push(DB.deleteMark(el.userId));
			}
			await Promise.all(results);

			markAr[0] = await DB.createUpdateMark(1, {lat: 37.9838, lng: 23.7275});
			markAr[1] = await DB.createUpdateMark(2, {lat: 38.9838, lng: 24.7275});
			markAr[2] = await DB.createUpdateMark(3, {lat: 37.9999, lng: 23.7999});
		} catch (error) {
			console.error(error);
			throw error;
		}
	});
	describe('countMark', () => {
		test('should throw bind error', async () => {
			await expect(countMark()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('should have 3 entries', async () => {
			await expect(countMark.call(DB)).resolves.toBe(3);
		});
		test('should have 1 entries ( record exists) ', async () => {
			await expect(countMark.call(DB, markAr[0].userId)).resolves.toBe(1);
		});
	});

	describe('createUpdateMark', () => {
		test('should throw bind error', async () => {
			await expect(createUpdateMark()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});

		test('should throw MarkError ', async () => {
			const mark = new Mark();
			await expect(createUpdateMark.call(DB, mark)).rejects.toThrowError(
				new MarkError(
					this,
					422,
					[{field: 'userId', message: global.__getDictionary('__ERROR_USER_ID__')}],
					`createUpdateMark:: ${global.__getDictionary('__ERROR_WRONG_ARGUMENTS__')}`
				)
			);
		});

		test('Create mark ', async () => {
			const mark = new Mark({
				userId: 4,
				position: {lat: 37.9898, lng: 23.7975}
			});
			const markResult = new Mark({
				userId: 4,
				position: {lat: 37.9898, lng: 23.7975}
			});

			await expect(createUpdateMark.call(DB, mark)).resolves.toMatchObject(markResult);
		});

		test('Update mark ', async () => {
			const mark = new Mark({
				userId: 1,
				position: {lat: 37.7777, lng: 23.7777}
			});
			const markResult = new Mark({
				userId: 1,
				position: {lat: 37.7777, lng: 23.7777}
			});
			markAr[0].position = {lat: 37.7777, lng: 23.7777};
			await expect(createUpdateMark.call(DB, mark)).resolves.toMatchObject(markResult);
		});
		test('should have 4 entries', async () => {
			await expect(countMark.call(DB)).resolves.toBe(4);
		});
	});
	describe('Read', () => {
		test('getMark should throw bind error', async () => {
			await expect(getMark()).rejects.toThrowError(
				Error(global.__getDictionary('__ERROR_TROW_BIND_FAILED__'))
			);
		});
		test('getMark', async () => {
			const res = markAr.map(el => new Mark(el));
			res.push(
				new Mark({
					userId: 4,
					position: {lat: 37.9898, lng: 23.7975}
				})
			);
			await expect(getMark.call(DB)).resolves.toMatchObject(res);
		});
	});
});
