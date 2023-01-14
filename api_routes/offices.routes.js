const express = require("express");

const {
  getAllOffices,
  getOfficeById,
  createOffice,
} = require("../controllers/offices.controllers");
const { verifyUserRole, verifyToken } = require("../middlewares/authJWT.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/offices/all:
 *  get:
 *      summary: Request all offices.
 *      tags:
 *          - Offices endpoints
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
router.get("/all", getAllOffices);

/**
 * @swagger
 * /api/offices/{id}:
 *  get:
 *      summary: Request an office by id.
 *      tags:
 *          - Offices endpoints
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                 type: string
 *      schema:
 *          type: string
 *          required: true
 *          description: The office id
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
router.get("/:id", getOfficeById);

/**
 * @swagger
 * definitions:
 *      office:
 *          type: object
 *          required:
 *              - office_name
 *              - office_building_location
 *              - building_floor
 *              - office_type
 *              - working_days
 *              - working_hours
 *              - coordinates
 *          properties:
 *              office_name:
 *                  type: string
 *                  description: Name of the office
 *              office_description:
 *                  type: string
 *                  description: Description of the office
 *              office_building_location:
 *                  type: string
 *                  description: building reference (use the buildings endpoint to get the id)
 *              office_type:
 *                  type: enum
 *                  description: office type (use enum values which are => "private", "shared", "open", "hot_desk")
 *              building_floor:
 *                  type: number
 *                  description: floor number (0=ground floor,1=first floor, etc.)
 *              coordinates:
 *                  type: array
 *                  description: office exact location on mapping
 *              capacity:
 *                  type: integer
 *                  description: Capacity of the office
 *              responsible:
 *                  type: string
 *                  description: Someone who is responsible for a certain office (use the users endpoint to get the id)
 *              working_days:
 *                  type: array
 *                  description: days of the week when the office is available (use enum values which are between 1-7)
 *              working_hours:
 *                  type: array
 *                  description: hours when the office is open (use enum values which are between 00:00-23:59)
 *              img_url:
 *                  type: string
 *                  description: url of the office image (optional)
 *          example:
 *              office_name: "Registrar Office"
 *              office_description: "The Registrar Office is responsible for the registration of students and the maintenance of their academic records."
 *              office_building_location: "63bbc858d58eb309ee2bc02a"
 *              office_type: "private"
 *              building_floor: 0
 *              coordinates: [-1.962621,30.064461]
 *              capacity: 2
 *              responsible: "63befca5ba573592f077b7d2"
 *              working_days: [1,2,3,4,5]
 *              working_hours: ["08:00","17:00"]
 *              img_url: "https://res.cloudinary.com/julesntare/image/upload/v1673265264/rsu_cst_buildings/undraw_apartment_rent_o0ut_sj75zz.png"
 */

/**
 * @swagger
 * /api/offices/create:
 *  post:
 *      summary: Create a new office.
 *      tags:
 *          - Offices endpoints
 *      produces:
 *       - application/json
 *      parameters: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/office'
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
router.post("/create", verifyToken, verifyUserRole, createOffice);

module.exports = router;
