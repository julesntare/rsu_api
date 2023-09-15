const mongoose = require("mongoose");

const BuildingsSchema = mongoose.Schema({
  building_name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]{3,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid building name!`,
    },
  },
  building_description: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9, ]{0,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid building description!`,
    },
  },
  floors: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^[1-9]{1,2}$/.test(v);
      },
      message: (props) => `${props.value} is not valid floors number`,
    },
  },
  coordinates: {
    type: Array,
    required: false,
    validate: {
      validator: function (v) {
        // validate array of lat and long coordinates
        return /^\[(?:(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)),(\s?)(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)(?:\|(?:(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?),(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)))*\]$/.test(
          JSON.stringify(v)
        );
      },
      message: (props) => `${props.value} is not a valid building location!`,
    },
  },
  near_locations: {
    type: Array,
    required: false,
  },
  img_url: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/.*\.(?:png|jpg))|(null)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid image url!`,
    },
    default: null,
  },
  added_on: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    required: false,
    default: "active",
    validate: {
      validator: function (v) {
        return /^(active|inactive|terminated)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid status!`,
    },
  },
});

module.exports = Buildings = mongoose.model("Buildings", BuildingsSchema);
