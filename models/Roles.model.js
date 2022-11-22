const mongoose = require("mongoose");

const RolesSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (v) {
            return /^[a-zA-Z0-9 ]{4,20}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid role name!`,
        },
    },
    role_description: {
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
        }
    },
});

module.exports = Roles = mongoose.model("Roles", RolesSchema);