const phoneInp = document.getElementById("user-input");
const resultsList = document.getElementById("results-div");
const actionsContainer = document.querySelector(".form__actions");

function handleAction(e) {
  e.preventDefault();

  const { target } = e;

  if (target.id === "check-btn") {
    const number = phoneInp.value;
    if (!number) return alert("Please provide a phone number");

    const isValid = validatePhoneNumber(number);
    addToList(number, isValid);
    phoneInp.value = "";
    return;
  }

  if (target.id === "clear-btn") {
    resultsList.innerHTML = "";
    return;
  }
}

function validatePhoneNumber(number) {
  const USAPhoneRegex =
    /^(1?) ?(\(\d\d\d\)|\d\d\d)[\s|-]?(\d\d\d)[\s|-]?(\d\d\d\d)$/;

  return USAPhoneRegex.test(number);
}

function addToList(phone, isValid = true) {
  const li = ` <li class="result-item">${
    isValid ? "Valid" : "Invalid"
  } US number: ${phone}</li>`;

  resultsList.insertAdjacentHTML("afterbegin", li);
}

actionsContainer.addEventListener("click", handleAction);
