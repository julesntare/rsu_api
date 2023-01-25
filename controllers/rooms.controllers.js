const mongoose = require("mongoose");
const moment = require("moment-timezone");
const BookingsModel = require("../models/Bookings.model");
const BuildingsModel = require("../models/Buildings.model");
const RoomsModel = require("../models/Rooms.model");
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

        const roomStatusObj = await getRoomStatus(r._id.toString());

        return {
          ...r._doc,
          room_building: building,
          room_type: roomType,
          responsible: responsible,
          room_status: roomStatusObj,
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
  let rooms = [],
    building_id = null;
  for (let i = 0; i < req.body.length; i++) {
    // check building id by building name (search includes name keywords)
    if (req.body[i].room_building !== null) {
      const building = await BuildingsModel.findOne({
        building_name: { $regex: req.body[i].room_building, $options: "i" },
      }).catch((err) => {
        res.status(400).json({
          message: "Invalid building name",
          statusCode: 400,
          error: err.message,
        });
      });

      if (building) {
        building_id = building._id;
      }
    }

    rooms.push({
      room_name: req.body[i].room_name,
      room_building: building_id,
      room_floor: req.body[i].room_floor,
      capacity: req.body[i].capacity,
      has_fixed_seats: req.body[i].has_fixed_seats,
      room_type: req.body[i].room_type,
    });
  }

  RoomsModel.insertMany(rooms)
    .then((room) => res.status(201).json({ message: "Room created" }))
    .catch((err) =>
      res.status(400).json({
        message: "Room not created",
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

const getRoomStatus = async (roomId) => {
  const now = moment(new Date()).valueOf();
  let result = {
    value: 1,
    timeRange: [],
  };

  await BookingsModel.find({
    room: roomId,
    status: "confirmed",
  })
    .then((bookings) => {
      // check if bookings array is empty
      if (bookings.length > 0) {
        result = {
          value: 1,
          timeRange: [],
        };
        bookings.map(async (booking) => {
          if (booking.activity.activity_recurrence === "once") {
            // check if activity_starting_date is equal to today
            const activityStartingDate = new Date(
              booking.activity.activity_starting_date
            );
            if (
              activityStartingDate === new Date().toISOString().slice(0, 10)
            ) {
              const activityTime = booking.activity.activity_time;
              // iterate in activity time array
              activityTime.forEach((time) => {
                // check if now is between timestamps of ["08:00", "10:00"]	time format
                const activityTimeStart = new Date(
                  `1970-01-01T${time[0]}`
                ).getTime();
                const activityTimeEnd = new Date(
                  `1970-01-01T${time[1]}`
                ).getTime();
                if (now >= activityTimeStart && now <= activityTimeEnd) {
                  result = {
                    value: 0,
                    timeRange: [
                      `${activityStartingDate}T${time[0]}`,
                      `${activityStartingDate}T${time[1]}`,
                    ],
                  };
                }
              });
            }
          } else if (
            booking.activity.activity_recurrence === "weekly" ||
            booking.activity.activity_recurrence === "monthly" ||
            booking.activity.activity_recurrence === "certain_days"
          ) {
            // check if activity_starting_date is equal to today
            const activityStartingDate =
              booking.activity.activity_starting_date;
            if (
              activityStartingDate === new Date().toISOString().split("T")[0]
            ) {
              const activityTime = booking.activity.activity_time;
              // iterate in activity time array
              activityTime.forEach((time) => {
                // check if now is between timestamps of ["08:00", "10:00"]	time format
                const activityTimeStart = new Date(
                  `${activityStartingDate}T${time[0]}`
                ).getTime();
                const activityTimeEnd = new Date(
                  `${activityStartingDate}T${time[1]}`
                ).getTime();
                if (now >= activityTimeStart && now <= activityTimeEnd) {
                  console.log(activityStartingDate);
                  result = {
                    value: 0,
                    timeRange: [
                      `${activityStartingDate}T${time[0]}`,
                      `${activityStartingDate}T${time[1]}`,
                    ],
                  };
                }
              });
            }
            // iterate through activity.activity_days array by increasing starting date by day specified in activity.activity_days array till activity.activity_ending_date
            activityDays = booking.activity.activity_days;
            activityDays.forEach((day) => {
              // check if starting date weekly|monthly is equal to day
              const today = new Date(
                // if weekly, add 7 days to starting date
                booking.activity.activity_recurrence === "weekly"
                  ? new Date(booking.activity.activity_starting_date).setDate(
                      new Date(
                        booking.activity.activity_starting_date
                      ).getDate() + 7
                    )
                  : // if monthly, add 30 days to starting date
                  booking.activity.activity_recurrence === "monthly"
                  ? new Date(booking.activity.activity_starting_date).setDate(
                      new Date(
                        booking.activity.activity_starting_date
                      ).getDate() + 30
                    )
                  : // if certain_days, add day to starting date
                    new Date(booking.activity.activity_starting_date).setDate(
                      new Date(
                        booking.activity.activity_starting_date
                      ).getDate() + day
                    )
              ).getDay();
              if (today === day) {
                // iterate through activity.activity_time check if now is between two string time range
                const activityTime = booking.activity.activity_time;
                // iterate in activity time array
                activityTime.forEach((time) => {
                  // check if now is between timestamps of ["08:00", "10:00"]	time format
                  const activityTimeStart = new Date(
                    `1970-01-01T${time[0]}`
                  ).getTime();
                  const activityTimeEnd = new Date(
                    `1970-01-01T${time[1]}`
                  ).getTime();
                  if (now >= activityTimeStart && now <= activityTimeEnd) {
                    result = {
                      value: 0,
                      timeRange: [
                        `${activityStartingDate}T${time[0]}`,
                        `${activityStartingDate}T${time[1]}`,
                      ],
                    };
                  }
                });
              }
            });
          }
        });
      }
    })
    .catch((err) => console.log(err));

  return result;
};
