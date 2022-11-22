const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z ]{2,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]{2,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid username!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v);
      },
      message: (props) => `${props.value} password must include: >= 8 chars, at least one upperCase, one lowerCase, one symbol and one number`,
    },
  },
  mobile_no: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\+?(0)*(?:250-)?(?:250)?(7)(8|9|2|3)[0-9]{7}(?!\S)$/g.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    }
  },
  user_role: {
    type: String,
    required: false,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Roles",
    },
    default: null,
    validate: {
      validator: function (v) {
        return /^[0-9a-fA-F]{24}|(null)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid role!`,
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

module.exports = Users = mongoose.model("Users", UsersSchema);
