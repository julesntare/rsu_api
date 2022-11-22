const mongoose = require("mongoose");

const RoomsSchema = new mongoose.Schema({
  room_name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]{3,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid room name!`,
    },
  },
  room_description: {
    type: String,
    required: false,
  },
  building: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Buildings",
    },
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid building reference format!`,
    },
  },
  coordinates: {
    type: Array,
    required: false,
    validate: {
      validator: function (v) {
        // validate array of lat and long coordinates
        let latitude = "(?:(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)";
        let longitude = "(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?))(?:\|(?:(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?),(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)))*";

        return new RegExp(`^\[${latitude},(\s?)${longitude}]$`).test(v);
      },
      message: (props) => `${props.value} is not a valid room location format!`,
    }
  },
  capacity: {
    type: Number,
    required: false,
    validate: {
      validator: function (v) {
        return /^[1-9]{2,4}*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid room capacity!`,
    }
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
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid room responsible reference format!`,
    }
  },
  room_type: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "RoomTypes",
    },
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid room type reference format!`,
    }
  },
  resources: {
    type: Array,
    required: false,
  },
  image_url: {
    type: String,
    required: false,
    default: null,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid room image url!`,
    }
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
    }
  },
});

module.exports = Rooms = mongoose.model("Rooms", RoomsSchema);
