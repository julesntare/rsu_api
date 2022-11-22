const express = require("express");
const { login, register, logout } = require("../controllers/auth.controllers");
const { verifyToken } = require("../middlewares/authJWT.middleware");
const router = express.Router();

/**
 * @swagger
 * definitions:
 *  RegisterData:
 *      type: object
 *      required:
 *          - fullname
 *          - email
 *          - mobile_no
 *          - password
 *      properties:
 *          fullname:
 *              type: string
 *              description: Provide Your First, middle (if any), and Last Name
 *          email:
 *              type: string
 *              description: Provide Your Email
 *          mobile_no:
 *              type: string
 *              description: Provide Your Mobile Number. Format (+250788888888 / 250788888888 / 0788888888)
 *          password:
 *              type: string
 *              description: Provide Password of your choice. password must include (>= 8 characters, at least one upperCase, one lowerCase, one symbol and one number)
 *      example:
 *          fullname: "John Doe"
 *          email: "johndoe@gmail.com"
 *          mobile_no: "0788888888"
 *          password: "jodT^O3)@22"
 */

/**
 * @swagger
 * definitions:
 *  LoginData:
 *      type: object
 *      required:
 *          - email
 *          - password
 *      properties:
 *          username:
 *              type: string
 *              description: The Username set in signup
 *          password:
 *              type: string
 *              description: The Password set in signup
 *      example:
 *          username: "J88"
 *          password: "jodT^O3)@22"
 */

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Login to the application.
 *      tags:
 *          - Auth endpoints
 *      security: []
 *      produces:
 *          - application/json
 *      parameters: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/LoginData'
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Register a new user.
 *      tags:
 *          - Auth endpoints
 *      security: []
 *      produces:
 *          - application/json
 *      parameters: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/RegisterData'
 *      responses:
 *          201:
 *              description: User created
 *          400:
 *              description: Invalid user object
 *          500:
 *              description: Internal Server Error
 *          409:
 *              description: User already exists
 *          422:
 *              description: Unprocessable entity
 *          401:
 *              description: Unauthorized
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/logout:
 *  get:
 *      summary: Logout from the application.
 *      tags:
 *          - Auth endpoints
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          500:
 *              description: Internal server error
 *          401:
 *              description: Unauthorized
 */
router.get("/logout", verifyToken, logout);

module.exports = router;