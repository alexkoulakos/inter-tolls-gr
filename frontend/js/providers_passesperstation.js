window.addEventListener("load", () =>{
    var provider = document.getElementById("provider")
    var number = document.getElementById("numbers")
    axios.get('https://localhost:9103/interoperability/api/availableStations')
        .then(response => {
            for(let i = 0; i < response.data.length; i++)
            {
                var res = response.data[i];
                provider.options[provider.options.length] = new Option(res["_id"]["stationProvider"],res["_id"]["providerAbbr"])
            }
            provider.onchange = function(){
                number.length = 1;
                for(let i = 0; i < response.data.length; i++){
                    res = response.data[i]
                    if(res["_id"]["providerAbbr"] != this.value)
                        continue;
                    else{
                        for(let j = 0; j <res.totalStations; j++ ){
                            number.options[number.options.length] = new Option(j,j);
                        }
                    }
                }
            }
})
.catch(error => console.error(error))
}
)






