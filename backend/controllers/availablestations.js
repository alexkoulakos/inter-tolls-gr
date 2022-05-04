const Station = require('../models/Stations');
const mongoose = require('mongoose');

exports.get = async function (req, res) {
    try{
        await mongoose.connect('mongodb://localhost:27017/InterTollsDB')
        const availableStations = await Station.aggregate(
            [
                {
                    $project:
                       {
                         stationProvider: 1,
                         providerAbbr: { $substr: [ "$stationID", 0, 2 ] },
                       }
                    },
                {
                    $group : 
                    {
                        _id: {"providerAbbr": "$providerAbbr", "stationProvider": "$stationProvider"},
                        totalStations: { $count: { } }
                    }
                    
                }
            ]
        )
        res.set('Content-Type', 'application/json');
        res.status(200).json(availableStations);
    }catch(error){
        res.status(500).send("Internal Server Error")
    }
}