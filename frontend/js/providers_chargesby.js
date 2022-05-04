window.addEventListener("load", () =>{
    var home = document.getElementById("op1_ID")
    axios.get('https://localhost:9103/interoperability/api/availableStations')
        .then(response => {
            for (let i = 0; i < response.data.length; i++)
            {
                var res = response.data[i];
                home.options[home.options.length] = new Option(res["_id"]["stationProvider"],res["_id"]["providerAbbr"])
            }
})
.catch(error => console.error(error))
}
)


        
