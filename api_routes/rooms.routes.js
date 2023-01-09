const express = require("express");

const {
  getAllRooms,
  getRoomById,
  createRoom,
  removeRoom,
  modifyRoom,
  getRoomsByBuilding,
  getRoomsByFloor,
  getRoomsByType,
  getRoomsByCapacity,
  getRoomsBySeatsArrangement,
  getRoomsByResources,
  getRoomsBySeatsType,
} = require("../controllers/rooms.controllers");
const { verifyUserRole, verifyToken } = require("../middlewares/authJWT.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/rooms/all:
 *  get:
 *      summary: Request all rooms.
 *      tags:
 *          - Rooms endpoints
 *      security: []
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal server error
 *          401:
 *              description: Unauthorized
 */
router.get("/all", getAllRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *  get:
 *      summary: Request a room by id.
 *      tags:
 *          - Rooms endpoints
 *      parameters:
 *          -   in: path
 *              name: id
 *      schema:
 *          type: string
 *          required: true
 *          description: The room id
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal server error
 *          401:
 *              description: Unauthorized
 */
router.get("/:id", getRoomById);

/**
 * @swagger
 * definitions:
 *      Room:
 *          type: object
 *          required:
 *              - room_name
 *              - room_building
 *              - room_floor
 *              - room_type
 *              - capacity
 *              - room_resources
 *          properties:
 *              room_name:
 *                  type: string
 *                  description: Name of the room
 *              room_description:
 *                  type: string
 *                  description: Description of the room
 *              room_building:
 *                  type: string
 *                  description: building reference (use the buildings endpoint to get the id)
 *              room_floor:
 *                  type: number
 *                  description: floor number (0=ground floor,1=first floor, etc.)
 *              room_type:
 *                  type: string
 *                  description: Type of the room (use the room types endpoint to get the id)
 *              capacity:
 *                  type: integer
 *                  description: Capacity of the room
 *              has_fixed_seats:
 *                  type: boolean
 *                  description: If the room has fixed seats (true | false)
 *              resources:
 *                  type: array
 *                  description: List of resources that the room has
 *              responsible:
 *                  type: string
 *                  description: Someone who is responsible for a certain room (use the users endpoint to get the id)
 *          example:
 *                  room_name: "P001"
 *                  room_description: "Room can be used or classes, conference and other events"
 *                  room_building: "63682d0710000a7041ae5aac"
 *                  room_floor: 0
 *                  room_type: "6368bc27a3c65b114194fd94"
 *                  capacity: 120
 *                  has_fixed_seats: true
 *                  resources: ["projector", "speakers"]
 *                  responsible: "6368bc27a3c65b114194fd94"
 */

/**
 * @swagger
 * /api/rooms/create:
 *  post:
 *      summary: Create a new room.
 *      tags:
 *          - Rooms endpoints
 *      produces:
 *       - application/json
 *      parameters: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Room'
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Not found
 */
router.post("/create", verifyToken, verifyUserRole, createRoom);

module.exports = router;
