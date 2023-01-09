const mongoose = require("mongoose");
const BuildingsModel = require("../models/Buildings.model");
const RoomModel = require("../models/Rooms.model");
const RoomTypesModel = require("../models/RoomTypes.model");
const UsersModel = require("../models/Users.model");

exports.getAllRooms = async (_req, res) => {
  RoomModel.find({
    status: "active",
  })
    .then((room) => res.status(200).json(room))
    .catch((err) =>
      res.status(404).json({ message: "No Room not found", error: err.message })
    );
};

exports.getRoomById = async (req, res) => {
  RoomModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((room) => res.status(200).json(room))
    .catch((err) =>
      res.status(404).json({ message: "Room not found", error: err.message })
    );
};

exports.createRoom = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Room content can not be empty",
    });
  }

  // check if building id, room_type, responsible are available
  const building = await BuildingsModel.findById({
    _id: mongoose.Types.ObjectId(req.body.room_building),
  }).catch((err) => {
    res
      .status(400)
      .json({ message: "Invalid building id", error: err.message });
  });

  const roomType = await RoomTypesModel.findById({
    _id: mongoose.Types.ObjectId(req.body.room_type),
  }).catch((err) => {
    res
      .status(400)
      .json({ message: "Invalid room type id", error: err.message });
  });

  const responsible = await UsersModel.findById({
    _id: mongoose.Types.ObjectId(req.body.responsible),
  }).catch((err) => {
    res
      .status(400)
      .json({ message: "Invalid responsible id", error: err.message });
  });

  if (!building || !roomType || !responsible) {
    return res.status(400).json({
      message: "Invalid building, room type or responsible user",
    });
  }

  const newRoom = new RoomModel({
    room_name: req.body.room_name,
    room_description: req.body.room_description,
    room_type: req.body.room_type,
    room_building: req.body.room_building,
    room_floor: req.body.room_floor,
    capacity: req.body.capacity,
    resources: req.body.resources,
    has_fixed_seats: req.body.has_fixed_seats,
    responsible: req.body.responsible,
    added_on: Date.now(),
  });

  newRoom
    .save()
    .then((room) => res.status(201).json(room))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid room object", error: err.message })
    );
};

exports.removeRoom = async (req, res) => {
  RoomModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: "inactive",
  })
    .then((_response) =>
      res.status(204).json({ result: "success", message: "Room removed" })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Invalid room object", error: err.message })
    );
};
