const mongoose = require("mongoose");
const RoomTypeModel = require("../models/RoomTypes.model");

exports.getAllRoomTypes = async (_req, res) => {
  RoomTypeModel.find({
    status: "active",
  })
    .then((roomType) => res.status(200).json(roomType))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "No RoomType not found", error: err.message })
    );
};

exports.getRoomTypeById = async (req, res) => {
  RoomTypeModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((roomType) => res.status(200).json(roomType))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "RoomType not found", error: err.message })
    );
};

exports.createRoomType = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "RoomType content can not be empty",
    });
  }

  const newRoomType = new RoomTypeModel({
    room_type_name: req.body.room_type_name.toLowerCase(),
    room_type_description: req.body.room_type_description,
    added_on: Date.now(),
    status: req.body.status,
  });

  newRoomType
    .save()
    .then((roomType) => res.status(201).json(roomType))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid roomType object", error: err.message })
    );
};

exports.removeRoomType = async (req, res) => {
  RoomTypeModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: "inactive",
  })
    .then((_response) =>
      res.status(204).json({ result: "success", message: "RoomType removed" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid roomType object", error: err.message })
    );
};

exports.modifyRoomType = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "RoomType content can not be empty",
    });
  }

  RoomTypeModel.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    {
      $set: { ...req.body },
    }
  )
    .then((roomType) => res.status(200).json({ status: "success", message: "RoomType updated", roomType }))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid roomType object", error: err.message })
    );
};
