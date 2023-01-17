const express = require("express");
const {
    getAllRoomTypes,
    getRoomTypeById,
    createRoomType,
    removeRoomType,
    modifyRoomType,
} = require("../controllers/roomTypes.controllers");
const { verifyUserRole, verifyToken } = require("../middlewares/authJWT.middleware");
const router = express.Router();

/**
 * @swagger
 * /api/roomType/all:
 *  get:
 *      summary: Request all roomTypes.
 *      tags:
 *          - RoomType endpoints
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal server error
 */
router.get("/all", getAllRoomTypes);

/**
 * @swagger
 * /api/roomType/{id}:
 *  get:
 *      summary: Request a roomType by id.
 *      tags:
 *          - RoomType endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Returned details for specified roomType (json format)
 *          400:
 *              description: RoomType not found
 *          500:
 *              description: Internal Server Error
 */
router.get("/:id", getRoomTypeById);

/**
 * @swagger
 * definitions:
 *  RoomType:
 *      type: object
 *      required:
 *          - room_type_name
 *      properties:
 *          room_type_name:
 *              type: string
 *              enum: [laboratory, classroom, auditorium, hall, other]
 *              description: The name of the roomType
 *          room_type_description:
 *              type: string
 *              description: The description of the roomType
 *      example:
 *          room_type_name: classroom
 *          room_type_description: room intended to be used for teaching
 */

/**
 * @swagger
 * /api/roomType/create:
 *  post:
 *      summary: Create a new roomType.
 *      tags:
 *          - RoomType endpoints
 *      produces:
 *          - application/json
 *      parameters: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/RoomType'
 *      responses:
 *          201:
 *              description: RoomType created
 *          400:
 *              description: RoomType not created
 *          500:
 *              description: Internal Server Error
 */
router.post("/create", verifyToken, verifyUserRole, createRoomType);

/**
 * @swagger
 * /api/roomType/{id}:
 *  delete:
 *      summary: Delete a roomType by id.
 *      tags:
 *          - RoomType endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          204:
 *              description: RoomType deleted
 *          400:
 *              description: RoomType not found
 *          500:
 *              description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyUserRole, removeRoomType);

/**
 * @swagger
 * /api/roomType/modify/{id}:
 *  put:
 *      summary: Modify a roomType by id.
 *      tags:
 *          - RoomType endpoints
 *      produces:
 *          - application/json
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/RoomType'
 *      responses:
 *          200:
 *              description: RoomType modified
 *          400:
 *              description: RoomType not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/modify/:id", verifyToken, verifyUserRole, modifyRoomType);

module.exports = router;