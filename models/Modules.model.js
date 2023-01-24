const mongoose = require("mongoose");

const ModulesSchema = new mongoose.Schema({
  module_name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // accept only letters, numbers, symbols, spaces, and dashes
        return /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{3,100}$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid module name!`,
    },
  },
  module_description: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
    default: null,
    validate: {
      validator: function (v) {
        return /^([1-5]{1}|null)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid module year!`,
    },
  },
  module_code: {
    type: String,
    required: false,
    default: null,
    // validate: {
    //   validator: function (v) {
    //     return /^([a-zA-Z]{1}[0-9]{4}|null)$/.test(v);
    //   },
    //   message: (props) => `${props.value} is not a valid module code!`,
    // },
  },
  department: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Departments",
    },
    required: false,
    default: null,
    validate: {
      validator: function (v) {
        return /^([0-9a-fA-F]{24}|null)$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid department reference format!`,
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

module.exports = Modules = mongoose.model("Modules", ModulesSchema);
