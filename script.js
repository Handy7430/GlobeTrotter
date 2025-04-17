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
async function checkGuess() {
  const input = userInput.value.trim().toLowerCase();
  const correct = currentCountry.name.toLowerCase();
  feedback.textContent = input === correct ? "🎉 Correct!" : "❌ Try again!";
  feedback.style.color = input === correct ? "green" : "red";

  // If correct, fetch and display facts
  if (input === correct) {
    const facts = await loadCountryFacts(currentCountry.name);
    if (facts) {
      document.getElementById("country-facts").innerHTML = `
        <p><img src="${facts.flag}" alt="Flag of ${currentCountry.name}"> 
          <strong>Capital:</strong> ${facts.capital}</p>
        <p><strong>Population:</strong> ${facts.population}</p>
      `;
    }
  } else {
    // Clear any previous facts
    document.getElementById("country-facts").textContent = "";
  }
}

document.getElementById("guess-button").addEventListener("click", checkGuess);
document.getElementById("next-button").addEventListener("click", showRandomCountry);
document.getElementById("user-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkGuess();
});

window.onload = loadCountries;
async function loadCountryFacts(name) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    const [data] = await res.json();
    return {
      capital: data.capital?.[0] || "N/A",
      population: data.population.toLocaleString(),
      flag: data.flags.png
    };
  } catch (e) {
    console.error("Facts fetch failed", e);
    return null;
  }
}

