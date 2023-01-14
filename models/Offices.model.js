const mongoose = require("mongoose");

const OfficesSchema = new mongoose.Schema({
  office_name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]{3,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid office name!`,
    },
  },
  office_description: {
    type: String,
    required: false,
  },
  office_building_location: {
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
      message: (props) =>
        `${props.value} is not a valid building reference format!`,
    },
  },
  building_floor: {
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
      message: (props) => `${props.value} is not a valid office location!`,
    },
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
      message: (props) =>
        `${props.value} is not a valid room responsible reference format!`,
    },
  },
  office_type: {
    type: String,
    enum: ["private", "shared", "open", "hot_desk"],
    required: true,
    validate: {
      validator: function (v) {
        return /^(private|shared|open|hot_desk)$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid office type! (private, shared, open, hot_desk)`,
    },
  },
  capacity: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{1,2}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid office capacity!`,
    },
  },
  working_days: {
    type: Array,
    required: true,
    validate: {
      validator: function (v) {
        // use numbers 1 to 7 to represent days of the week
        return /^\[(?:[1-7])(?:\,([1-7]))*\]$/.test(JSON.stringify(v));
      },
      message: (props) => `${props.value} is not a valid working days!`,
    },
  },
  working_hours: {
    type: Array,
    required: true,
    validate: {
      validator: function (v) {
        // use ["08:00", "17:00"] format
        return /^\[(?:"[0-2][0-9]:[0-5][0-9]")(?:\,("[0-2][0-9]:[0-5][0-9]"))*\]$/.test(
          JSON.stringify(v)
        );
      },
      message: (props) => `${props.value} is not a valid working hours!`,
    },
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

module.exports = Offices = mongoose.model("Offices", OfficesSchema);
