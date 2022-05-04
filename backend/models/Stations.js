const mongoose = require('mongoose');

const StationSchema = mongoose.Schema({
    stationID: {
        type: String,
        minLength: 4,
        maxLength: 4,
        required: true
    },
    stationProvider: {
        type: String,
        enum: [
            "aodos",
            "egnatia",
            "moreas",
            "kentriki_odos",
            "gefyra",
            "olympia_odos",
            "nea_odos"
        ],
        required: true
    },
    stationName: {
        type: String,
        maxLength: 30,
        required: true
    }
});

module.exports = mongoose.model('Stations', StationSchema);