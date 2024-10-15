pathname = "/Users/shelbernstein/Documents/driving/";

const fs = require("fs");
const path = require("path");

const filleNames = {};

function traverseDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      traverseDirectory(itemPath);
    } else {
      filleNames[itemPath] = {
        contents: fs.readFileSync(itemPath).toString(),
      };
    }
  });
}

traverseDirectory(pathname);
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./data/db/code_annotation.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the code_annotation database.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS code_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_path TEXT UNIQUE NOT NULL,
    file_contents TEXT NOT NULL
  )`);

  Object.entries(filleNames).forEach(([filePath, fileData]) => {
    db.run(
      `INSERT INTO code_files(file_path, file_contents)
        VALUES (?, ?)`,
      [filePath, fileData.contents],
      function (err) {
        if (err) {
          // Handle insert error, e.g., print error message
          console.error(err.message);
        } else {
          // Get the id of the last inserted row
          console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
      },
    );
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});
