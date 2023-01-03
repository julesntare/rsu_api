const express = require("express");
const multer = require("multer");
const router = express.Router();
const { verifyToken } = require("../middlewares/authJWT.middleware");
const {
  removeEmptyColumns,
  uploadCSV,
  getCSVData,
  pushJSONDataToDB,
} = require("../controllers/csv_upload.controllers");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./timetableCsv");
  },
  filename: (req, file, cb) => {
    cb(null, `timetable_manip.csv`);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/csv/upload:
 *  post:
 *      summary: Upload a CSV file.
 *      tags:
 *          - CSV endpoints
 *      security: []
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          file:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post("/upload", upload.single("file"), uploadCSV);

/**
 * @swagger
 * /api/csv/removeEmptyColumns:
 *  put:
 *      summary: Remove empty columns from CSV file.
 *      tags:
 *          - CSV endpoints
 *      security: []
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.put("/removeEmptyColumns", removeEmptyColumns);

/**
 * @swagger
 * /api/csv/getData:
 *  get:
 *      summary: Get data from CSV file.
 *      tags:
 *          - CSV endpoints
 *      security: []
 *      parameters: []
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.get("/getData", getCSVData);

/**
 * @swagger
 * /api/csv/pushToDB:
 *  post:
 *      summary: Push data from uploaded CSV file to DB.
 *      tags:
 *        - CSV endpoints
 *      security: []
 *      parameters: []
 *      responses:
 *        200:
 *          description: Success
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Not found
 */
router.post("/pushToDB", pushJSONDataToDB);

module.exports = router;
