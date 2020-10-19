import Router from 'koa-router';
import createAction from './create';
import getAction from './get';
import putAction from './put';
import deleteAction from './delete';

const router = Router();

/**
 * @api {post} /api/user Create a user
 * @apiDescription ....
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiExample {curl} Example usage:
 *      curl -i -X POST --header "Content-Type: application/json" -d '{"username": "testusername", "password": "1aBc!d&"}' http://127.0.0.1:3000/api/user
 *
 * @apiParam  {String} fullName The full name of the user
 * @apiParam  {String} username The username
 * @apiParam  {String{5..15}} password The password
 * @apiParam  {String} [provider] The login provider
 * @apiParam  {String="Administrator","Moderator","User"} [role=User] The role of the user
 * @apiParam  {String="Active","Disabled","Pedding"} [status=Pedding] The status of the user
 * @apiParam  {String} [emails] The user email
 *
 * @apiSuccess (Success 201) {Number} status The status code.
 * @apiSuccess (Success 201) {User[]} data Array with the users.
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *    "statusCode": 201,
 *    "data": [{
 *        "username": "username",
 *        "password": "password",
 *        "fullName": "fullName",
 *        "role": "role",
 *        "createdAt": createdAt
 *     }]
 * }
 *
 * @apiError (UnprocessableEntity 422) {Object} ValidationError Invalid request body
 * @apiError (ServerError 50x) ServerError  Internal server error
 *
 */
router.post('user.create', 'user', createAction);
/**
 * @api {get} /api/user/:id Get users
 * @apiDescription ...
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiExample {curl} Example usage:
 *      curl -i -X GET http://127.0.0.1:3000/api/user
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess (Success 200) {Number} status The status code.
 * @apiSuccess (Success 200) {User[]} data Array with the users.
 * @apiSuccess (Success 200) {Number} totalCount The total number of the users.
 *
 * @apiSuccess (Success 204) - No Content
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "statusCode": 200,
 *      "data": [
 *          {
 *              "id": 10,
 *              "username": "test",
 *              "password": "....",
 *              "fullName": null,
 *              "role": "User",
 *              "status": null,
 *              "emails": null
 *          }
 *      ],
 *      "totalCount": 6
 * }
 *
 * @apiError (UnprocessableEntity 422) {Object} ValidationError Invalid request body
 * @apiError (ServerError 50x) ServerError  Internal server error
 *
 */
router.get('user.get', 'user', getAction);
router.get('user.getid', 'user/:id', getAction);
/**
 * @api {put} /api/user/:id Update a user
 * @apiDescription ....
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiExample {curl} Example usage:
 *     curl
 *
 * @apiParam {Number} id Users unique ID.
 * @apiParam  {String} fullName The full name of the user.
 * @apiParam  {String{5..15}} password The password.
 * @apiParam  {String} [provider] The login provider
 * @apiParam  {String="Administrator","Moderator","User"} [role=User] The role of the user
 * @apiParam  {String="Active","Disabled","Pedding"} [status=Pedding] The status of the user
 * @apiParam  {String} [emails] The user email
 *
 * @apiSuccess (Success 200) {Number} status The status code.
 * @apiSuccess (Success 200) {User[]} data Array with the users.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "statusCode": 200,
 *    "data": []
 * }
 *
 *
 * @apiError (UnprocessableEntity 422) ValidationError Invalid request body
 * @apiError (ServerError 50x) ServerError  Internal server error
 *
 */
router.put('user.put', 'user/:id', putAction);
/**
 * @api {delete} /api/user Delete a user
 * @apiDescription ....
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiExample {curl} Example usage:
 *      curl
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess (Success 200) {Number} status The status code
 * @apiSuccess (Success 200) {Array} data An empty array
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "statusCode": 200,
 *    "data": []
 * }
 *
 * @apiError (UnprocessableEntity 422) ValidationError Invalid request body
 * @apiError (ServerError 50x) ServerError  Internal server error
 *
 */
router.delete('user.delete', 'user/:id', deleteAction);

export default router;
