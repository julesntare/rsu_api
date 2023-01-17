const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const initialRoute = require("./api_routes/initial.route");
const buildingRoutes = require("./api_routes/buildings.routes");
const roomTypesRoutes = require("./api_routes/roomTypes.routes");
const rolesRoutes = require("./api_routes/roles.routes");
const usersRoutes = require("./api_routes/users.routes");
const authRoutes = require("./api_routes/auth.routes");
const deptRoutes = require("./api_routes/departments.routes");
const modRoutes = require("./api_routes/modules.routes");
const roomsRoutes = require("./api_routes/rooms.routes");
const officesRoutes = require("./api_routes/offices.routes");
const groupsRoutes = require("./api_routes/groups.routes");
const bookingsRoutes = require("./api_routes/bookings.routes");
const csvRoute = require("./api_routes/timetable_manipulation.routes");
const morgan = require("morgan");
const {log} = require("mercedlogger");

const app = express();

// setting up port
const PORT = process.env.PORT || 8000;

const connectDB = require("./config/db_conf");

// connect database
connectDB();

// cors
app.use(cors());

app.use(morgan("tiny"));

// initialize middleware
app.use(express.json({ extended: false }));

// ------ Configure swagger docs ------
var options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "RSU API",
      version: "1.0.0",
      description: "Welcome to UR-CST RSU API!",
    },
    security: [
      { bearerAuth: [] },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "/api_routes/*.js")],
};
var swaggerSpecs = swaggerJsdoc(options);

// ------ API routes ------
app.use("/api/", initialRoute);
app.use("/api/building", buildingRoutes);
app.use("/api/roomType", roomTypesRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/offices", officesRoutes);
app.use("/api/role", rolesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/departments", deptRoutes);
app.use("/api/modules", modRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/csv", csvRoute);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(PORT, () => {
  log.green("SERVER STATUS", `Running on http://localhost:${PORT}`);
});
