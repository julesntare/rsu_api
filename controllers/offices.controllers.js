const mongoose = require("mongoose");
const BuildingsModel = require("../models/Buildings.model");
const OfficesModel = require("../models/Offices.model");
const UsersModel = require("../models/Users.model");

exports.getAllOffices = async (_req, res) => {
  OfficesModel.find({
    status: "active",
  })
    .populate("office_building_location")
    .populate("responsible")
    .then((offices) => res.status(200).json(offices))
    .catch((err) =>
      res.status(404).json({ message: "Offices not found", error: err.message })
    );
};

exports.getOfficeById = async (req, res) => {
  OfficesModel.findById(mongoose.Types.ObjectId(req.params.id))
    .then((office) => res.status(200).json(office))
    .catch((err) =>
      res.status(404).json({ message: "Office not found", error: err.message })
    );
};

exports.createOffice = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Office content can not be empty",
    });
  }

  // check if building id, office_type, responsible are available
  const building = await BuildingsModel.findById({
    _id: mongoose.Types.ObjectId(req.body.office_building_location),
  }).catch((err) => {
    res
      .status(400)
      .json({ message: "Invalid building id", error: err.message });
  });

  const responsible = await UsersModel.findById({
    _id: mongoose.Types.ObjectId(req.body.responsible),
  }).catch((err) => {
    res
      .status(400)
      .json({ message: "Invalid responsible id", error: err.message });
  });

  if (!building || !responsible) {
    return res.status(400).json({
      message: "Invalid building, room type or responsible user",
    });
  }

  const newOffice = new OfficesModel({
    office_name: req.body.office_name,
    office_description: req.body.office_description,
    office_type: req.body.office_type,
    office_building_location: req.body.office_building_location,
    building_floor: req.body.building_floor,
    coordinates: req.body.coordinates || [0, 0],
    capacity: req.body.capacity,
    responsible: req.body.responsible,
    schedules: req.body.schedules,
    img_url: req.body.img_url || null,
    added_on: Date.now(),
  });

  newOffice
    .save()
    .then((_office) =>
      res.status(201).json({ message: "Office created", statusCode: 201 })
    )
    .catch((err) =>
      res.status(400).json({
        message: "Invalid office object",
        statusCode: 400,
        error: err.message,
      })
    );
};

exports.removeOffice = async (req, res) => {
  OfficesModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {
    status: "inactive",
  })
    .then((_response) =>
      res
        .status(204)
        .json({ result: "success", statusCode: 204, message: "Office removed" })
    )
    .catch((err) =>
      res.status(400).json({
        message: "Invalid office object",
        statusCode: 400,
        error: err.message,
      })
    );
};
