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

const router = express.Router();

/**
 * @swagger
 * /api/rooms/all:
 *  get:
 *      summary: Request all rooms.
 *      tags:
 *          - Rooms endpoints
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
 *              - room_room_name
 *              - room_building
 *              - room_floor
 *              - room_type
 *              - room_capacity
 *              - room_seats_arrangement
 *              - room_resources
 *              - has_fixed_seats
 *          properties:
 *              room_name:
 *                  type: string
 *                  description: Name of the room
 *              room_building:
 *                  type: string
 *                  description: Name of the building
 *              room_floor:
 *                  type: string
 *                  description: Name of the floor
 *              room_type:
 *                  type: string
 *                  description: Type of the room
 *              room_capacity:
 *                  type: integer
 *                  description: Capacity of the room
 *              room_seats_arrangement:
 *                  type: array
 *                  items:
 *                      type: number
 *                  description: Seats arrangement of the room
 *              has_fixed_seats:
 *                  type: boolean
 *                  description: If the room has fixed seats
 *              room_coordinates:
 *                  type: array
 *                  items:
 *                      type: number
 *                  description: Coordinates of the room
 *          example:
 *                  room_name: "P001"
 *                  room_building: "63682d0710000a7041ae5aac"
 *                  room_floor: "Ground Floor"
 *                  room_type: "6368bc27a3c65b114194fd94"
 *                  room_capacity: 120 
 *                  room_seats_arrangement: [60, 20]
 *                  has_fixed_seats: true
 *                  room_coordinates: [0, 0]
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
router.post("/create", createRoom);

module.exports = router;
