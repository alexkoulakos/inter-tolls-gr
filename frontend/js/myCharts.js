function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
function convertDigitIn(str){
    return str.replaceAll('-','')
 }

var barChart;
const form = document.querySelector('form');

const formEvent = form.addEventListener('submit', event => {
    event.preventDefault();
    var stationsLength = 0;
    var input_data ={
     providerAbbr : document.querySelector('#op1_ID').value,
     PeriodFrom : convertDigitIn(document.querySelector('#PeriodFrom').value),
     PeriodTo : convertDigitIn(document.querySelector('#PeriodTo').value)
    }
    axios.get('https://localhost:9103/interoperability/api/availableStations')
        .then(response =>{
            for(let i = 0; i < response.data.length; i++){
                res = response.data[i]
                if(res["_id"]["providerAbbr"] != input_data.providerAbbr)
                    continue;
                else{
                    stationsLength = res.totalStations;
                    break;
                }
            }
            const base_url = `https://localhost:9103/interoperability/api`
    let stations = [];
    let promises = [];
    for(let i = 0; i < stationsLength; i++)
    {
       
        let stationProvider = input_data.providerAbbr + pad(i);
        let url = base_url + `/PassesPerStation/${stationProvider}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`
        promises.push(
            axios.get(url)
            .then(response => {
            stations.push([stationProvider, response.data.NumberOfPasses]);
            })
        )
    }
            
        Promise.all(promises).then(() =>{
                stations.sort(function(a,b){
                    return b[1] - a[1];
                })
                var length = ((stationsLength < 10) ? stationsLength : 10) ;
                var sortedStations = stations.slice(0,length);
                console.log(sortedStations)
            var stationIds = [];
            var NumberOfPasses =[];
            for (let j =0; j < length; j++){
                console.log(sortedStations[j][0],sortedStations[j][1])
                stationIds.push(sortedStations[j][0]);
                NumberOfPasses.push(sortedStations[j][1]);
            }
            const theMin = NumberOfPasses[length-1] - 1;
            const theMax = NumberOfPasses[0] + 1;
            var button = document.getElementById("submitButton");
            submitButton.addEventListener("click", function(){
                barChart.destroy();
            });
            myChart = document.getElementById('myChart').getContext('2d');
            Chart.defaults.global.defaultFontFamily = 'Arial';
            Chart.defaults.global.defaultFontSize = 18;
            Chart.defaults.global.defaultFontColor = '#777';
            barChart = new Chart(myChart, {
                type:'bar',
                data:{
                labels: stationIds,
                datasets:[{
                    label:"Passes",
                    data: NumberOfPasses,
                    backgroundColor:'rgba(144,103,167,0.6)',
                    borderWidth:1,
                    borderColor:'#777',
                    hoverBorderWidth:3,
                    hoverBorderColor:"#000"
                    }]
                },
                options:{
                    scales:{
                        y:{
                            max: theMax,
                            min:theMin,
                            ticks:{
                                stepSize:1
                            }
                        }
                    },
                    title:{
                        display:true,
                        text:'Top 10 most visited stations of the given Provider',
                        fontSize:25
                    },
                    legend:{
                        display:true,
                        position:'right',
                        labels:{
                            fontColor:'#000'
                        }
                    },
                    layout:{
                        padding:{
                            left:50,
                            right:0,
                            bottom:0,
                            top:0
                        }
                    },
                    tooltips:{
                        enabled:true
                    }
                    
                }
            })
        
        })
        })
})
