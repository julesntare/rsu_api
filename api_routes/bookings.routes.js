const express = require("express");
const {
  getAllBookings,
  getBookingById,
  createBooking,
  getAnyBookings
} = require("../controllers/bookings.controllers");
const { verifyToken, verifyUser } = require("../middlewares/authJWT.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/bookings/all:
 *  get:
 *      summary: Request all bookings.
 *      tags:
 *          - Booking endpoints
 *      security: []
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal server error
 */
router.get("/all", getAllBookings);
/**
 * @swagger
 * /api/bookings/any:
 *  get:
 *      summary: Request any bookings.
 *      tags:
 *          - Booking endpoints
 *      security: []
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal server error
 */
router.get("/any", getAnyBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *  get:
 *      summary: Request a booking by id.
 *      tags:
 *          - Booking endpoints
 *      security: []
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                 type: string
 *      responses:
 *          200:
 *              description: Returned details for specified booking (json format)
 *          404:
 *             description: Booking Not found
 *          500:
 *              description: Internal Server Error
 */
router.get("/:id", getBookingById);

/**
 * @swagger
 * definitions:
 *  Booking:
 *      type: object
 *      required:
 *          - user_id
 *          - all_authorized
 *          - activity
 *          - room
 *      properties:
 *          user_id:
 *              type: integer
 *              format: int64
 *              description: User id
 *          all_authorized:
 *              type: Array
 *              description: All Authorized users in array or empty array if no other
 *          activity:
 *              type: object
 *              format: json
 *              description: Activity object
 *          room:
 *              type: integer
 *              format: int64
 *              description: Room id
 *          additional_info:
 *              type: string
 *              description: Additional info
 *      example:
 *          user_id: 6377aadcd6eef3f0c06c166d
 *          all_authorized: [6377aadcd6eef3f0c06c166d, 6377aadcd6eef3f0c06c166d]
 *          activity: {
 *              activity_name: Learning,
 *              activity_description: Learning python in usual class,
 *              activity_recurrence: weekly,
 *              activity_starting_date: 2023-01-02,
 *              activity_ending_date: 2023-01-04,
 *              activity_days: [1, 3],
 *              activity_time: [[10:00, 11:00], [12:00, 13:00]],
 *              activity_meeting_link: https://meet.google.com/lookup/abc123
 *              }
 *          room: 63b299af8d89c14fb437f073
 *          additional_info: we are requesting for panel seats
 */

/**
 * @swagger
 * /api/bookings/create:
 *  post:
 *      summary: Create a new booking.
 *      description: "<b>N.B:</b> <i>To create a new booking, pay attention to the request to send.</i><br/><br/>
 *          The request body must be in json format and must contain the following fields:<br/>
 *          <b>user_id</b> (<i>as a reference ID</i>), <b>activity</b> (<i>as a json object</i>), <b>room</b> (<i>as a reference ID</i>), <b>additional_info</b>(<i>optional</i>).<br/><br/>
 *         For activity object, the following fields must be set as follows:<br/>
 *          <b>activity_name</b><i> is required</i><br/><b>activity_description</b><i> is optional</i><br/><b>activity_starting_date</b><i> is required</i><br/>          <b>activity_ending_date</b><i> is required</i><br/><b>activity_days</b><i> is required only when activity_recurrence is set to <b>weekly, monthly or certain_days</b>, and it must be an array of single or multiple days in numbers.(i.e., [1,2,...,7])</i><br/><b>activity_time</b> <i>is required and it must be an array of single or multiple times in allowed format.(i.e., [[start_time, end_time],...] like [[08:00, 11:00], [14:00, 17:00]]) or a single day range schedules</i><br/>        <b>activity_recurrence</b> is required and is enum of pre-defined texts(i.e. once | weekly | monthly | certain_days).<br/>
 *          <b>activity_online_link</b><i> is optional</i><br/>"
 *      tags:
 *         - Booking endpoints
 *      produces:
 *         - application/json
 *      parameters: []
 *      requestBody:
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/Booking'
 *      responses:
 *          201:
 *              description: Success
 *          400:
 *              description: Bad request
 *          409:
 *              description: Booking already exists
 *          500:
 *              description: Internal server error
 */
router.post("/create", verifyToken, verifyUser, createBooking);

module.exports = router;
