const phoneInp = document.getElementById("user-input");
const resultsList = document.getElementById("results-div");
const actionsContainer = document.querySelector(".form__actions");

function handleAction(e) {
  e.preventDefault();

  const { target } = e;

  if (target.id === "check-button") {
    const number = phoneInp.value;
    if (!number) return alert("Please provide a phone number");

    const isValid = validatePhoneNumber(number);
    addToList(number, isValid);
    phoneInp.value = "";
    return;
  }

  if (target.id === "clear-button") {
    resultsList.innerHTML = "";
    return;
  }
}

function validatePhoneNumber(number) {
  const USAPhoneRegex = /[1*]555 555 5555/;

  return USAPhoneRegex.test(number);
}

function addToList(phone, isValid = true) {
  const li = ` <li class="result-item">${
    isValid ? "Valid" : "Invalid"
  } US number: ${phone}</li>`;

  resultsList.insertAdjacentHTML("afterbegin", li);
}

actionsContainer.addEventListener("click", handleAction);
