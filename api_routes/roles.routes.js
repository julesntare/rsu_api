const express = require("express");
const {
  getAllRoles,
  getRoleById,
  createRole,
  removeRole,
  updateRole,
} = require("../controllers/roles.controllers");
const {
  verifyToken,
  verifyAdmin,
} = require("../middlewares/authJWT.middleware");
const router = express.Router();

/**
 * @swagger
 * /api/role/all:
 *  get:
 *      summary: Request all roles.
 *      tags:
 *          - Role endpoints
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal server error
 */
router.get("/all", getAllRoles);

/**
 * @swagger
 * /api/role/{id}:
 *  get:
 *      summary: Request a role by id.
 *      tags:
 *          - Role endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Returned details for specified role (json format)
 *          400:
 *              description: Role not found
 *          500:
 *              description: Internal Server Error
 */
router.get("/:id", getRoleById);

/**
 * @swagger
 *  definitions:
 *      Role:
 *          type: object
 *          required:
 *              - role_name
 *          properties:
 *              role_name:
 *                  type: string
 *                  description: The name of the role (Admin, Contributors, Scheduler, AssetsM)
 *              role_description:
 *                  type: string
 *                  description: The description of the role
 *          example:
 *              role_name: Admin
 *              role_description: Admin role
 */

/**
 * @swagger
 * /api/role/create:
 *  post:
 *      summary: Create a new role.
 *      tags:
 *          -   Role endpoints
 *      produces:
 *          -   application/json
 *      parameters: []
 *      requestBody:
 *         content:
 *             application/json:
 *                  schema:
 *                      $ref: '#/definitions/Role'
 *      responses:
 *          201:
 *              description: Successfully created
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post("/create", verifyToken, verifyAdmin, createRole);

/**
 * @swagger
 * /api/role/{id}:
 *  delete:
 *      summary: Delete a role by id.
 *      tags:
 *          -   Role endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Successfully deleted
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.delete("/:id", verifyToken, verifyAdmin, removeRole);

/**
 * @swagger
 * /api/role/{id}:
 *  put:
 *      summary: Update a role by id.
 *      tags:
 *          -   Role endpoints
 *      produces:
 *          -   application/json
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
 *                      $ref: '#/definitions/Role'
 *      responses:
 *          200:
 *              description: Successfully updated
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.put("/:id", verifyToken, verifyAdmin, updateRole);

module.exports = router;
