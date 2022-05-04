const Station = require('../models/Stations');
const Pass = require('../models/Passes');
const Vehicle = require('../models/Vehicles');
const mongoose = require('mongoose');
const { convertArrayToCSV } = require('convert-array-to-csv');

exports.get = async function (req, res) {
  if(!req.params.stationID || !req.params.date_from || !req.params.date_to){
    res.status(400).json({message: "Oops! Looks like you are missing a non-optional parameter,usage:/PassesPerStation/<stationID>/<date_from>/<date_to>?format={csv|json}"});
    return;
  }
  const schema = {
    "operators": /^[A-Z]{2}[0-9]{2}$/,
    "date": /^((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))$/
  }
  if(!schema["operators"].test(req.params.stationID)|| !schema["date"].test(req.params.date_from) || !schema["date"].test(req.params.date_to))
  {
      res.status(400).send({message:"Looks like the given parameters were not of the right format"});
      return;
  }
  try{
    await mongoose.connect('mongodb://localhost:27017/InterTollsDB');
    // 1
    const station = req.params['stationID'];
    // 2
    const stationProvider = await Station.
    find( {'stationID' : station} ).select({stationProvider : 1, _id : 0});
    // 3
    var dt = new Date();
    dt.setHours(dt.getHours() + 2);
    var options = {hour12: false};
    const [date,time] = [dt.toLocaleDateString('fr-CA'), dt.toLocaleTimeString('en-US', options)]
    const ts = date + ' ' + time;
    // 4, 5
    var periodFrom = req.params['date_from'];
    const [yearFrom, monthFrom, dayFrom] = [periodFrom.slice(0,4), periodFrom.slice(4, 6), periodFrom.slice(6,8)];
    periodFrom = yearFrom + '-' + monthFrom + '-' + dayFrom + 'T00:00:00.000+00:00';
    var periodTo = req.params['date_to'];
    const [yearTo, monthTo, dayTo] = [periodTo.slice(0,4), periodTo.slice(4, 6), periodTo.slice(6,8)];
    periodTo = yearTo + '-' + monthTo + '-' + dayTo + 'T00:00:00.000+00:00';
    // 6, 7
    const Passes = await Pass.find({ stationRef : station, timestamp: {$gte: new Date(periodFrom),$lt: new Date(periodTo)}}).sort('timestamp')
    const projectVehicles = await Vehicle.find({}).select({ vehicleID: 1,providerAbbr:1, _id:0, tagProvider: 1});

    // 8
    var array = [];
    for(let i = 0; i < Passes.length; i++) {
        var PassID = Passes[i].passID;
        var PassTimeStamp = Passes[i].timestamp.toLocaleDateString('fr-CA') + ' ' + Passes[i].timestamp.toLocaleTimeString('en-US', options);
        var VehicleID = Passes[i].vehicleRef;
        for(let j = 0; j<projectVehicles.length; j++){
          if(projectVehicles[j].vehicleID == VehicleID){
            var TagProvider = projectVehicles[j].tagProvider;
            var PassType;
            if (stationProvider[0].stationProvider == TagProvider) PassType = 'home';
            else PassType = 'visitor';
            var PassCharge = Passes[i].charge;
            var row = {'PassIndex' : i+1, 'PassID' : PassID, 'PassTimeStamp' : PassTimeStamp, 'VehicleID' : VehicleID, 'TagProvider' : TagProvider, 'PassType' : PassType, 'PassCharge' : PassCharge};
            array.push(row);
          }
        }
      }
    if(array.length == 0){
      res.status(402).json([]);
      return;
  }

    var ans = {'Station' : station, 'StationOperator' : stationProvider[0].stationProvider, 'RequestTimestamp' : ts, 'PeriodFrom' : periodFrom, 'PeriodTo' : periodTo, 'NumberOfPasses' : Passes.length, 'PassesList' : array};

    if(req.query.format == "csv"){ // if format is csv
      const headerCSV = [
        'Station',
        'StationOperator',
        'RequestTimestamp',
        'PeriodFrom',
        'PeriodTo',
        'NumberOfPasses',
        'PassIndex',
        'PassID',
        'PassTimeStamp',
        'VehicleID',
        'TagProvider',
        'PassType',
        'PassCharge'      
      ];
      var dataCSV = [];
      for(var i in array){
        dataCSV.push([
          ans.Station,
          ans.StationOperator,
          ans.RequestTimestamp,
          ans.PeriodFrom,
          ans.PeriodTo,
          ans.NumberOfPasses,
          array[i].PassIndex,
          array[i].PassID,
          array[i].PassTimeStamp,
          array[i].VehicleID,
          array[i].TagProvider,
          array[i].PassType,
          array[i].PassCharge
        ]);
      }
      const finalCSV = convertArrayToCSV(dataCSV, {
        header: headerCSV,
        separator: ','
      })

      res.set('Content-Type', 'text/csv');
      res.status(200).send(finalCSV);
    }
    else{ // default format is json
      res.set('Content-Type', 'application/json');
      res.status(200).json(ans);
    }
  }catch(error){
    res.status(500).send("Internal Server Error")
}
}
