const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

exports.uploadCSV = async (req, res) => {
  // upload csv file and save it to uploads folder
  const csvFile = req.file;
  if (!csvFile) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // check if file is csv
  if (csvFile.mimetype !== "text/csv") {
    return res.status(400).json({ message: "File is not a csv" });
  }
  // check if file is empty
  if (csvFile.size === 0) {
    return res.status(400).json({ message: "File is empty" });
  }
  // check if file is bigger than 1MB
  if (csvFile.size > 1000000) {
    return res.status(400).json({ message: "File is too big" });
  }
  // check if file is smaller than 1KB
  if (csvFile.size < 1000) {
    return res.status(400).json({ message: "File is too small" });
  }

  return res.status(200).json({ message: "File uploaded" });
};

exports.removeEmptyColumns = async (req, res) => {
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
          return res.status(200).json({ message: "File saved" });
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

exports.pushJSONDataToDB = async (req, res) => {
  return res.status(200).json({ message: "Data pushed to DB" });
};