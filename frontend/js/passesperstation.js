import { buildTable } from "./buildTable.js";

function convertDigitIn(str){
    return str.replaceAll('-','')
 }

 function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

const form = document.querySelector('form');

const formEvent = form.addEventListener('submit', event => {
    event.preventDefault();
    
    if ($.fn.dataTable.isDataTable('#res-table'))
        $('#res-table').DataTable().destroy();
    
    var input_data ={
     providerAbbr : document.querySelector('#provider').value + pad(document.querySelector('#numbers').value),
     PeriodFrom : convertDigitIn(document.querySelector('#PeriodFrom').value),
     PeriodTo : convertDigitIn(document.querySelector('#PeriodTo').value)
    }
    const base_url = `https://localhost:9103/interoperability/api`
    let url = base_url + `/PassesPerStation/${input_data.providerAbbr}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`
    console.log(url)
    axios.get(url)
        .then(response => {
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
.catch(error => { 
    console.error(error);

    var dt = new Date();
    var options = { hour12: false };
    const [date, time] = [dt.toLocaleDateString('fr-CA'), dt.toLocaleTimeString('en-US', options)]
    const ts = date + ' ' + time;

    var str_1 = document.getElementById("res-info");
    var str_2 = document.getElementById("fail-info");

    str_1.innerHTML = "Request Timestamp: " + ts + "<br />Number of Passes: " + 0;
    str_2.innerHTML = "<br /><br />No passes have happened from station " + input_data.providerAbbr + " during the requested period of time"
    });

    let table = document.getElementById('res-table');

    while (table.rows.length > 0) 
    {
        // delete all previous rows before building table, in case submit
        // button is pressed more than once without reloading
        table.deleteRow(-1);
    }
});
