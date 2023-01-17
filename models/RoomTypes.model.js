const mongoose = require("mongoose");

const RoomTypesSchema = new mongoose.Schema({
  room_type_name: {
    type: String,
    enum: ["laboratory", "classroom", "auditorium", "hall", "other"],
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^(laboratory|classroom|auditorium|hall|other)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid building name!`,
    },
  },
  room_type_description: {
    type: String,
    required: false,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "disabled", "terminated"],
    required: true,
    default: "active",
    validate: {
      validator: function (v) {
        return /^(active|disabled|terminated)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid status!`,
    },
  },
});

module.exports = RoomTypes = mongoose.model("RoomTypes", RoomTypesSchema);
