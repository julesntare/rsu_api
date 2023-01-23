const mongoose = require("mongoose");
const BuildingsModel = require("../models/Buildings.model");
const RoomModel = require("../models/Rooms.model");
const RoomTypesModel = require("../models/RoomTypes.model");
const UsersModel = require("../models/Users.model");

exports.getAllRooms = async (_req, res) => {
  RoomModel.find({
    status: "active",
  })
    .sort({ added_on: -1 })
    .then((room) => {
      // get all info on each room_building, responsible, and room_type
      const promises = room.map(async (r) => {
        const building = await BuildingsModel.findById(
          mongoose.Types.ObjectId(r.room_building)
        ).catch((err) => {
          res.status(400).json({
            message: "Invalid building id",
            statusCode: 400,
            error: err.message,
          });
        });

        const roomType = await RoomTypesModel.findById(
          mongoose.Types.ObjectId(r.room_type)
        ).catch((err) => {
          res.status(400).json({
            message: "Invalid room type id",
            statusCode: 400,
            error: err.message,
          });
        });

        const responsible = await UsersModel.findById(
          mongoose.Types.ObjectId(r.responsible)
        ).catch((err) => {
          res.status(400).json({
            message: "Invalid responsible id",
            statusCode: 400,
            error: err.message,
          });
        });

        return {
          ...r._doc,
          room_building: building,
          room_type: roomType,
          responsible: responsible,
        };
      });

      Promise.all(promises).then((results) => res.json(results));
    })
    .catch((err) =>
      res.status(404).json({
        message: "No Room not found",
        statusCode: 404,
        error: err.message,
      })
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
      statusCode: 400,
    });
  }

  // check if building id, room_type, responsible are available
  const building = await BuildingsModel.findById({
    _id: mongoose.Types.ObjectId(req.body.room_building),
  }).catch((err) => {
    res.status(400).json({
      message: "Invalid building id",
      statusCode: 400,
      error: err.message,
    });
  });

  const roomType = await RoomTypesModel.findById({
    _id: mongoose.Types.ObjectId(req.body.room_type),
  }).catch((err) => {
    res.status(400).json({
      message: "Invalid room type id",
      statusCode: 400,
      error: err.message,
    });
  });

  const responsible = await UsersModel.findById({
    _id: mongoose.Types.ObjectId(req.body.responsible),
  }).catch((err) => {
    res.status(400).json({
      message: "Invalid responsible id",
      statusCode: 400,
      error: err.message,
    });
  });

  if (!building || !roomType || !responsible) {
    return res.status(400).json({
      message: "Invalid building, room type or responsible user",
      statusCode: 400,
    });
  }

  console.log(building.floors, req.body.room_floor);
  // check if floor is equal to building floor
  if (building.floors - 1 < req.body.room_floor) {
    return res.status(400).json({
      message: "Room Floor has to be equal or less to building's total floor",
      statusCode: 400,
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
    .then((_room) =>
      res
        .status(201)
        .json({ message: "Added Room Successfully", statusCode: 201 })
    )
    .catch((err) =>
      res.status(400).json({
        message: "Invalid room object",
        statusCode: 400,
        error: err.message,
      })
    );
};

exports.removeRoom = async (req, res) => {
  RoomModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: "inactive",
  })
    .then((_response) =>
      res
        .status(204)
        .json({ result: "success", statusCode: 204, message: "Room removed" })
    )
    .catch((err) =>
      res.status(400).json({
        message: "Invalid room object",
        statusCode: 400,
        error: err.message,
      })
    );
};
