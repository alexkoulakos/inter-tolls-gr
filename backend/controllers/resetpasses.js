const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017/InterTollsDB';

exports.post = function (req, res) {
    var db;
    mongodb.MongoClient.connect(uri, { useUnifiedTopology: true }).then((client) => {
        // console.log('Inside resetpasses endpoint: DB Connected!');
        db = client.db();
        db.collection('passes').deleteMany({}, function (err, result) {
            if (result) {
                // console.log("Collection Passes successfully emptied.");
                res.json({ "status" : "OK" }) 
            }
        });
    }).catch(err => {
        console.log("DB Connection Error");
        res.status(500).json({ "status" : "failed" }) 
    });
}