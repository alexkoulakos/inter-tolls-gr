function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
function convertDigitIn(str){
    return str.replaceAll('-','')
 }

var pieChart;
const form = document.querySelector('form');

const formEvent = form.addEventListener('submit', event => {
    event.preventDefault();
    var input_data ={
     providerAbbr : document.querySelector('#op1_ID').value,
     PeriodFrom : convertDigitIn(document.querySelector('#PeriodFrom').value),
     PeriodTo : convertDigitIn(document.querySelector('#PeriodTo').value)
    }
    axios.get('https://localhost:9103/interoperability/api/availableStations')
        .then(response =>{
            var operatorList = [];
            var Passes = [];
            for(let i = 0; i < response.data.length; i++){
                res = response.data[i]
                operatorList.push(res["_id"]["providerAbbr"])
            }
    const base_url = `https://localhost:9103/interoperability/api`;
    let promises = [];
    for(let i = 0; i < operatorList.length; i++)
    {
       
        let url = base_url + ((operatorList[i] == input_data.providerAbbr)? `/PassesCost/${input_data.providerAbbr}/${input_data.providerAbbr}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`
                    : `/ChargesBy/${input_data.providerAbbr}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`);
        promises.push(
            axios.get(url)
            .then(response => {
                if(operatorList[i] == input_data.providerAbbr){
                    Passes.push(response.data.NumberOfPasses);
                }
                else{
                    let result = response.data.PPOList;
                    for(let j = 0; j < result.length; j++){
                        if(result[j].VisitingOperator == operatorList[i])
                        Passes.push(result[j].NumberOfPasses);
                    }
                }
            
            })
        )
    }
            
        Promise.all(promises).then(() =>{
            var button = document.getElementById("submitButton");
            submitButton.addEventListener("click", function(){
                pieChart.destroy();
            });
            myChart = document.getElementById('myChart').getContext('2d');
            Chart.defaults.global.defaultFontFamily = 'Arial';
            Chart.defaults.global.defaultFontSize = 18;
            pieChart = new Chart(myChart, {
                type:'doughnut',
                data:{
                labels: operatorList,
                datasets:[{
                    label:"Passes",
                    data: Passes,
                    backgroundColor:[
                    'rgba(255,  99, 132, 0.2)',
                    'rgba(54, 162, 235,0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102,255,0.2)',
                    'rgba(255,159,64,0.2)',
                    'rgba(144,103,167,0.2)'
                    ],
                    hoverOffset:4,
                    borderWidth:1,
                    borderColor:[
                    'rgba(255,  99, 132, 1)',
                    'rgba(54, 162, 235,1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102,255,1)',
                    'rgba(255,159,64,1)',
                    'rgba(144,103,167,1)'
                    ],
                                    
                    }]
                },
                options:{

                    responsive: true, 
                    maintainAspectRatio: false,
                    title:{
                        display:true,
                        text:'Passes Per Provider',
                        fontSize:25
                    },
                    legend:{
                        display:true,
                        position:'right',
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
