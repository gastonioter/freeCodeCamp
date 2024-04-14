const wordInputEl = document.getElementById("text-input");
const resultEl = document.getElementById("result");
const form = document.querySelector(".form");

form.addEventListener("submit", checkIsPalindrome);

function getCleanSentence(text) {
  const regex = /[^a-z0-9]/g;
  return text.toLowerCase().replace(regex, "");
}

function checkIsPalindrome(e) {
  e.preventDefault();
  if (!e.target.sentence.value) {
    alert("Please input a value");
  }

  const text = e.target.sentence.value;
  const safeText = getCleanSentence(text);
  const reversed = safeText.split("").reverse().join("");
  const isPalindrome = reversed === safeText;

  const resultHTML = `
  <strong>${text}</strong> ${
    isPalindrome ? "is a palindrome" : "is not a palindrome"
  }
  `;

  resultEl.innerHTML = resultHTML;
}
