const mongoose = require("mongoose");
const moment = require("moment-timezone");
const BookingsSchema = require("../models/Bookings.model");
const UserSchema = require("../models/Users.model");
const RoomSchema = require("../models/Rooms.model");

moment.tz.setDefault("Africa/Kigali");

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

exports.getRoomStatus = async (req, res) => {
  const roomId = req.params.id;
  const now = moment(new Date()).valueOf();

  // 1. search where room_id is equal to roomId and status is confirmed
  // 2. iterate through each activity's activity.recurrence if it is weekly or monthly or certain_days according to activity.activity_days array
  // 3. check if activity_starting_date is equal to today
  // 4. iterate through activity.activity_time check if now is between two string time range
  // 5. if yes, return room is busy

  BookingsSchema.find({
    room: roomId,
    status: "confirmed",
  })
    .then((bookings) => {
      bookings.map(async (booking) => {
        if (booking.activity.activity_recurrence === "once") {
          // check if activity_starting_date is equal to today
          const activityStartingDate = new Date(
            booking.activity.activity_starting_date
          );
          if (activityStartingDate === new Date().toISOString().slice(0, 10)) {
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
                return {
                  ...booking._doc,
                  room_status: 0,
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
          const activityStartingDate = booking.activity.activity_starting_date;
          if (activityStartingDate === new Date().toISOString().split("T")[0]) {
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
                return res.status(200).json({
                  room_status: 0,
                  timeRange: [
                    `${activityStartingDate}T${time[0]}`,
                    `${activityStartingDate}T${time[1]}`,
                  ],
                });
              }
              return res.status(200).json({
                room_status: 1,
                timeRange: [
                  `${activityStartingDate}T${time[0]}`,
                  `${activityStartingDate}T${time[1]}`,
                ],
              });
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
                  return res.status(200).json({
                    room_status: 0,
                    timeRange: [
                      `${activityStartingDate}T${time[0]}`,
                      `${activityStartingDate}T${time[1]}`,
                    ],
                  });
                }
                return res.status(200).json({
                  room_status: 1,
                  timeRange: [
                    `${activityStartingDate}T${time[0]}`,
                    `${activityStartingDate}T${time[1]}`,
                  ],
                });
              });
            }
          });
        }
      });
    })
    .catch((err) =>
      res.status(404).json({ message: "Booking not found", error: err.message })
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
