const mongoose = require("mongoose");

const SessionsSchema = new mongoose.Schema({
  user_id: {
    type: String,
    reference: {
      model: "Users",
      path: "username",
    },
    required: true,
  },
  session_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: false,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Sessions = mongoose.model("Sessions", SessionsSchema);
