const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema({
    vehicleID:{
        type: String,
        maxLength: 15,
        required:true
    },
    tagID:{
        type:String,
        maxLength: 9,
        required: true
    },
    providerAbbr:{
        type: String,
        maxLength:2,
        enum: [
            "AO",
            "KO",
            "GF",
            "OO",
            "MR",
            "NE",
            "EG"
        ],
        required: true
    },
    licenseYear: {
        type: Number,
        minimum: 1900,
        maximum: 2030,
        required: true
    },
    tagProvider: {
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
    }
});





module.exports = mongoose.model('Vehicles',VehicleSchema);