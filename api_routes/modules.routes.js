const express = require("express");
const { getAllModules, getModuleById, createModule, changeModuleStatus, updateModule, changeModuleDepartment, removeModule } = require("../controllers/modules.controllers");
const { verifyToken, verifyAdmin, verifySchedulers } = require("../middlewares/authJWT.middleware");
const router = express.Router();

/**
 * @swagger
 * /api/modules/:
 *  get:
 *      summary: Get all modules
 *      tags:
 *         - Modules endpoints
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 */
router.get("/", getAllModules);

/**
 * @swagger
 * /api/modules/{id}:
 *  get:
 *      summary: Get module by id
 *      tags:
 *          - Modules endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad Request
 *          404:
 *              description: Not Found
 *          500:
 *              description: Internal Server Error
 */
router.get("/:id", getModuleById);

/**
 * @swagger
 * definitions:
 *  ModuleSchema:
 *      type: object
 *      properties:
 *          module_name:
 *              type: string
 *              required: true
 *              description: Module name
 *          module_code:
 *              type: string
 *              required: true
 *              description: Module code
 *          module_description:
 *              type: string
 *              required: false
 *              description: Module Descriptions
 *          department:
 *              type: string
 *              required: false
 *              description: Department id
 *          status:
 *              type: string
 *              required: false
 *              description: Department Status
 *      example:
 *          module_name: "Calculus II"
 *          module_description: "Mathematics-bse module description"
 *          module_code: "MAT1261"
 *          department: "6377aadcd6eef3f0c06c166d"
 *          status: "active"
 */

/**
 * @swagger
 * /api/modules/create:
 *  post:
 *      summary: Create a module
 *      tags:
 *         - Modules endpoints
 *      parameters: []
 *      produces:
 *         - application/json
 *      requestBody:
 *          description: Module object
 *          required: true
 *          content:
 *             application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/ModuleSchema'
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Bad Request
 *          404:
 *              description: Not Found
 *          500:
 *              description: Internal Server Error
 */
router.post("/create", verifyToken, verifySchedulers, createModule);

/**
 * @swagger
 * /api/modules/update/{id}:
 *  put:
 *      summary: Update Module by Id
 *      tags:
 *          - Modules endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      produces:
 *          application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *      responses:
 *          204:
 *              description: Success
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 */
router.put("/update/:id", verifyToken, verifySchedulers, updateModule);

/**
 * @swagger
 * /api/modules/change/status/{id}:
 *  put:
 *      summary: Update Module Status by Id
 *      tags:
 *          - Modules endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      produces:
 *          application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *      responses:
 *          204:
 *              description: Success
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 */
router.put("/change/status/:id", verifyToken, verifySchedulers, changeModuleStatus);

/**
 * @swagger
 * /api/modules/change/department/{id}:
 *  put:
 *      summary: Update Module Department by Id
 *      tags:
 *          - Modules endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      produces:
 *          application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          department_id:
 *                              type: string
 *      responses:
 *          204:
 *              description: Success
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 */
 router.put("/change/status/:id", verifyToken, verifySchedulers, changeModuleDepartment);

/**
 * @swagger
 * /api/modules/remove/{id}:
 *  delete:
 *     summary: Delete a Module By Id
 *     tags:
 *         -   Modules
 *     parameters:
 *         -    name: id
 *              in: path
 *              require: true
 *              schema:
 *                  type: string
 *     responses:
 *          204:
 *              description: Success
 *          400:
 *              description: Bad Request
 *          500:
 *              description: Internal Server Error
 */
router.delete("/remove/:id", verifyToken, verifySchedulers, removeModule);

module.exports = router;