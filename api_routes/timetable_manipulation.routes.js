const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  verifyToken,
  verifySchedulers,
} = require("../middlewares/authJWT.middleware");
const {
  uploadCSV,
  saveTimetable,
} = require("../controllers/timetable_manipulation.controllers");

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
 *          - Timetable endpoints
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          file:
 *                              type: string
 *                              format: binary
 *                              required: true
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post(
  "/upload",
  upload.single("file"),
  verifyToken,
  verifySchedulers,
  uploadCSV
);

/**
 * @swagger
 * /api/csv/save_timetable:
 *  post:
 *      summary: Save timetable to database.
 *      tags:
 *         - Timetable endpoints
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          starting_date:
 *                              type: string
 *                              format: date 
 *                              required: true
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post("/save_timetable", verifyToken, verifySchedulers, saveTimetable);

module.exports = router;
