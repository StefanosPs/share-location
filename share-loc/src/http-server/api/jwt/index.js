import Router from 'koa-router';

import {localAuthHandler, authRefresh, authDestroy} from '../../../authentication/koa-router';

const router = Router();

/**
 * yarn cmd user create -u admin -p t3\$T1101
 * yarn cmd user create -u testusername -p t3\$T1101
 * 
 * 
 * test -p t3$T1101
 * curl -X POST --header "Content-Type: application/json" http://127.0.0.1:3000/login
 * curl --header "Content-Type: application/json" --request POST --data '{"username":"testusername","password":"1aBc!d&"}' http://127.0.0.1:3000/login
 * 
ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QiLCJrZXkiOjgsInVzZXJuYW1lIjoidGVzdCIsImZ1bGxOYW1lIjpudWxsLCJpYXQiOjE1OTUzNTMxMzJ9.QHkEHyz8RYV_q0Y7_2PQgQ7M9Vzj5vCkzukqEq_z2fk
curl  --header "Authorization: OAuth $ACCESS_TOKEN"  --header "Content-Type: application/json" --request get http://127.0.0.1:3000/health
 */
// router.post('/login', passport.authenticate('local', {successRedirect: '/'}));

// router.post('login', '/login', localAuthHandler);

/**
 * @api {post} /login Login Action
 * @apiDescription ...
 * @apiVersion 1.0.0
 * @apiName Validate User
 * @apiGroup login
 *
 * @apiParam  {String} username The username
 * @apiParam  {String{5..15}} password The password
 *
 * @apiExample {curl} Example usage:
 *    curl --header "Content-Type: application/json" --request POST --data '{"username":"testusername","password":"1aBc!d&"}' http://127.0.0.1:3000/login
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "statusCode": 200,
 *   "message": "Login OK",
 *   "data": {
 *      "token": "......",
 *      "tokenExpiry": 30000
 *   }
 * }
 *
 */
router.post('login', '/login', localAuthHandler);

/**
 * @api {post} /logout Logout Action
 * @apiDescription ...
 * @apiVersion 1.0.0
 * @apiName Validate User
 * @apiGroup login
 *
 * @apiExample {curl} Example usage:
 *    ACCESS_TOKEN=
 *    curl -i -X POST --header "Content-Type: application/json" http://127.0.0.1:3000/logout
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "statusCode": 200,
 *     "message": "Logout OK",
 *     "data": []
 * }
 */
router.post('logout', '/logout', authDestroy);

/**
 * @api {post} /refresh-token Refresh Token Action
 *
 * @apiHeader (MyHeaderGroup) {String} authorization Authorization value.
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "statusCode": 200,
 *   "message": "Refresh ok",
 *   "data": {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoidGVzdCIsImtleSI6MTAsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJ0ZXN0IiwiZnVsbE5hbWUiOm51bGx9LCJleHBpcmF0aW9uIjoxNTk4NTQ3NTA3NTAwLCJpYXQiOjE1OTg1NDc0NzcsImV4cCI6MTU5ODU3NzQ3N30.RW4Sii5n4IsjskrsoBs6XYdRXWxZoz94zHRAiH1NVic",
 *       "tokenExpiry": 30000
 *   }
 * }
 *
 */
router.post('refresh.token', '/refresh-token', authRefresh);

export default router;
