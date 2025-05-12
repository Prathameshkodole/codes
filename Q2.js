function calculate(operation) {
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  let result = "";

  if (isNaN(num1) || isNaN(num2)) {
    result = "Please enter valid numbers.";
  } else {
    switch(operation) {
      case 'add': result = `Result: ${num1 + num2}`; break;
      case 'sub': result = `Result: ${num1 - num2}`; break;
      case 'mul': result = `Result: ${num1 * num2}`; break;
      case 'div': 
        if (num2 === 0) result = "Cannot divide by zero.";
        else result = `Result: ${num1 / num2}`;
        break;
    }
  }
  document.getElementById("calcResult").innerText = result;
}

function convertToFahrenheit() {
  const celsius = parseFloat(document.getElementById("celsius").value);
  if (isNaN(celsius)) {
    document.getElementById("fahrenheitResult").innerText = "Enter a valid number.";
  } else {
    const fahrenheit = (celsius * 9/5) + 32;
    document.getElementById("fahrenheitResult").innerText = `Fahrenheit: ${fahrenheit.toFixed(2)}°F`;
  }
}

function convertCurrency() {
  const usd = parseFloat(document.getElementById("usd").value);
  const currency = document.getElementById("currency").value;
  let rate = 0;

  if (isNaN(usd)) {
    document.getElementById("currencyResult").innerText = "Enter a valid USD amount.";
    return;
  }

  switch (currency) {
    case "EUR": rate = 0.91; break;
    case "GBP": rate = 0.78; break;
    case "INR": rate = 83.5; break;
  }

  const converted = usd * rate;
  document.getElementById("currencyResult").innerText = `${usd} USD = ${converted.toFixed(2)} ${currency}`;
}
