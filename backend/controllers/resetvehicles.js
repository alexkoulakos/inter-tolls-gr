const csvtojson = require('csvtojson');
const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017/InterTollsDB';

exports.post = function (req, res) {
    var db;
    mongodb.MongoClient.connect(uri, { useUnifiedTopology: true },function(error,client) {
        try {
        if (error) throw error;
            if (client) {
                // console.log('Inside resetvehicles endpoint: DB Connected!');
                db = client.db();
                db.collection('vehicles').drop(function (err, result) {
                    // if (result) 
                        // console.log("Collection Vehicles successfully deleted.");
                });
                const stationsFile = __dirname + "/files/vehicles.csv";

                var array = [];
                csvtojson().fromFile(stationsFile).then(source => {
                    for (var i = 0; i < source.length; i++) {
                        var row = {
                            vehicleID: source[i]["vehicleID"],
                            tagID: source[i]["tagID"],
                            tagProvider: source[i]["tagProvider"],
                            providerAbbr: source[i]["providerAbbr"],
                            licenseYear: parseInt(source[i]["licenseYear"])
                        };
                        array.push(row);
                    }
                    var collection = db.collection('vehicles');
                    collection.insertMany(array, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.json({ "status" : "failed" }) 
                        }
                        if (result) {
                            //console.log('Imported CSV into database successfully.');
                            res.json({ "status" : "OK" }) 
                        }
                    });
                });
            }
        } catch(error) {
            console.log("DB Connection Error");
            res.status(500).json({ "status" : "failed" })
        }
    })
}