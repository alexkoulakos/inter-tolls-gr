window.addEventListener("load", () => {
  var provider1 = document.getElementById("op1_ID");
  var provider2 = document.getElementById("op2_ID");
  axios
    .get("https://localhost:9103/interoperability/api/availableStations")
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        var res = response.data[i];
        provider1.options[provider1.options.length] = new Option(
          res["_id"]["stationProvider"],
          res["_id"]["providerAbbr"]
        );
      }
      provider1.onchange = function () {
        provider2.length = 1;
        for (let i = 0; i < response.data.length; i++) {
          res = response.data[i];
          if (res["_id"]["providerAbbr"] === this.value) continue;
          else {
            provider2.options[provider2.options.length] = new Option(
              res["_id"]["stationProvider"],
              res["_id"]["providerAbbr"]
            );
          }
        }
      };
    })
    .catch((error) => console.error(error));
});
