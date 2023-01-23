const mongoose = require("mongoose");
const RolesModel = require("../models/Roles.model");
const UsersModel = require("../models/Users.model");

exports.getAllUsers = async (_req, res) => {
  // find active and order by added_on
  UsersModel.find({
    status: "active",
  })
    .sort({ added_on: -1 })
    .then((user) => {
      const promises = user.map(async (u) => {
        // get role object for each user from roles model
        const roleObj = await RolesModel.findById(
          mongoose.Types.ObjectId(u.user_role)
        ).catch((err) => {
          res
            .status(400)
            .json({ message: "Invalid user role", error: err.message });
        });

        return {
          ...u._doc,
          user_role: roleObj,
        };
      });

      Promise.all(promises).then((results) => res.status(200).json(results));
    })
    .catch((err) =>
      res.status(404).json({ message: "No User not found", error: err.message })
    );
};

exports.getUserById = async (req, res) => {
  UsersModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((user) => res.status(200).json(user))
    .catch((err) =>
      res.status(404).json({ message: "User not found", error: err.message })
    );
};

exports.updateUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "User content can not be empty",
    });
  }

  UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    fullname: req.body.fullname,
    username: req.body.username,
    status: req.body.status,
  })
    .then((user) => res.status(200).json(user))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid user object", error: err.message })
    );
};

exports.changeStatus = async (req, res) => {
  UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: req.body.status,
  })
    .then((_response) =>
      res
        .status(204)
        .json({ result: "success", message: "User status updated" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid user object", error: err.message })
    );
};

exports.updateUserRole = async (req, res) => {
  UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    role_id: req.body.role_id,
  })
    .then((_response) =>
      res.status(204).json({ result: "success", message: "User role updated" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid user object", error: err.message })
    );
};

exports.getUserByRole = async (req, res) => {
  UsersModel.find({
    role_id: req.params.role_id,
  })
    .then((user) => res.status(200).json(user))
    .catch((err) =>
      res.status(404).json({ message: "No User not found", error: err.message })
    );
};

exports.createUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "User content can not be empty",
    });
  }

  const newUser = new UsersModel({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    mobile_no: req.body.mobile_no,
    user_role: req.body.user_role,
    added_on: Date.now(),
    status: req.body.status,
  });

  newUser
    .save()
    .then((user) => res.status(201).json(user))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid user object", error: err.message })
    );
};

exports.deleteUser = async (req, res) => {
  UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: "inactive",
  })
    .then((_response) =>
      res.status(204).json({ result: "success", message: "User removed" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid user object", error: err.message })
    );
};

exports.changePassword = async (req, res) => {
  // check if new password and confirm password are same
  if (req.body.new_password !== req.body.confirm_password) {
    return res.status(400).json({
      message: "New password and confirm password are not same",
    });
  }

  // check if the user exists
  UsersModel.findById(mongoose.Types.ObjectId(req.params.id)).then((user) => {
    if (!user) {
      // check if current password is correct
      if (user.password !== req.body.current_password) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
        password: req.body.password,
      })
        .then((_response) =>
          res
            .status(204)
            .json({ result: "success", message: "User password updated" })
        )
        .catch((err) =>
          res
            .status(400)
            .json({ message: "Invalid user object", error: err.message })
        );
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

exports.changeRole = async (req, res) => {
  // check if the user exists
  UsersModel.findById(mongoose.Types.ObjectId(req.params.id)).then((user) => {
    if (!user) {
      UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
        user_role: req.body.role_id,
      })
        .then((_response) =>
          res
            .status(200)
            .json({ result: "success", message: "User role updated" })
        )
        .catch((err) =>
          res
            .status(400)
            .json({ message: "Invalid user object", error: err.message })
        );
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

exports.changeUsername = async (req, res) => {
  // check if the user exists
  UsersModel.findById(mongoose.Types.ObjectId(req.params.id)).then((user) => {
    if (!user) {
      UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
        username: req.body.username,
      })
        .then((_response) =>
          res
            .status(200)
            .json({ result: "success", message: "Username updated" })
        )
        .catch((err) =>
          res
            .status(400)
            .json({ message: "Invalid user object", error: err.message })
        );
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

exports.changeEmail = async (req, res) => {
  // check if the user exists
  UsersModel.findById(mongoose.Types.ObjectId(req.params.id)).then((user) => {
    if (!user) {
      UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
        email: req.body.email,
      })
        .then((_response) =>
          res.status(200).json({ result: "success", message: "Email updated" })
        )
        .catch((err) =>
          res
            .status(400)
            .json({ message: "Invalid user object", error: err.message })
        );
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

exports.changePhone = async (req, res) => {
  // check if the user exists
  UsersModel.findById(mongoose.Types.ObjectId(req.params.id)).then((user) => {
    if (!user) {
      UsersModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
        mobile_no: req.body.mobile_no,
      })
        .then((_response) =>
          res
            .status(200)
            .json({ result: "success", message: "User Mobile Number changed" })
        )
        .catch((err) =>
          res
            .status(400)
            .json({ message: "Invalid user object", error: err.message })
        );
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

exports.searchUserByAny = async (req, res) => {
  UsersModel.find({
    $or: [
      { fullname: { $regex: req.params.query, $options: "i" } },
      { username: { $regex: req.params.query, $options: "i" } },
      { email: { $regex: req.params.query, $options: "i" } },
      { mobile_no: { $regex: req.params.query, $options: "i" } },
    ],
  })
    .then((users) => {
      if (!users) {
        res.status(404).json({ message: "No users found" });
      } else {
        res.status(200).json(users);
      }
    })
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid user object", error: err.message })
    );
};
