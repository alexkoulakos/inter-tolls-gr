const Pass = require('../models/Passes');
const Vehicle = require('../models/Vehicles');
const mongoose = require('mongoose');
const { convertArrayToCSV } = require('convert-array-to-csv');

exports.get = async function (req, res) {
    if(!req.params.op_ID || !req.params.date_from || !req.params.date_to){
      res.status(400).json({message: "Oops! Looks like you are missing a non-optional parameter,usage:/ChargesBy/<op_ID>/<date_from>/<date_to>?format={csv|json}"});
      return;
    }
    const schema = {
      "operators": /^[A-Z]{2}$/,
      "date": /^((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))$/
    }
    if(!schema["operators"].test(req.params.op_ID) || !schema["date"].test(req.params.date_from) || !schema["date"].test(req.params.date_to))
    {
        res.status(400).json({message: "Looks like the provided arguments are not of the right format"})
        return;
    }
    try{
      await mongoose.connect('mongodb://localhost:27017/InterTollsDB');
      // 1
      const op1 = req.params['op_ID'];
      // 2
      var dt = new Date();
      dt.setHours(dt.getHours() + 2);
      var options = {hour12: false};
      const [date,time] = [dt.toLocaleDateString('fr-CA'), dt.toLocaleTimeString('en-US', options)]
      const ts = date + ' ' + time;
      // 3, 4
      var periodFrom = req.params['date_from'];
      const [yearFrom, monthFrom, dayFrom] = [periodFrom.slice(0,4), periodFrom.slice(4, 6), periodFrom.slice(6,8)];
      periodFrom = yearFrom + '-' + monthFrom + '-' + dayFrom + 'T00:00:00.000+00:00';
      var periodTo = req.params['date_to'];
      const [yearTo, monthTo, dayTo] = [periodTo.slice(0,4), periodTo.slice(4, 6), periodTo.slice(6,8)];
      periodTo = yearTo + '-' + monthTo + '-' + dayTo + 'T00:00:00.000+00:00';
      // 5
      const Passes = await Pass.find({ stationRef : {$regex : op1 + '.*' }, timestamp: {$gte: new Date(periodFrom),$lt: new Date(periodTo)}});
      const projectVehicles = await Vehicle.find({}).select({ vehicleID: 1,providerAbbr:1, _id:0});
      var array = [];
      var NumberOfPasses;
      var PassesCost;
      var providers = ["AO", "KO", "GF", "OO", "MR", "NE", "EG"];
      for(let i = 0; i < providers.length; i++) {
          var op2 = providers[i];
          if (op2 == op1) continue;
          NumberOfPasses = PassesCost = 0;
          for(let j = 0; j < Passes.length; j++) {
              var VehicleID = Passes[j].vehicleRef;
              for(let k = 0; k<projectVehicles.length; k++){
                if(projectVehicles[k].vehicleID == VehicleID){
                  var providerAbbr = projectVehicles[k].providerAbbr;
                  if (providerAbbr != op2) continue;
                  NumberOfPasses++;
                  PassesCost += Passes[j].charge;
                }
              }
            }
          if (NumberOfPasses == 0) continue;
          var row = {'VisitingOperator' : op2, 'NumberOfPasses' : NumberOfPasses, 'PassesCost' : Math.round(PassesCost*100)/100};
          array.push(row);
      }
      if(!array.length){
        res.status(402).json([])
        return;
      }
      var ans = {'op_ID' : op1, 'RequestTimestamp' : ts, 'PeriodFrom' : periodFrom, 'PeriodTo' : periodTo, 'PPOList' : array};
      if(req.query.format == "csv"){ // if format is csv
          const headerCSV = [
            'op_ID',
            'RequestTimestamp',
            'PeriodFrom',
            'PeriodTo',
            'VisitingOperator',
            'NumberOfPasses',
            'PassesCost',
          ];
          var dataCSV = [];
          for(var i in array){
            dataCSV.push([
              ans.op_ID,
              ans.RequestTimestamp,
              ans.PeriodFrom,
              ans.PeriodTo,
              array[i].VisitingOperator,
              array[i].NumberOfPasses,
              array[i].PassesCost,
            ]);
          }
          const finalCSV = convertArrayToCSV(dataCSV, {
            header: headerCSV,
            separator: ','
          });
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
