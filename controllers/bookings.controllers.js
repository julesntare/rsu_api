const mongoose = require("mongoose");
const BookingsSchema = require("../models/Bookings.model");
const UserSchema = require("../models/Users.model");
const RoomSchema = require("../models/Rooms.model");

exports.getAllBookings = async (_req, res) => {
  BookingsSchema.find({
    // get bookings where activity.activity_starting_date is greater or equal to today and status is confirmed
    "activity.activity_starting_date": {
      $gte: new Date().toISOString().slice(0, 10),
    },
    status: "confirmed",
  })
    .then((booking) => res.json(booking))
    .catch((err) =>
      res.status(404).json({ message: "Booking not found", error: err.message })
    );
};

exports.getAnyBookings = async (_req, res) => {
  BookingsSchema.find()
    .then((booking) => res.json(booking))
    .catch((err) =>
      res.status(404).json({ message: "Booking not found", error: err.message })
    );
};

exports.getBookingById = async (req, res) => {
  BookingsSchema.findById(req.params.id)
    .then((booking) => res.json(booking))
    .catch((err) =>
      res
        .status(404)
        .json({ message: "No Booking not found", error: err.message })
    );
};

exports.createBooking = async (req, res) => {
  // check if req.body.activity.activity_recurrence is set on one value instead of once | weekly | monthly | certain_days
  if (
    req.body.activity.activity_recurrence !== "once" &&
    req.body.activity.activity_recurrence !== "weekly" &&
    req.body.activity.activity_recurrence !== "monthly" &&
    req.body.activity.activity_recurrence !== "certain_days"
  ) {
    return res.status(400).json({
      message:
        "Activity reccurence is not set correctly, choose one recurrence.",
    });
  }

  //   check if req.body.activity.activity_starting_date with format YYYY-MM-DD is today or future date
  const today = new Date().toISOString().slice(0, 10);
  const activityStartingDate = new Date(
    req.body.activity.activity_starting_date
  )
    .toISOString()
    .slice(0, 10);
  if (activityStartingDate < today) {
    return res.status(400).json({
      message:
        "Activity starting date is not set correctly, choose today or future date.",
    });
  }

  //   check if req.body.activity.activity_ending_date is greater or equal to req.body.activity.activity_starting_date
  const activityEndingDate = new Date(req.body.activity.activity_ending_date)
    .toISOString()
    .slice(0, 10);
  if (activityEndingDate < activityStartingDate) {
    return res.status(400).json({
      message:
        "Activity ending date is not set correctly, choose date greater or equal to starting date.",
    });
  }

  //   check for every occurence cases and save in recurring_date array
  let recurring_date = [];
  if (req.body.activity.activity_recurrence === "once") {
    recurring_date.push({
      user_id: req.body.user_id,
      all_authorized:
        req.body.all_authorized === undefined ||
        req.body.all_authorized.length === 0
          ? [req.body.user_id]
          : req.body.all_authorized.includes(req.body.user_id)
          ? req.body.all_authorized
          : [req.body.user_id, ...req.body.all_authorized],
      activity: {
        ...req.body.activity,
        activity_days: null,
        activity_recurring_date: req.body.activity.activity_starting_date,
      },
      room: req.body.room,
      additional_info:
        req.body.additional_info === undefined
          ? null
          : req.body.additional_info,
    });
  } else if (req.body.activity.activity_recurrence === "weekly") {
    // save for every +7 days starting from activity_starting_date to activity_ending_date an store result in recurring_date on every activity_days
    const activityStartingDate = new Date(
      req.body.activity.activity_starting_date
    );
    const activityEndingDate = new Date(req.body.activity.activity_ending_date);
    const activityDays = req.body.activity.activity_days;
    for (let i = 0; i < activityDays.length; i++) {
      for (
        let j = activityStartingDate;
        j <= activityEndingDate;
        j.setDate(j.getDate() + 7)
      ) {
        if (j.getDay() != activityDays[i]) continue;
        recurring_date.push({
          user_id: req.body.user_id,
          all_authorized:
            req.body.all_authorized === undefined ||
            req.body.all_authorized.length === 0
              ? [req.body.user_id]
              : req.body.all_authorized.includes(req.body.user_id)
              ? req.body.all_authorized
              : [req.body.user_id, ...req.body.all_authorized],
          activity: {
            ...req.body.activity,
            activity_days: activityDays[i],
            activity_recurring_date: j.toISOString().slice(0, 10),
          },
          room: req.body.room,
          additional_info:
            req.body.additional_info === undefined
              ? null
              : req.body.additional_info,
        });
      }
    }
  } else if (req.body.activity.activity_recurrence === "monthly") {
    // save for every +30 days starting from activity_starting_date to activity_ending_date an store result in recurring_date on every activity_days and keep in mind month has 28, 29, 30 or 31 days
    const activityStartingDate = new Date(
      req.body.activity.activity_starting_date
    );
    const activityEndingDate = new Date(req.body.activity.activity_ending_date);
    const activityDays = req.body.activity.activity_days;
    for (let i = 0; i < activityDays.length; i++) {
      for (
        let j = activityStartingDate;
        j <= activityEndingDate;
        j.setDate(j.getDate() + 30)
      ) {
        recurring_date.push({
          user_id: req.body.user_id,
          all_authorized:
            req.body.all_authorized === undefined ||
            req.body.all_authorized.length === 0
              ? [req.body.user_id]
              : req.body.all_authorized.includes(req.body.user_id)
              ? req.body.all_authorized
              : [req.body.user_id, ...req.body.all_authorized],
          activity: {
            ...req.body.activity,
            activity_days: activityDays[i],
            activity_recurring_date: j.toISOString().slice(0, 10),
          },
          room: req.body.room,
          additional_info:
            req.body.additional_info === undefined
              ? null
              : req.body.additional_info,
        });
      }
    }
  } else if (req.body.activity.activity_recurrence === "certain_days") {
    // save for every day specified in activity_days
    const activityStartingDate = new Date(
      req.body.activity.activity_starting_date
    );
    const activityEndingDate = new Date(req.body.activity.activity_ending_date);
    const activityDays = req.body.activity.activity_days;
    for (let i = 0; i < activityDays.length; i++) {
      for (
        let j = activityStartingDate;
        j <= activityEndingDate;
        j.setDate(j.getDate() + 1)
      ) {
        recurring_date.push({
          user_id: req.body.user_id,
          all_authorized:
            req.body.all_authorized === undefined ||
            req.body.all_authorized.length === 0
              ? [req.body.user_id]
              : req.body.all_authorized.includes(req.body.user_id)
              ? req.body.all_authorized
              : [req.body.user_id, ...req.body.all_authorized],
          activity: {
            ...req.body.activity,
            activity_days: activityDays[i],
            activity_recurring_date: j.toISOString().slice(0, 10),
          },
          room: req.body.room,
          additional_info:
            req.body.additional_info === undefined
              ? null
              : req.body.additional_info,
        });
      }
    }
  }

  //   check if room is available for the requested time by checking if there is a booking with the same room_id and activity_recurring_date
  for (let i = 0; i < recurring_date.length; i++) {
    const room_id = recurring_date[i].room;
    const activity_recurring_date =
      recurring_date[i].activity.activity_recurring_date;
    const activity_days = recurring_date[i].activity.activity_days;

    const roomAvailability = await BookingsSchema.find({
      room: room_id,
      "activity.activity_recurring_date": activity_recurring_date,
      "activity.activity_days": activity_days,
    });

    if (roomAvailability.length > 0) {
      return res.status(400).json({
        message: "Room is not available for the requested time.",
      });
    }
  }

  //   save all recurring_date in database
  if (recurring_date.length === 0) {
    return res.status(400).json({
      message: "Your dates of booking and days aren't matching, observe well.",
    });
  }
  await BookingsSchema.insertMany(recurring_date)
    .then((result) => {
      res.status(201).json({
        message: "Booking created successfully.",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Booking could not be created.",
        error: err,
      });
    });
};
