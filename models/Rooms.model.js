const mongoose = require("mongoose");

const RoomsSchema = new mongoose.Schema({
  room_name: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: function (v) {
    //     return /^[a-zA-Z0-9 ]{3,30}$/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid room name!`,
    // },
  },
  room_description: {
    type: String,
    required: false,
  },
  room_building: {
    type: String,
    default: null,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Buildings",
    },
    // required: false,
    // validate: {
    //   validator: function (v) {
    //     return /^[0-9a-fA-F]{24}$/.test(v);
    //   },
    //   message: (props) =>
    //     `${props.value} is not a valid building reference format!`,
    // },
  },
  room_floor: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{1}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid building floor!`,
    },
    default: 0,
  },
  capacity: {
    type: Number,
    required: false,
    validate: {
      validator: function (v) {
        return /^[0-9]{1,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid room capacity!`,
    },
  },
  has_fixed_seats: {
    type: Boolean,
    required: true,
    default: false,
  },
  responsible: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Users",
    },
    required: false,
    validate: {
      validator: function (v) {
        return /^([0-9a-fA-F]{24}|null)$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid room responsible reference format!`,
    },
  },
  room_type: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "RoomTypes",
    },
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid room type reference format!`,
    },
  },
  resources: {
    type: Array,
    required: false,
  },
  image_url: {
    type: String,
    required: false,
    default: null,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    required: true,
    default: "active",
    validate: {
      validator: function (v) {
        return /^(active|inactive|terminated)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid status!`,
    },
  },
});

module.exports = Rooms = mongoose.model("Rooms", RoomsSchema);
