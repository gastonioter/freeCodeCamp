let price = 3.26;
let cid = [
  ["ONE HUNDRED", 100],
  ["TWENTY", 60],
  ["TEN", 20],
  ["FIVE", 55],
  ["ONE", 90],
  ["QUARTER", 4.25],
  ["DIME", 3.1],
  ["NICKEL", 2.05],
  ["PENNY", 1.01],
];

const unitCurrenciesMap = {
  "ONE HUNDRED": 100,
  TWENTY: 20,
  TEN: 10,
  FIVE: 5,
  ONE: 1,
  QUARTER: 0.25,
  DIME: 0.1,
  NIKEL: 0.05,
  PENNY: 0.01,
};

const cidObj = {
  "ONE HUNDRED": 100,
  TWENTY: 60,
  TEN: 20,
  FIVE: 55,
  ONE: 90,
  QUARTER: 4.25,
  DIME: 3.1,
  NICKEL: 2.05,
  PENNY: 1.01,
};

const changeInDrawerUl = document.getElementById("change-in-drawer-list");
const changeDueEl = document.getElementById("change-due");
const userInputEl = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const totalEl = document.getElementById("total");

function updateChangeInDrawerList() {
  changeInDrawerUl.innerHTML = "";
  changeInDrawerUl.innerHTML = cid
    .slice()
    .reverse()
    .map(
      (change) =>
        `<li>${change[0]
          .charAt(0)
          .concat(change[0].substring(1).toLowerCase())}: \$${change[1].toFixed(
          2
        )}</li>`
    )
    .join("");
}

function handlePurchase(e) {
  e.preventDefault();

  if (!isValidInput(userInputEl.value))
    return alert("Pleas enter a valid number");

  const cash = +parseFloat(userInputEl.value).toFixed(2);

  const { status, change } = checkCashRegister(price, cash, cid);

  updateDrawerState(status, change);

  // update cid values (cid[1])
}

function updateDrawerState(status, change) {
  if (status === "CLOSED" && !change.length) {
    changeDueEl.innerHTML =
      "<p>No change due - customer paid with exact cash</p>";
    return;
  }

  if (status === "INSUFFICIENT_FOUNDS") {
    changeDueEl.innerHTML = `<p>INSUFFICIENT_FOUNDS</p>`;
    return;
  }

  changeDueEl.innerHTML = `<p>Status: ${status}</p>`;

  if (change.length) {
    changeDueEl.innerHTML += change
      .map((ch) => `<p>${ch[0]}: $${ch[1]}</p>`)
      .join("");
  }
}

function checkCashRegister(price, cash, cid) {
  const cashInDraw = cid.map((unit) => {
    return {
      [unit[0]]: unit[1],
    };
  });

  let changeDue = cash - price;
  let totalCID = +cid.reduce((acc, curr) => acc + curr[1], 0).toFixed(2);

  if (totalCID < changeDue) {
    return { status: "INSUFFICIENT_FOUNDS", change: [] };
  }

  if (totalCID === changeDue) {
    return { status: "CLOSED", change: cid };
  }

  if (changeDue === 0) {
    return { status: "CLOSED", change: [] };
  }

  let change = [];
  const status = "OPEN";

  for (const currencyKey in unitCurrenciesMap) {
    const currencyUnitValue = unitCurrenciesMap[currencyKey];
    const currencyUnitValueTotal = cidObj[currencyKey];
    const currencyUnitAmout = +(
      currencyUnitValueTotal / currencyUnitValue
    ).toFixed(0);

    currencyKey === "QUARTER" && console.log(currencyUnitAmout);

    while (changeDue >= currencyUnitValue && currencyUnitAmout > 0) {
      changeDue -= currencyUnitValue;

      cidObj[currencyKey] -= currencyUnitValue;
      const changeCurrency = change.find((el) => el[0] === currencyKey);
      !changeCurrency
        ? change.push([currencyKey, currencyUnitValue])
        : (changeCurrency[1] += currencyUnitValue);
    }
  }

  if (+changeDue.toFixed(0) > 0) {
    return { status: "INSUFFICIENT_FOUNDS", change: [] };
  }

  updateCidArray();
  updateChangeInDrawerList();

  return {
    status,
    change,
  };
}

function updateCidArray() {
  cid.forEach((el) => {
    el[1] = cidObj[el[0]];
  });
}
function isValidInput() {
  return (
    /^\d+[.]?\d*$/.test(userInputEl.value) &&
    !isNaN(parseFloat(userInputEl.value))
  );
}

function clear() {
  changeDueEl.innerHTML = "";
}

function init() {
  updateChangeInDrawerList();
  totalEl.textContent = `Total: $${price}`;
  clear();
  purchaseBtn.addEventListener("click", handlePurchase);
}

init();
