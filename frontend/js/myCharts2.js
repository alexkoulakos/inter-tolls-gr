function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
function convertDigitIn(str){
    return str.replaceAll('-','')
 }



var lineChart;
const form = document.querySelector('form');

const formEvent = form.addEventListener('submit', event => {
    event.preventDefault();
    var input_data ={
     providerAbbr : document.querySelector('#provider').value + pad(document.querySelector('#numbers').value),
     PeriodFrom : convertDigitIn(document.querySelector('#PeriodFrom').value),
     PeriodTo : convertDigitIn(document.querySelector('#PeriodTo').value)
    }
    
    const base_url = `https://localhost:9103/interoperability/api`
    let url = base_url + `/PassesPerStation/${input_data.providerAbbr}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`

            axios.get(url)
            .then(response => {
                hours = {"00":0,
                "01":0,
                "02":0,
                "03":0,
                "04":0,
                "05":0,
                "06":0,
                "07":0,
                "08":0,
                "09":0,
                "10":0,
                "11":0,
                "12":0,
                "13":0,
                "14":0,
                "15":0,
                "16":0,
                "17":0,
                "18":0,
                "19":0,
                "20":0,
                "21":0,
                "22":0,
                "23":0,
                "24":0,
            };
                let res = response.data.PassesList;
                for (let i = 0; i < res.length; i++)
                {
                    let hour = ((res[i].PassTimeStamp.toString()).split(" ")[1].split(":")[0]);
                    console.log(hour);
                    hours[hour] += 1;
                }
            
                var theHours = ["00","01","02","03","04","05","06","07","08",
            "09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"];
                var thePasses = [];

                for (let i = 0; i < theHours.length; i++) {
                    thePasses.push(hours[theHours[i]]);
                }
                var button = document.getElementById("submitButton");
                submitButton.addEventListener("click", function(){
                    lineChart.destroy();
                });
                myChart = document.getElementById('myChart').getContext('2d');
                Chart.defaults.global.defaultFontFamily = 'Arial';
                Chart.defaults.global.defaultFontSize = 18;
                Chart.defaults.global.defaultFontColor = '#777';
                lineChart = new Chart(myChart, {
                    type:'line',
                    data:{
                    labels: theHours,
                    datasets:[{
                        label:"Passes",
                        data: thePasses,
                        fill:false,
                        backgroundColor:'rgba(144,103,167,0.6)',
                        borderWidth:1,
                        borderColor:'rgba(144,103,167,1)',
                        hoverBorderWidth:3,
                        hoverBorderColor:"#000"
                        }]
                    },
                    options:{

                        title:{
                            display:true,
                            text:'Passes Per Hour from the given Station',
                            fontSize:25
                        },
                        legend:{
                            display:false,
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
