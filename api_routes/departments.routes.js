const express = require("express");
const { getAllDepartments, getDepartmentById, createDepartment, changeDepartmentStatus, changeDepartmentHead, changeDepartmentNearLocations, changeDepartmentOfficeCoordinates, removeDepartment } = require("../controllers/department.controllers");
const { verifyToken } = require("../middlewares/authJWT.middleware");
const router = express.Router();

/**
 * @swagger
 * /api/departments/all:
 *  get:
 *      summary: Request all departments.
 *      tags:
 *         - Department endpoints
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
 *      parameters:
 *        -     name: id
 *              in: path
 *              required: true
 *              type: string
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
 * /api/departments/create:
 *  post:
 *      summary: Create a new department.
 *      tags:
 *          - Department endpoints
 *      security:
 *          -   bearerAuth: []
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
router.post("/create", verifyToken, createDepartment);

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
 *              type: string
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
router.put("/:id/change/status", changeDepartmentStatus);

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
 *              type: string
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
router.put("/:id/change/head", changeDepartmentHead);

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
 *              type: string
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
router.put("/:id/change/office_coordinates", changeDepartmentOfficeCoordinates);

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
 *              type: string
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
router.put("/:id/change/near_locations", changeDepartmentNearLocations);

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
 *              type: string
 *      responses:
 *          200:
 *              description: Department Deleted
 *          400:
 *              description: Department not found
 *          500:
 *              description: Internal Server Error
 */
router.delete("/:id", removeDepartment);

module.exports = router;