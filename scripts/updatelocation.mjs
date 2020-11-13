'use strict';
/**
 * This script update the location for some users 
 */

import request from 'superagent';
import util from 'util';
const setTimeoutPromise = util.promisify(setTimeout);

const loginEndPoint = `http://127.0.0.1:3001/jwt/login`;
const markEndPoint = `http://127.0.0.1:3001/api/mark`;

const UPDATE_EVERY_SEC=5; //Update location every 5 seconds




const login = async (username, password) => {
	try {
		const result = await request
			.post(loginEndPoint)
			.send({ username, password })
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json');

		// console.log(result);
		if (result.body && result.body.data && result.body.data[0].token) {
			return result.body.data[0].token;
		}
	} catch (error) {
		throw error;
	}
	return ``;
};

const updateLocation = async token => { 
	try {
		let buff = new Buffer.from(token.split('.')[1], 'base64');
		let text = buff.toString();
		const {
			user: { key }
		} = JSON.parse(text); 
		const result = await request
			.post(markEndPoint)
			.send({
				userId: key,
				position: { lat: `${37.+Math.random()}`, lng: `${23+Math.random()}` }
			})
			.set('Content-Type', 'application/json')
			.set('Acccept', 'application/json')
			.set('Authorization', `Bearer ${token}`)
			.catch(e => console.error(e)); 
		return true;
	} catch (error) { 
		throw error;
	}

};


const updateLocationWhile = (token) => { 
	return updateLocation(token).then(res => {
		// console.log(`updateLocationWhile(${token}) -- ${res}`);
		console.log(`updateLocationWhile(token) returns ${res}`);
		if(res){
			return setTimeoutPromise((UPDATE_EVERY_SEC*1000));
		}

	}).then(() => {
		updateLocationWhile(token);
	})
}

const token = [];//Users that will update their location
token[0] = await login('FullName 1', 't3$T1101123');
token[1] = await login('NextTest5', 't3$T1101123');
token[2] = await login('username3', 't3$T1101123');
token[3] = await login('username1', 't3$T1101123');
token[4] = await login('admin29', 't3$T1101123');

token.forEach(async element => { 
	updateLocationWhile(element);
});