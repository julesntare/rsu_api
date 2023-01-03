const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    reference: {
      model: "Users",
      type: mongoose.Schema.Types.ObjectId,
    },
    validate: {
      validator: function (v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid user reference format!`,
    }
  },
  activity: {
    type: Object,
    required: true,
    validate: {
      validator: function (v) {
        // validate json object properties
        return (
          v.hasOwnProperty("activity_name") &&
          v.hasOwnProperty("activity_starting_date") &&
          v.hasOwnProperty("activity_ending_date") &&
          v.hasOwnProperty("activity_time") &&
          v.hasOwnProperty("activity_recurrence")
        );
        },
      message: (props) => `${props.value} is not a valid activity object!`,
    },
  },
  room: {
    type: String,
    required: true,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Rooms",
    },
    validate: {
      validator: function (v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid room reference format!`,
    }
  },
  additional_info: {
    type: String,
    required: false,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    required: true,
    default: "pending",
    validate: {
      validator: function(v) {
        return /^(pending|confirmed|cancelled)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid status!`,
    }
  },
  // field to mention if from timetable or booking call it flag
  flag: {
    type: Number,
    enum: [0, 1],
    required: false,
    default: 0,
  },
});

module.exports = Bookings = mongoose.model("Bookings", BookingsSchema);
