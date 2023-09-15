const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // add also symbols like . and ' to the name
        return /^[A-Za-z .'-]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,3}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  title: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z ]{3,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid title!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(v);
      },
      message: (props) =>
        `${props.value} password must include: >= 6 chars, at least one upperCase, one lowerCase, one symbol and one number`,
    },
  },
  mobile_no: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^(07|2507|\+2507)(9|8|3|2)[0-9]{7}$/g.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  user_role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roles",
    default: null,
    validate: {
      validator: function (v) {
        return /^([0-9a-fA-F]{24}|null)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid role!`,
    },
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    default: null,
    validate: {
      validator: function (v) {
        return /^([0-9a-fA-F]{24}|null)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid department reference!`,
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
