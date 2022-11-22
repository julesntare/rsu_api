const mongoose = require("mongoose");

const DepartmentsSchema = new mongoose.Schema({
  department_name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]{2,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid department name!`,
    }
  },
  department_description: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]{2,256}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid department description!`,
    }
  },
  department_head: {
    type: String,
    required: false,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Users",
    },
    validate: {
        validator: function (v) {
          return /^[0-9a-fA-F]{24}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid department head!`,
      }
  },
  office_location: {
    type: Array,
    required: true,
    validate: {
      validator: function (v) {
        // validate array of lat and long coordinates
        let latitude = "(?:(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)";
        let longitude = "(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?))(?:\|(?:(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?),(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)))*";

        return new RegExp(`^\[${latitude},(\s?)${longitude}]$`).test(v);
      },
      message: (props) => `${props.value} is not a valid office location!`,
    }
  },
  near_locations: {
    type: Array,
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
    }
  },
});

module.exports = Departments = mongoose.model("Departments", DepartmentsSchema);
