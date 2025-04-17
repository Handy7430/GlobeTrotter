let countries = [];
let currentCountry = null;

async function loadCountries() {
  try {
    const response = await fetch("countries.json");
    countries = await response.json();
    populateSuggestions();
    showRandomCountry();
  } catch (error) {
    console.error("Error loading countries:", error);
  }
}

function populateSuggestions() {
  const datalist = document.getElementById("country-suggestions");
  datalist.innerHTML = "";
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.name;
    datalist.appendChild(option);
  });
}

function showRandomCountry() {
  const randomIndex = Math.floor(Math.random() * countries.length);
  currentCountry = countries[randomIndex];

  const image = document.getElementById("country-image");
  image.src = currentCountry.image;
  image.alt = "Country silhouette";

  document.getElementById("user-input").value = "";
  document.getElementById("feedback").textContent = "";
}

function checkGuess() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  const correct = currentCountry.name.toLowerCase();
  const feedback = document.getElementById("feedback");

  if (input === correct) {
    feedback.textContent = "🎉 Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";
  }
}

document.getElementById("guess-button").addEventListener("click", checkGuess);
document.getElementById("next-button").addEventListener("click", showRandomCountry);
document.getElementById("user-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkGuess();
});

window.onload = loadCountries;
