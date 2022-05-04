const csvtojson = require('csvtojson');
const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017/InterTollsDB';

/*
 * Converts given date of the form DD/MM/YY HH:MM:SS to the
 * form YY-MM-DDTHH:MM:SS000Z so that it can be correctly parsed.
 */
process.env.TZ = 'UTC'
function convertToDate(str)
{
    var date, time, day, month, year;

    [date, time] = str.split(" ");
    [day, month, year] = date.split("/");
    date = month + "/" + day + "/" + year;
    date = date + " " + time;

    date = new Date(date);
    date.setHours(date.getHours());

    return date;
}

exports.post = function (req, res) {
    var db;

    mongodb.MongoClient.connect(uri, { useUnifiedTopology: true }, function (error, client) {
        try {
            if (error) throw error;
            if (client) {
                // console.log('Inside passesupdate endpoint: DB Connected!');
                db = client.db();
                const pathname = decodeURI(req.query['path']);

                // console.log("Full pathname is ", pathname);

                var array = [];
                csvtojson().fromFile(pathname).then(source => {
                    for (var i = 0; i < source.length; i++) {
                        var row = {
                            passID: source[i]["passID"],
                            timestamp: convertToDate(source[i]["timestamp"]),
                            stationRef: source[i]["stationRef"],
                            vehicleRef: source[i]["vehicleRef"],
                            charge: parseFloat(source[i]["charge"])
                        };
                        array.push(row);
                    }
                    var collection = db.collection('passes');
                    collection.insertMany(array, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.json({ "status": "failed" })
                        }
                        if (result) {
                            // console.log('Imported CSV file into database successfully.');
                            res.json({ "status": "OK" })
                        }
                    });
                });
            }
        } catch (error) {
            console.log("DB Connection Error");
            res.status(500).json({ "status": "failed" })
        }
    })
}
