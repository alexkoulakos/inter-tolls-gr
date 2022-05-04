const Pass = require('../models/Passes');
const Vehicle = require('../models/Vehicles');
const mongoose = require('mongoose');
const { convertArrayToCSV } = require('convert-array-to-csv');

exports.get = async function (req, res) {
    if(!req.params.op1_ID || !req.params.op2_ID || !req.params.date_from || !req.params.date_to){
        res.status(400).json({message: "Oops! Looks like you are missing a non-optional parameter,usage:/PassesAnalysis/<op1_ID>/<op2_ID>/<date_from>/<date_to>?format={csv|json}"});
        return;
      }
    const schema = {
        "operators": /^[A-Z]{2}$/,
        "date": /^((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))$/
    }
    if (!schema["operators"].test(req.params.op1_ID) || !schema["operators"].test(req.params.op2_ID)
        || !schema["date"].test(req.params.date_from) || !schema["date"].test(req.params.date_to)) {
        res.status(400).json({message:"Looks like the given parameters were not of the right format"});
        return;
    }
    try {
        await mongoose.connect('mongodb://localhost:27017/InterTollsDB');

        // 1, 2
        const op1 = req.params['op1_ID'];
        const op2 = req.params['op2_ID'];
        // 3
        var dt = new Date();
        dt.setHours(dt.getHours() + 2);
        var options = { hour12: false };
        const [date, time] = [dt.toLocaleDateString('fr-CA'), dt.toLocaleTimeString('en-US', options)]
        const ts = date + ' ' + time;
        // 4, 5
        var periodFrom = req.params['date_from'];
        const [yearFrom, monthFrom, dayFrom] = [periodFrom.slice(0, 4), periodFrom.slice(4, 6), periodFrom.slice(6, 8)];
        periodFrom = yearFrom + '-' + monthFrom + '-' + dayFrom + 'T00:00:00.000+00:00';
        var periodTo = req.params['date_to'];
        const [yearTo, monthTo, dayTo] = [periodTo.slice(0, 4), periodTo.slice(4, 6), periodTo.slice(6, 8)];
        periodTo = yearTo + '-' + monthTo + '-' + dayTo + 'T00:00:00.000+00:00';
        // 6
        const Passes = await Pass.find({ stationRef: { $regex: op1 + '.*' }, timestamp: { $gte: new Date(periodFrom), $lt: new Date(periodTo) } }).sort('timestamp');

        var array = [];
        var NumberOfPasses = 0;
        var projectVehicles = await Vehicle.find({}).select({ vehicleID: 1,providerAbbr:1, _id:0});
        for (let i = 0; i < Passes.length; i++) {
            var PassID = Passes[i].passID;
            var stationID = Passes[i].stationRef;
            var PassTimeStamp = Passes[i].timestamp.toLocaleDateString('fr-CA') + ' ' + Passes[i].timestamp.toLocaleTimeString('en-US', options);
            var VehicleID = Passes[i].vehicleRef;
            for(let j = 0; j< projectVehicles.length; j++)
            {
                if(projectVehicles[j].vehicleID == VehicleID)
                {
                    var providerAbbr = projectVehicles[j].providerAbbr;
                    if (providerAbbr != op2) continue;
                    NumberOfPasses++;
                    var Charge = Passes[i].charge;
                    var row = { 'PassIndex': NumberOfPasses, 'PassID': PassID, 'stationID': stationID, 'PassTimeStamp': PassTimeStamp, 'VehicleID': VehicleID, 'Charge': Charge };
                    array.push(row);
                }
            }
        }
        if (array.length == 0) {
            res.status(402).send([]);
            return;
        }

        var ans = { 'op1_ID': op1, 'op2_ID': op2, 'RequestTimestamp': ts, 'PeriodFrom': periodFrom, 'PeriodTo': periodTo, 'NumberOfPasses': NumberOfPasses, 'PassesList': array };
        if (req.query.format == "csv") { // if format is csv
            const headerCSV = [
                'op1_ID',
                'op2_ID',
                'RequestTimestamp',
                'PeriodFrom',
                'PeriodTo',
                'NumberOfPasses',
                'PassIndex',
                'PassID',
                'PassTimeStamp',
                'VehicleID',
                'Charge',
            ];
            var dataCSV = [];
            for (var i in array) {
                dataCSV.push([
                    ans.op1_ID,
                    ans.op2_ID,
                    ans.RequestTimestamp,
                    ans.PeriodFrom,
                    ans.PeriodTo,
                    ans.NumberOfPasses,
                    array[i].PassIndex,
                    array[i].PassID,
                    array[i].PassTimeStamp,
                    array[i].VehicleID,
                    array[i].Charge,
                ]);
            }
            const finalCSV = convertArrayToCSV(dataCSV, {
                header: headerCSV,
                separator: ','
            });
            res.set('Content-Type', 'text/csv');
            res.status(200).send(finalCSV);
        }
        else { // default format is json
            res.set('Content-Type', 'application/json');
            res.status(200).json(ans);
        }
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
}
