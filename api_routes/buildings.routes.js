const express = require("express");
const {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  removeBuilding,
  modifyBuilding,
} = require("../controllers/building.controllers");
const router = express.Router();
const { verifyToken } = require("../middlewares/authJWT.middleware");

/**
 * @swagger
 * /api/building/all:
 *  get:
 *      summary: Request all buildings.
 *      tags:
 *        - Building endpoints
 *      security: []
 *      parameters: []
 *      responses:
 *        200:
 *          description: Success
 *        404:
 *          description: Not found
 *        500:
 *          description: Internal server error
 */
router.get("/all", getAllBuildings);

/**
 * @swagger
 * /api/building/{id}:
 *  get:
 *      summary: Request a building by id.
 *      tags:
 *        - Building endpoints
 *      security: []
 *      parameters:
 *        -   name: id
 *            in: path
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Returned details for specified building (json format)
 *          400:
 *              description: Building not found
 *          500:
 *              description: Internal Server Error
 */

router.get("/:id", getBuildingById);

/**
 * @swagger
 * definitions:
 *   Building:
 *    type: object
 *    required:
 *      - building_name
 *    properties:
 *      building_name:
 *        type: string
 *        description: Name of the building
 *      building_description:
 *        type: string
 *        description: Description of the building
 *      coordinates:
 *        type: array
 *        description: Coordinates of the building
 *      near_locations:
 *        type: array
 *        description: Nearby locations of the building
 *      added_on:
 *        type: date
 *        description: Date when the building was added
 *      status:
 *        type: string
 *        description: Status of the building
 *    example:
 *      building_name: "Building 1"
 *      building_description: "Building 1 description"
 *      coordinates: [-1.33784783, 30.19293828]
 *      near_locations: ["Location 1", "Location 2"]
 *      status: "active"
 */

/**
 * @swagger
 * /api/building:
 *  post:
 *      summary: Create a new building.
 *      tags:
 *        - Building endpoints
 *      produces:
 *       - application/json
 *      parameters: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Building'
 *      responses:
 *        201:
 *          description: Building created
 *        400:
 *          description: Invalid building object
 *        500:
 *          description: Internal Server Error
 */
router.post("/", verifyToken, createBuilding);

/**
 * @swagger
 * /api/building/remove/{id}:
 *  delete:
 *    summary: Delete a building by id.
 *    tags:
 *      - Building endpoints
 *    parameters:
 *      -   name: id
 *          in: path
 *          required: true
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
router.delete("/remove/:id", verifyToken, removeBuilding);

/**
 * @swagger
 * /api/building/modify/{id}:
 *    put:
 *      summary: Modify a building by id.
 *      tags:
 *        - Building endpoints
 *      produces:
 *       - application/json
 *      parameters:
 *        - name: id
 *          in: path
 *          type: string
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Building'
 *      responses:
 *        200:
 *            description: Building modified
 *        400:
 *            description: Invalid building object
 *        500:
 *            description: Internal Server Error
 *        404:
 *            description: Building not found
 */
router.put("/modify/:id", verifyToken, modifyBuilding);

module.exports = router;
