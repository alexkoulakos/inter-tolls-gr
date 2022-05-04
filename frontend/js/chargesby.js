import { buildTable } from "./buildTable.js";

function convertDigitIn(str) 
{
    return str.replaceAll('-', '');
}

const form = document.querySelector('form');

const formEvent = form.addEventListener('submit', event => 
{
    event.preventDefault();

    var input_data = 
    {
        op1_ID: document.querySelector('#op1_ID').value,
        PeriodFrom: convertDigitIn(document.querySelector('#PeriodFrom').value),
        PeriodTo: convertDigitIn(document.querySelector('#PeriodTo').value)
    }

    const base_url = `https://localhost:9103/interoperability/api`
    let url = base_url + `/ChargesBy/${input_data.op1_ID}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`



    axios.get(url)

        .then(response => {
            var arr = [];
            //arr.push(response.data);
            buildTable(response.data.PPOList);
        })

        .catch(error => console.error(error))
})