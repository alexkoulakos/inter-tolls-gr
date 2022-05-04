const mongoose = require('mongoose');

const PasseSchema = mongoose.Schema({
    passID: {
        type: String,
        minLength: 10,
        maxLength: 10,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    stationRef: {
        type: String,
        required: true
    },
    vehicleRef: {
        type: String,
        required: true
    },
    charge: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Passes',PasseSchema);