const express = require("express");
const {
  getAllUsers,
  getUserById,
  getUserByRole,
  updateUser,
  deleteUser,
  changeStatus,
  changePassword,
  changeRole,
  changeEmail,
  changePhone,
  searchUserByAny,
} = require("../controllers/users.controllers");
const router = express.Router();
const {
  verifyToken,
  verifyUser,
  verifyAdmin,
} = require("../middlewares/authJWT.middleware");

/**
 * @swagger
 * /api/users/all:
 *  get:
 *      summary: Request all users.
 *      tags:
 *          - User endpoints
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
router.get("/all", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      summary: Request a user by id.
 *      tags:
 *          - User endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Returned details for specified user (json format)
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.get("/:id", verifyToken, verifyUser, getUserById);

/**
 * @swagger
 * /api/users/{role}:
 *  get:
 *      summary: Request a user by role.
 *      tags:
 *         - User endpoints
 *      parameters:
 *         -    name: role
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Returned details for specified user (json format)
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.get("/role/:role", verifyToken, verifyUser, getUserByRole);

/**
 * @swagger
 * /api/users/update/{id}:
 *  put:
 *      summary: Update a user by id.
 *      tags:
 *          -   User endpoints
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
 *                          fullname:
 *                              type: string
 *                          status:
 *                              type: string
 *      responses:
 *          200:
 *              description: User updated
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/update/:id", verifyToken, verifyAdmin, updateUser);

/**
 * @swagger
 * /api/users/delete/{id}:
 *  delete:
 *      summary: Delete a user by id.
 *      tags:
 *         -   User endpoints
 *      parameters:
 *        -     name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          204:
 *              description: User deleted
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.delete("/delete/:id", verifyToken, verifyAdmin, deleteUser);

/**
 * @swagger
 * /api/users/change/password/{id}:
 *  put:
 *      summary: Change password of a user by id.
 *      tags:
 *          -   User endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *        content:
 *           application/json:
 *             schema:
 *                  type: object
 *                  properties:
 *                      current_password:
 *                          type: string
 *                      new_password:
 *                          type: string
 *                      confirm_password:
 *                          type: string
 *      responses:
 *          200:
 *              description: Password changed
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/change/password/:id", verifyToken, verifyUser, changePassword);

/**
 * @swagger
 * /api/users/{id}/change/role:
 *  put:
 *      summary: Change role of a user by id.
 *      tags:
 *          -   User endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *        content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      roleId:
 *                          type: string
 *      responses:
 *          200:
 *              description: User Role changed
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/:id/change/role", verifyToken, verifyAdmin, changeRole);

/**
 * @swagger
 * /api/users/{id}/change/status:
 *  put:
 *      summary: Change status of a user by id.
 *      tags:
 *          -   User endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *        content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      status:
 *                          type: string
 *      responses:
 *          200:
 *              description: User Status changed
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/:id/change/status", verifyToken, verifyUser, changeStatus);

/**
 * @swagger
 * /api/users/{id}/change/email:
 *  put:
 *      summary: Change email of a user by id.
 *      tags:
 *          -   User endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *        content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *      responses:
 *          200:
 *              description: User Email changed
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/:id/change/email", verifyToken, verifyUser, changeEmail);

/**
 * @swagger
 * /api/users/{id}/change/mobile:
 *  put:
 *      summary: Change phone number of a user by id.
 *      tags:
 *          -   User endpoints
 *      parameters:
 *          -   name: id
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *        content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      mobile_no:
 *                          type: string
 *      responses:
 *          200:
 *              description: User Mobile Number changed
 *          400:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */
router.put("/:id/change/mobile", verifyToken, verifyUser, changePhone);

/**
 * @swagger
 * /api/users/search/{keyword}:
 *  get:
 *      summary: Search users by keyword in (fullname, mobile_no, email).
 *      tags:
 *          -   User endpoints
 *      parameters:
 *          -   name: keyword
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Users found
 *          400:
 *              description: Users not found
 *          500:
 *              description: Internal Server Error
 */
router.get("/search/:keyword", verifyToken, verifyUser, searchUserByAny);

module.exports = router;
