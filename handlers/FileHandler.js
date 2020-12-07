const fs = require('fs');
const request = require('request')

class FileHandler {
    constructor() {
    }

    fileExists(path) {
        return fs.existsSync(path);
    }

    download(url, path) {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', () => {
                    console.log("Download complete.");
                })
        });
    }

    writeToJsonFile(data, path) {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFile(path, jsonData, 'utf8', (err, data) => {
            if(err) {
                console.log(err);
            } else {
                console.log("Write complete.");
            }
        })
    }

    readFromJsonFile(path) {
        let data = fs.readFileSync(path);
        return JSON.parse(data);
    }
}

module.exports = FileHandler;