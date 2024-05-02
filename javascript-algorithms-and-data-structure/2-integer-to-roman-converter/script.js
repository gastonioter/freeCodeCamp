const inputEl = document.querySelector("#number");
const convertBtn = document.querySelector("#convert-btn");
const output = document.querySelector("#output");
const result = document.querySelector("#result");
const form = document.querySelector("form");

function validateInput(value) {
  const errors = [
    {
      error: "min",
      msg: "Please enter a number greater than or equal to 1",
      active: false,
    },
    {
      error: "max",
      msg: "Please enter a number less than or equal to 3999",
      active: false,
    },
    {
      error: "empty",
      msg: "Please enter a valid number",
      active: false,
    },
  ];

  function isLessThan(min) {
    errors[0].active = value < min ? true : false;
  }

  function isGratherThan(max) {
    errors[1].active = value > max ? true : false;
  }

  const isEmpty = (value) => (errors[2].active = !value ? true : false);

  isLessThan(1);
  isGratherThan(3999);
  isEmpty(value);

  const thereIsError = errors.find((error) => error.active === true);
  if (thereIsError) return renderError(thereIsError);

  output.classList.remove("error");
  result.textContent = decimalToRoman(value);
  console.log(errors);
}

function renderError(error) {
  output.classList.add("error");
  result.textContent = error.msg;
}

function convert(e) {
  e.preventDefault();
  const valueInt = parseInt(inputEl.value);
  // CHECK INPUT VALIDITY
  validateInput(valueInt);
  // MAKE THE CONVERSION
}
const romanSymbols = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
};

function decimalToRoman(number) {
  let result = "";

  for (const prop in romanSymbols) {
    while (number >= romanSymbols[prop]) {
      result += prop;
      number -= romanSymbols[prop];
    }
  }

  return result;
}

function renderMessage(message) {
  result.textContent = message;
}

form.addEventListener("submit", convert);
