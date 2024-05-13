let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

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

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cash === price) {
    changeDueEl.innerHTML =
      "<p>No change due - customer paid with exact cash</p>";
    return;
  }

  const { status, change } = checkCashRegister(price, cash, cid);

  updateDrawerState(status, change);

  updateChangeInDrawerList();
}

function updateDrawerState(status, change) {
  changeDueEl.innerHTML = `<p>Status: ${status}</p>`;

  if (change.length) {
    changeDueEl.innerHTML += change
      .map((ch) => `<p>${ch[0]}: $${ch[1]}</p>`)
      .join("");
  }
}

function checkCashRegister(price, cash, cid) {
  const availableCurrency = {
    PENNY: 0.01,
    NICKEL: 0.05,
    DIME: 0.1,
    QUARTER: 0.25,
    ONE: 1,
    FIVE: 5,
    TEN: 10,
    TWENTY: 20,
    "ONE HUNDRED": 100,
  };

  let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0).toFixed(2);
  let changeDue = cash - price;

  if (parseFloat(totalCid) < changeDue) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  } else if (parseFloat(totalCid) === changeDue) {
    return { status: "CLOSED", change: cid };
  } else {
    let changeDueArray = [];

    for (let i = cid.length - 1; i >= 0; i--) {
      const currencyName = cid[i][0];
      const currencyUnitValue = availableCurrency[currencyName];
      const currecnyTotalValue = cid[i][1];
      let currencyQty = (currecnyTotalValue / currencyUnitValue).toFixed(0);

      let amountToGiveOfCurrencyUnit = 0;

      while (changeDue >= currencyUnitValue && currencyQty > 0) {
        changeDue = (changeDue - currencyUnitValue).toFixed(2);
        currencyQty--;
        amountToGiveOfCurrencyUnit += currencyUnitValue;
      }

      if (amountToGiveOfCurrencyUnit > 0) {
        changeDueArray.push([currencyName, amountToGiveOfCurrencyUnit]);
      }
      cid[i][1] -= amountToGiveOfCurrencyUnit;
    }

    if (changeDue > 0) {
      return { status: "INSUFFICIENT_FUNDS", change: [] };
    } else {
      return { status: "OPEN", change: changeDueArray };
    }
  }
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
  clear();
  totalEl.textContent = `Total: $${price}`;
  purchaseBtn.addEventListener("click", handlePurchase);
  updateChangeInDrawerList();
}

init();
