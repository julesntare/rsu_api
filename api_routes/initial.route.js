const express = require("express");
const router = express.Router();

/**
 * @openapi
 * /api:
 *      get:
 *        summary: Initial API route.
 *        tags:
 *          - Initial Request
 *        description: Returns Welcome message.
 *        security: []
 *        responses:
 *          200:
 *            description: Welcome message (json format)
 *          500:
 *           description: Internal server error
 */

router.get("/", (_req, res, _next) => {
  try {
    res.status(200).json({ message: "Welcome to RSU API!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
