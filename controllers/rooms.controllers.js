const mongoose = require("mongoose");
const RoomModel = require("../models/Rooms.model");

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

  const newRoom = new RoomModel({
    room_name: req.body.room_name,
    room_description: req.body.room_description,
    room_type: req.body.room_type,
    room_building: req.body.room_building,
    room_floor: req.body.room_floor,
    room_capacity: req.body.room_capacity,
    room_seats_arrangement: req.body.room_seats_arrangement,
    room_resources: req.body.room_resources,
    has_fixed_seats: req.body.has_fixed_seats,
    room_coordinates: req.body.room_coordinates,
    added_on: Date.now(),
    status: req.body.status,
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
