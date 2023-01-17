const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const ModulesModel = require("../models/Modules.model");
const RoomsModel = require("../models/Rooms.model");
const UsersModel = require("../models/Users.model");
const GroupsModel = require("../models/Groups.model");
const BookingsModel = require("../models/Bookings.model");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

exports.uploadCSV = async (req, res) => {
  // upload csv file and save it to uploads folder
  const timeTableFile = req.file;
  if (!timeTableFile) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // check if file is csv
  if (timeTableFile.mimetype !== "text/csv") {
    return res.status(400).json({ message: "File is not a csv" });
  }
  // check if file is empty
  if (timeTableFile.size === 0) {
    return res.status(400).json({ message: "File is empty" });
  }
  // check if file is bigger than 1MB
  if (timeTableFile.size > 1000000) {
    return res.status(400).json({ message: "File is too big" });
  }
  // check if file is smaller than 1KB
  if (timeTableFile.size < 1000) {
    return res.status(400).json({ message: "File is too small" });
  }

  // remove empty columns from a csv file, take first row as column names, take the existing file from timetableCsv folder
  // and save it to timetableCsv folder
  const fileExists = fs.existsSync(
    path.join(__dirname, `../timetableCsv/timetable_manip.csv`)
  );
  if (!fileExists) {
    return res.status(400).json({ message: "File does not exist" });
  }
  const csvFile = fs.createReadStream(
    path.join(__dirname, `../timetableCsv/timetable_manip.csv`)
  );
  const csvData = [];
  csvFile
    .pipe(csvParser())
    .on("data", (row) => {
      csvData.push(row);
    })
    .on("end", () => {
      const columnNames = Object.keys(csvData[0]);
      const emptyColumns = [],
        remainingColumns = [];
      columnNames.forEach((columnName) => {
        let empty = true;
        csvData.forEach((row) => {
          if (row[columnName] !== "") {
            empty = false;
          }
          //   remove column if column value == 'f' or 'N'
          if (row[columnName] === "f" || row[columnName] === "N") {
            empty = true;
            delete row[columnName];
          }
        });
        if (empty) {
          emptyColumns.push(columnName);
        } else {
          remainingColumns.push(columnName);
        }
      });
      emptyColumns.forEach((emptyColumn) => {
        csvData.forEach((row) => {
          delete row[emptyColumn];
        });
      });
      //   make object of remaining columns as key and as well as value an unshift it to csvData array
      const remainingColumnsObj = {};
      remainingColumns.forEach((column) => {
        remainingColumnsObj[column] = column;
      });
      csvData.unshift(remainingColumnsObj);

      //   save in csv and in json file called timetable_manip.json
      // check if first 3 cells of each row contains empty values, take the remaining non empty columns and combine each cell to the cell of row above, delete that row containing 3 empty cells and then save to json file
      const csvDataJson = [];
      for (let index = 0; index < csvData.length; index++) {
        if (index === 0) {
          csvDataJson.push(csvData[index]);
        } else {
          const rowValues = Object.values(csvData[index]);

          // check if first 3 cells of each row contains empty values
          const rowValuesEmpty = rowValues.every((value, index) => {
            if (index < 3) {
              return value === "";
            }
            return true;
          });

          // check if only first cell of each row contains empty values
          const rowValuesEmptyFirstCell = rowValues.every((value, index) => {
            if (index === 0) {
              return value === "";
            }
            return true;
          });

          // distribute that row's values to the row above
          if (rowValuesEmptyFirstCell) {
            const rowAbove = csvData[index - 1];
            const rowAboveKeys = Object.keys(rowAbove);
            rowAboveKeys.forEach((key, index) => {
              if (rowValues[index] !== "")
                rowAbove[key] = rowAbove[key] + ", " + rowValues[index];
            });
            // then delete that row containing first empty cell and point back to that row
            csvData.splice(index, 1);
            index--;
          } else if (rowValuesEmpty) {
            const rowAbove = csvData[index - 1];
            const rowAboveKeys = Object.keys(rowAbove);
            rowAboveKeys.forEach((key, index) => {
              if (rowValues[index] !== "")
                rowAbove[key] = rowAbove[key] + ", " + rowValues[index];
            });
            // then delete that row containing 3 empty cells and point back to that row
            csvData.splice(index, 1);
            index--;
          } else {
            csvDataJson.push(csvData[index]);
          }
        }
      }

      //   save to json file
      fs.writeFile(
        path.join(__dirname, `../timetableCsv/timetable_manip.json`),
        JSON.stringify(csvDataJson),
        (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
        }
      );

      const csvWriter = createCsvWriter({
        path: path.join(__dirname, `../timetableCsv/timetable_manip.csv`),
        header: remainingColumns,
      });
      csvWriter
        .writeRecords(csvData)
        .then(() => {
          return res.status(200).json({ message: "File saved successfully" });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    });
};

exports.getCSVData = async (req, res) => {
  // get first 10 rows from csv file
  const fileExists = fs.existsSync(
    path.join(__dirname, `../timetableCsv/timetable_manip.csv`)
  );
  if (!fileExists) {
    return res.status(400).json({ message: "File does not exist" });
  }
  const csvFile = fs.createReadStream(
    path.join(__dirname, `../timeTableCsv/timetable_manip.csv`)
  );
  const csvData = [];
  csvFile
    .pipe(csvParser())
    .on("data", (row) => {
      csvData.push(row);
    })
    .on("end", () => {
      const csvData10 = csvData.slice(0, 10);
      return res.status(200).json({ csvData10 });
    });
};

exports.saveTimetable = async (req, res) => {
  // save timetable to database
  const fileExists = fs.existsSync(
    path.join(__dirname, `../timetableCsv/timetable_manip.json`)
  );
  if (!fileExists) {
    return res.status(400).json({ message: "File does not exist" });
  }
  const timetableJson = fs.readFileSync(
    path.join(__dirname, `../timetableCsv/timetable_manip.json`)
  );
  const csvDataJson = JSON.parse(timetableJson);

  // a certain algorithm to manipulate the data and save it to database
  // skip first index of csvDataJson array because it contains column names
  // _Event field has this format of value: Mon 11:00am-02:00pm 1-13 (Mon is day, 11:00am-02:00pm is time, 1-13 is week range)
  // _Module has module name (but we have to search in database for module id if not found then add null)
  // _Room has room name with format: <building_name>_<room_name> (we have to search in database by splitting to get room_name only and get room id if not found then add null)
  // _StaffSurname and _StaffForenames fields must be combined and advanced search in database for user id if not found then add null
  // _Group has group name (but we have to search in database for group id if not found then add null)
  // save in bookings collection
  // start algorithm now
  try {
    const bookings = [];
    for (let index = 1; index < 2; index++) {
      const row = csvDataJson[index];
      const event = row._Event;
      const eventSplit = event.split(" ");
      const day = eventSplit[0];
      const time = eventSplit[1];
      const weekRange = eventSplit[2];

      const module = row._Module;
      const room = row._Room;
      const staff = row._StaffSurname + " " + row._StaffForenames;
      const group = row._Group;

      // get module id
      let moduleId = null;
      const moduleExists = await ModulesModel.findOne({
        module_name: module,
      });
      if (moduleExists) {
        moduleId = moduleExists._id;
      }

      // get room id
      const roomSplit = room.split("_");
      const roomName = roomSplit[1];
      const roomExists = await RoomsModel.findOne({
        room_name: roomName,
      });
      let roomId = null;
      if (roomExists) {
        roomId = roomExists._id;
      }

      // get staff id
      const staffExists = await UsersModel.findOne({
        // check if combined staff name is found in database even if it is not in the same order
        $or: [
          { fullname: staff },
          { fullname: staff.split(" ").reverse().join(" ") },
        ],
      });
      let staffId = null;
      if (staffExists) {
        staffId = staffExists._id;
      }

      // get group id
      const groupExists = await GroupsModel.findOne({ group_name: group });
      let groupId = null;
      if (groupExists) {
        groupId = groupExists._id;
      }

      // get week range
      const weekRangeSplit = weekRange.split("-");
      const weekStart = weekRangeSplit[0];
      const weekEnd = weekRangeSplit[1];

      // get time range
      const timeSplit = time.split("-");
      const timeStart = timeSplit[0];
      const timeEnd = timeSplit[1];

      // then you will store values in each week on every that day via booking collection
      for (let week = weekStart; week <= weekEnd; week++) {
        let startDate = new Date(req.body.starting_date);
        startDate.setDate(startDate.getDate() + (week - 1) * 7);
        let endDate = new Date(req.body.starting_date);
        endDate.setDate(endDate.getDate() + (weekEnd - 1) * 7);
        const booking = {
          user_id: "63bc283f2990ab07c1aebca0",
          all_authorized:
            // here we store staff id if available and group id if available
            staffId ? [staffId] : [],
          group_id: groupId,
          activity: {
            activity_name: `Learning`,
            activity_description: `Learning ${module}`,
            activity_recurrence: week > 1 ? "weekly" : "once",
            activity_starting_date: startDate.toISOString().split("T")[0],
            activity_ending_date: endDate.toISOString().split("T")[0],
            activity_days: [getWeekDayNumber(day)],
            activity_time: [
              [convertTimeFormat(timeStart), convertTimeFormat(timeEnd)],
            ],
          },
          room: "63bc283f2990ab07c1aebca0",
          additional_info: "",
          status: "confirmed",
        };
        bookings.push(booking);
      }
    }

    // save bookings to database
    // console.log(bookings);
    BookingsModel.insertMany(bookings)
      .then(() =>
        res
          .status(200)
          .json({ message: "File uploaded in system successfully" })
      )
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

function getWeekDayNumber(value) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const correspondingNumber = [1, 2, 3, 4, 5, 6, 7];
  return correspondingNumber[days.indexOf(value)];
}

function convertTimeFormat(time) {
  const timeSplit = time.match(/^(0?[1-9]|1[0-2]):([0-5][0-9])(am|AM|pm|PM)$/);
  var hours = Number(timeSplit[1]);
  var minutes = Number(timeSplit[2]);
  var AMPM = timeSplit[3];
  if (AMPM == "pm" && hours < 12) hours = hours + 12;
  if (AMPM == "am" && hours == 12) hours = hours - 12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if (hours < 10) sHours = "0" + sHours;
  if (minutes < 10) sMinutes = "0" + sMinutes;
  return sHours + ":" + sMinutes;
}
