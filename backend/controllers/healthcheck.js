const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017/InterTollsDB';

exports.get = function (req, res) {
    mongodb.MongoClient.connect(uri, { useUnifiedTopology: true }, function (error, client) {
        try {
            if (error) throw error;
            if (client) {
                // console.log('Inside healthcheck endpoint: DB Connected!');
                res.json({ "status": "OK", "dbconnection": uri })
            }
        } catch (error) {
            console.log("DB Connection Error");
            res.status(500).json({ "status": "failed", "dbconnection": uri })
        }
    })
}