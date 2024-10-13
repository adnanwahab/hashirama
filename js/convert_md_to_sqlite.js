function main () {
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const schema = `
CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    content TEXT
)
`


function convertMdToSqlite() {
    const db = new sqlite3.Database('odyssey.db');

    db.serialize(() => {
        db.run(schema)
    });

        const directoryPath = path.join(__dirname, '../data/odyssey');

        fs.readdir(directoryPath, (err, folders) => {
            if (err) {
                return console.error('Unable to scan directory: ' + err);
            }

            folders.forEach(folder => {
                const folderPath = path.join(directoryPath, folder);

                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        return console.error('Unable to scan folder: ' + err);
                    }

                    files.forEach(file => {
                        const filePath = path.join(folderPath, file);

                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                return console.error('Unable to read file: ' + err);
                            }

                            const stmt = db.prepare("INSERT INTO files (filename, content) VALUES (?, ?)");
                            stmt.run(file, data);
                            stmt.finalize();
                        });
                    });
                });
            });
    }); 

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

convertMdToSqlite();

function main () {
    convertMdToSqlite()
}

main()
