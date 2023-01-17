const express = require("express");
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  changeDepartmentStatus,
  changeDepartmentHead,
  changeDepartmentNearLocations,
  changeDepartmentOfficeCoordinates,
  removeDepartment,
} = require("../controllers/department.controllers");
const {
  verifyToken,
  verifyAdmin,
  verifyUser,
} = require("../middlewares/authJWT.middleware");
const router = express.Router();

/**
 * @swagger
 * /api/departments/all:
 *  get:
 *      summary: Request all departments.
 *      tags:
 *         - Department endpoints
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
router.get("/all", getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *  get:
 *      summary: Request a department by id.
 *      tags:
 *        - Department endpoints
 *      security: []
 *      parameters:
 *        -     name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *         200:
 *              description: Returned details for specified department (json format)
 *         400:
 *              description: Department not found
 *         500:
 *              description: Internal Server Error
 */
router.get("/:id", getDepartmentById);

/**
 * @swagger
 * definitions:
 *     Department:
 *          type: object
 *          required:
 *              -   department_name
 *              -   department_description
 *              -   department_head
 *          properties:
 *              department_name:
 *                  type: string
 *                  description: Department name
 *              department_description:
 *                  type: string
 *                  description: Department description
 *              department_head:
 *                  type: integer
 *                  format: int64
 *                  description: Department head (reference id from users collection)
 *              near_locations:
 *                  type: Array
 *                  description: Department near locations
 *              office_location:
 *                  type: Array
 *                  description: Department office coordinates
 *              status:
 *                  type: string
 *                  description: Department status
 *          example:
 *              department_name: Computer Science
 *              department_description: Department of Computer Science
 *              department_head: 1f9f1b9b9c9d9b1b8c8c8c8c
 *              near_locations: [muhazi conference hall, girls hostels near dusaid]
 *              office_location: [-1.92424, 30.92424]
 *              status: active
 */

/**
 * @swagger
 * /api/departments/create:
 *  post:
 *      summary: Create a new department.
 *      tags:
 *          - Department endpoints
 *      produces:
 *          -   application/json
 *      parameters: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Department'
 *      responses:
 *          201:
 *              description: Successfully created
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post("/create", verifyToken, verifyAdmin, createDepartment);

/**
 * @swagger
 * /api/departments/{id}/change/status:
 *  put:
 *      summary: Change department status by id.
 *      tags:
 *          -   Department endpoints
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
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 *      responses:
 *          200:
 *              description: Department Status Changed
 *          400:
 *              description: Department not found
 *          500:
 *              description: Internal Server Error
 */
router.put(
  "/:id/change/status",
  verifyToken,
  verifyAdmin,
  changeDepartmentStatus
);

/**
 * @swagger
 * /api/departments/{id}/change/head:
 *  put:
 *      summary: Change department head by id.
 *      tags:
 *         -   Department endpoints
 *      parameters:
 *         -    name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          head:
 *                              type: string
 *      responses:
 *          200:
 *              description: Department Head Changed
 *          400:
 *              description: Department not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/:id/change/head", verifyToken, verifyAdmin, changeDepartmentHead);

/**
 * @swagger
 * /api/departments/{id}/change/office_coordinates:
 *  put:
 *      summary: Change department office coordinates by id.
 *      tags:
 *          -   Department endpoints
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
 *                      type: object
 *                      properties:
 *                          lat:
 *                              type: number
 *                          long:
 *                              type: number
 *      responses:
 *          200:
 *             description: Department Office Coordinates Changed
 *          400:
 *             description: Department not found
 *          500:
 *            description: Internal Server Error
 */
router.put(
  "/:id/change/office_coordinates",
  verifyToken,
  verifyUser,
  changeDepartmentOfficeCoordinates
);

/**
 * @swagger
 * /api/departments/{id}/change/near_locations:
 *  put:
 *      summary: Change department near locations by id.
 *      tags:
 *          -   Department endpoints
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
 *                      type: object
 *                      properties:
 *                          lat:
 *                              type: number
 *                          long:
 *                              type: number
 *      responses:
 *          200:
 *             description: Department Office Near locations Modified
 *          400:
 *             description: Department not found
 *          500:
 *            description: Internal Server Error
 */
router.put(
  "/:id/change/near_locations",
  verifyToken,
  verifyUser,
  changeDepartmentNearLocations
);

/**
 * @swagger
 * /api/departments/remove/{id}:
 *  delete:
 *      summary: Remove department by id.
 *      tags:
 *          -   Department endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Department Deleted
 *          400:
 *              description: Department not found
 *          500:
 *              description: Internal Server Error
 */
router.delete("/:id", verifyToken, verifyAdmin, removeDepartment);

module.exports = router;
