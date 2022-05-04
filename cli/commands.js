#!/usr/bin/env node
const https = require("https");
var program = require("commander");
const axios = require("axios").default;
const errorfunctions = require("./errorfunctions");

// Disables client verification
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

program
  .version("1.0.0")
  .option("--description", "Toll Passes Management System");

/*const options = program.opts();
if (options.description)
    console.log("Toll Passes Management System")*/
const admin_url = `https://localhost:9103/interoperability/api/admin`;
program
  .command("healthcheck")
  .description("check if connected to database")
  .action(() => {
    // to be filled
    if (process.argv.length > 3) {
      console.log("Wrong command syntax.");
      errorfunctions.helpProcess();
      return 1;
    }
    let url = admin_url + `/healthcheck`;
    axios
      .get(url, {
        httpsAgent,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
program
  .command("resetpasses")
  .description("delete passes collection from database")
  .action(() => {
    if (process.argv.length > 3) {
      console.log("Wrong command syntax.");
      errorfunctions.helpProcess();
      return 1;
    }
    let url = admin_url + `/resetpasses`;
    axios
      .post(
        url,
        {},
        {
          httpsAgent,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
program
  .command("resetstations")
  .description("restore stations collection to database")
  .action(() => {
    if (process.argv.length > 3) {
      console.log("Wrong command syntax.");
      errorfunctions.helpProcess();
      return 1;
    }
    let url = admin_url + `/resetstations`;
    axios
      .post(
        url,
        {},
        {
          httpsAgent,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
program
  .command("resetvehicles")
  .description("restore vehicles collection to database")
  .action(() => {
    if (process.argv.length > 3) {
      console.log("Wrong command syntax.");
      errorfunctions.helpProcess();
      return 1;
    }
    let url = admin_url + `/resetvehicles`;
    axios
      .post(
        url,
        {},
        {
          httpsAgent,
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
program
    .command('admin')
    .description('Update Passes collection with documents stored to a given CSV file')
    .option('--passesupd', 'update operation by administrator')
    .option('--source <source>', 'relative path to CSV file')
    .action((options) => {
        if (process.argv.length != 6) 
        {
            console.log("Wrong command syntax.");
            errorfunctions.helpProcess();
            return 1;
        }
        if (errorfunctions.validatePassesUpdate(options) == 1)
            return 1;
        const path = __dirname + options.source;
        let url = admin_url + `/passesupdate?path=${path}`;
        var encoded_url = encodeURI(url);
        axios.post(encoded_url, {}, { httpsAgent })
            .then((response) => {
                console.log(response.data);
            })
            .catch(err => {
                console.log(err.message);
                errorfunctions.helpProcess();
            })
    })

const base_url = `https://localhost:9103/interoperability/api`;

program
  .command("passesperstation")
  .description("pass events for station")
  .option("--station <station>", "select station")
  .option("--datefrom [datefrom]", "select starting date")
  .option("--dateto [dateto]", "select ending date")
  .option("--format <format>", "json or csv")
  .action((options) => {
    console.log(options);
    if(errorfunctions.validateStation(options) == 1) return 1;
    if(errorfunctions.validateFormat(options) == 1) return 1;
    errorfunctions.valiDate(options);
    let url =
      base_url +
      `/passesperstation/${options.station}/${options.datefrom}/${options.dateto}?format=${options.format}`;
    axios
      .get(url, {
        httpsAgent,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
program
  .command("passesanalysis")
  .description("analyze passes of visiting operator tags")
  .option("--op1 <op1>")
  .option("--op2 <op2>")
  .option("--datefrom [datefrom]")
  .option("--dateto [dateto]")
  .option("--format <format>")
  .action((options) => {
    if(errorfunctions.validateOperators(options) == 1) return1;
    if(errorfunctions.validateFormat(options) == 1) return 1;
    errorfunctions.valiDate(options);
    let url =
      base_url +
      `/passesanalysis/${options.op1}/${options.op2}/${options.datefrom}/${options.dateto}?format=${options.format}`;
    axios
      .get(url, {
        httpsAgent,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
program
  .command("passescost")
  .description("cost of passes of visiting operator tags")
  .option("--op1 <op1>")
  .option("--op2 <op2>")
  .option("--datefrom [datefrom]")
  .option("--dateto [dateto]")
  .option("--format <format>")
  .action((options) => {
    if(errorfunctions.validateOperators(options) == 1) return 1;
    if(errorfunctions.validateFormat(options) == 1) return 1;
    errorfunctions.valiDate(options);
    let url =
      base_url +
      `/passescost/${options.op1}/${options.op2}/${options.datefrom}/${options.dateto}?format=${options.format}`;
    axios
      .get(url, {
        httpsAgent,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
program
  .command("chargesby")
  .description("amount of money owed to operator by each visitor")
  .option("--op1 <op1>")
  .option("--datefrom [datefrom]")
  .option("--dateto [dateto]")
  .option("--format <format>")
  .action((options) => {
    if(errorfunctions.validateOperator(options) == 1) return 1;
    if(errorfunctions.validateFormat(options) == 1) return 1;
    errorfunctions.valiDate(options);
    let url =
      base_url +
      `/chargesby/${options.op1}/${options.datefrom}/${options.dateto}?format=${options.format}`;
    axios
      .get(url, {
        httpsAgent,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

program.parse(process.argv);
