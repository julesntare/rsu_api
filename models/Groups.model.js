const mongoose = require("mongoose");

const GroupsSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true,
    unique: true,
    validation: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ()]{2,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid group name!`,
    },
  },
  group_description: {
    type: String,
    required: false,
  },
  group_year: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^[1-5]{1}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid group year!`,
    },
  },
  department: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Departments",
    },
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid department reference format!`,
    },
  },
  class_presenter: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Users",
    },
    required: false,
    default: null,
    validate: {
      validator: function (v) {
        // accept reference or null
        return /^([0-9a-fA-F]{24}|null)$/.test(v) || v === null;
      },
      message: (props) =>
        `${props.value} is not a valid class presenter reference format!`,
    },
  },
  class_size: {
    type: Number,
    required: false,
    default: null,
    validate: {
      validator: function (v) {
        // accept also a null value
        return /^([0-9]{1,5}|null)$/.test(v) || v === null;
      },
      message: (props) => `${props.value} is not a valid class size!`,
    },
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

module.exports = Groups = mongoose.model("Groups", GroupsSchema);
