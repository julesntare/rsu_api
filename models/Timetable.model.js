const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  weeks_range: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{1,2}(-|,| |:)\d{1,2}$/.test(v);
      },
      message: props => `${props.value} is not a valid week range!`
    }
  },
  duration: {
    type: Array,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{1,2}(:)\d{1,2}$/.test(v);
      },
      message: props => `${props.value} is not a valid duration!`
    }
  },
  activity: {
    type: String,
    required: true,
    default: "Learning",
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9 ]{3,100}$/.test(v);
      },
      message: props => `${props.value} is not a valid activity name!`
    }
  },
  room: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Rooms",
    },
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: props => `${props.value} is not a valid room reference format!`
    }
  },
  group: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Groups",
    },
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: props => `${props.value} is not a valid group reference format!`
    }
  },
  manager: {
    type: String,
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      model: "Users",
    },
    required: false,
    validate: {
      validator: function(v) {
        return /^[0-9a-fA-F]{24}$/.test(v);
      },
      message: props => `${props.value} is not a valid user reference format!`
    }
  },
  kin_contacts: {
    type: Array,
    required: false,
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

module.exports = Timetable = mongoose.model("Timetable", TimetableSchema);
