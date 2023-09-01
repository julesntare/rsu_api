const mongoose = require("mongoose");
const { log } = require("mercedlogger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoose.set("strictQuery", false);
    log.green("DB STATUS", `connected on: ${conn.connection.port}`);
  } catch (err) {
    log.red("DB STATUS", err);
  }
};

module.exports = connectDB;
