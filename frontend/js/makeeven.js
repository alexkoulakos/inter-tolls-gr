function convertDigitIn(str) {
  return str.replaceAll("-", "");
}

function endMonth(str) {
  var temp = parseInt(str);
  let lasttwo = temp % 100;
  if (lasttwo != 12) {
    temp++;
  }
  else {
    temp += 89;
  }
  return temp.toString();
}

const form = document.querySelector("form");

const formEvent = form.addEventListener("submit", (event) => {
  event.preventDefault();

  var input_data = {
    op1_ID: document.querySelector("#op1_ID").value,
    op2_ID: document.querySelector("#op2_ID").value,
    PeriodFrom:
      convertDigitIn(document.querySelector("#PeriodFrom").value) + "01",
    PeriodTo:
      endMonth(convertDigitIn(document.querySelector("#PeriodFrom").value)) +
      "01",
  };

  console.log(input_data);

  const base_url = `https://localhost:9103/interoperability/api`;
  var url =
    base_url +
    `/PassesCost/${input_data.op1_ID}/${input_data.op2_ID}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`;

  axios
    .get(url)

    .then((response) => {
      const TwotoOne = response.data.PassesCost;
      var url =
        base_url +
        `/PassesCost/${input_data.op2_ID}/${input_data.op1_ID}/${input_data.PeriodFrom}/${input_data.PeriodTo}?format=json`;

      axios
        .get(url)

        .then((response) => {
          const OnetoTwo = response.data.PassesCost;
          if (OnetoTwo - TwotoOne >= 0) {
            let tmp = OnetoTwo - TwotoOne;
            let ans = Math.round(tmp*100)/100;
            var ansstr = document.getElementById("ansstr");
            ansstr.innerHTML = `Operator ${input_data.op1_ID} owes operator ${
              input_data.op2_ID
            } ${ans} for ${document.querySelector("#PeriodFrom").value}`;
            console.log(ansstr);
            console.log(OnetoTwo, TwotoOne);
          } else {
            let tmp = -OnetoTwo + TwotoOne;
            let ans = Math.round(tmp*100)/100;
            var ansstr = document.getElementById("ansstr");
            ansstr.innerHTML = `Operator ${input_data.op2_ID} owes operator ${
              input_data.op1_ID
            } ${ans} for ${document.querySelector("#PeriodFrom").value}`;
            console.log(ansstr);
            console.log(OnetoTwo, TwotoOne);
          }
        })

        .catch((error) => console.error(error));
    })

    .catch((error) => console.error(error));
});
