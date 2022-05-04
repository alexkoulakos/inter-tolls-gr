import { buildTable } from "./buildTable.js";

function convertDigitIn(str) {
  return str.replaceAll("-", "");
}

const form = document.querySelector("form");

const formEvent = form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  if ($.fn.dataTable.isDataTable('#res-table'))
    $('#res-table').DataTable().destroy();
  
  var input_data = {
    op1_ID: document.querySelector("#op1_ID").value,
    op2_ID: document.querySelector("#op2_ID").value,
    PeriodFrom: convertDigitIn(document.querySelector("#PeriodFrom").value),
    PeriodTo: convertDigitIn(document.querySelector("#PeriodTo").value),
  };
  const base_url = `https://localhost:9103/interoperability/api`;
  let url =
    base_url +
    `/PassesAnalysis/${input_data.op1_ID}/${input_data.op2_ID}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`;
  axios
    .get(url)
    .then((response) => {
        buildTable(response.data.PassesList);
        var str_1 = document.getElementById("res-info");
        var str_2 = document.getElementById("fail-info");

        str_1.innerHTML =
          "Request Timestamp: " +
          response.data.RequestTimestamp +
          "<br />Number of Passes: " +
          response.data.NumberOfPasses;
        
        str_2.innerHTML = "";
    })
    .catch((error) => { 
      console.error(error);

      var dt = new Date();
        var options = { hour12: false };
        const [date, time] = [dt.toLocaleDateString('fr-CA'), dt.toLocaleTimeString('en-US', options)]
        const ts = date + ' ' + time;
        
        var str_1 = document.getElementById("res-info");
        var str_2 = document.getElementById("fail-info");

        str_1.innerHTML = "Request Timestamp: " + ts + "<br />Number of Passes: " + 0;
        str_2.innerHTML = "<br /><br />No passes have happened from visiting operator " + 
          input_data.op2_ID + " to home operator " + input_data.op1_ID + 
          " during the requested period of time"
        });

        let table = document.getElementById('res-table');

        while (table.rows.length > 0) 
        {
            // console.log("I am inside");

            // delete all previous rows before building table, in case submit
            // button is pressed more than once without reloading
            table.deleteRow(-1);
        }
  });
