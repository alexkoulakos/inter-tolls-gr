const https = require("https");
const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());

// API Routes

const adminRoute = require("../api/routes/adminRoutes");
app.use("/interoperability/api/admin", adminRoute);

const passesPerStationRoute = require("../api/routes/passesPerStation");
app.use("/interoperability/api/PassesPerStation", passesPerStationRoute);

const passesAnalysisRoute = require("../api/routes/passesAnalysis");
app.use("/interoperability/api/PassesAnalysis", passesAnalysisRoute);

const passesCostRoute = require("../api/routes/passesCost");
app.use("/interoperability/api/PassesCost", passesCostRoute);

const chargesByRoute = require("../api/routes/chargesBy");
app.use("/interoperability/api/ChargesBy", chargesByRoute);

const availableRoute = require("../api/routes/availableStations");
app.use("/interoperability/api/availableStations", availableRoute);

// Frontend routes

app.use("/static", express.static("../frontend/js"));

app.get("/interoperability", (req, res) => {
  const name = path.join(__dirname, "..", "/frontend/layouts/home.html");
  res.sendFile(name);
});

app.get("/interoperability/PassesPerStation", (req, res) => {
  const name = path.join(
    __dirname,
    "..",
    "/frontend/layouts/passesperstation.html"
  );
  res.sendFile(name);
});

app.get("/interoperability/PassesAnalysis", (req, res) => {
  const name = path.join(
    __dirname,
    "..",
    "/frontend/layouts/passesanalysis.html"
  );
  res.sendFile(name);
});

app.get("/interoperability/PassesCost", (req, res) => {
  const name = path.join(__dirname, "..", "/frontend/layouts/passescost.html");
  res.sendFile(name);
});

app.get("/interoperability/ChargesBy", (req, res) => {
  const name = path.join(__dirname, "..", "/frontend/layouts/chargesby.html");
  res.sendFile(name);
});

app.get("/interoperability/Statistics", (req, res) => {
  const name = path.join(__dirname, "..", "/frontend/layouts/statistics.html");
  res.sendFile(name);
});

app.get("/interoperability/Statistics2", (req, res) => {
  const name = path.join(
    __dirname,
    "..",
    "/frontend/layouts/statisticStations.html"
  );
  res.sendFile(name);
});

app.get("/interoperability/Statistics3", (req, res) => {
  const name = path.join(
    __dirname,
    "..",
    "/frontend/layouts/statisticsProviders.html"
  );
  res.sendFile(name);
});

app.get("/interoperability/MakeEven", (req, res) => {
  const name = path.join(__dirname, "..", "/frontend/layouts/makeeven.html");
  res.sendFile(name);
});

https
  .createServer(
    {
      key: fs.readFileSync("../security/cert.key"),
      cert: fs.readFileSync("../security/cert.pem"),
    },
    app
  )
  .listen(9103, () => {
    console.log("Server is running on port 9103.");
  });

// for http uncomment the following lines
/*
app.listen(9103 ,() => {
    console.log("Server is running on port 9103")
})
*/
