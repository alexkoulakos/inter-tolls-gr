export function buildTable(data)
{   
    // <table id='res-table'> must be in html document
    let table = document.getElementById('res-table');

    while (table.rows.length > 0) 
    {
        console.log("I am inside");

        // delete all previous rows before building table, in case submit
        // button is pressed more than once without reloading
        table.deleteRow(-1);
    }

    // create <thead> </thead> tags
    let header = table.createTHead();
    
    // enumerate the properties of JSON object
    let keys = Object.keys(data[0]);

    let row = header.insertRow(0);

    for (let j = 0; j < keys.length; j++)
    {
        let cell = row.insertCell(j);
        // header should have the object attributes 
        cell.innerHTML = keys[j];
    }

    if ($.fn.dataTable.isDataTable('#res-table'))
        $('#res-table').DataTable().destroy();
    
    var dt = $("#res-table");

    var columns = [];

    for (let i = 0; i < keys.length; i++)
    {
        var obj = {'data': keys[i]};
        columns.push(obj);
    }

    // console.log(columns);

    dt.DataTable({
        "data": data,
        "columns": columns
    });
}
