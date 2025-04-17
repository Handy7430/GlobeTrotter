let countries = [];
let currentCountry = null;

// DOM refs
const userInput    = document.getElementById("user-input");
const feedback     = document.getElementById("feedback");
const nextButton   = document.getElementById("next-button");
const dataList     = document.getElementById("country-suggestions");
const factsDiv     = document.getElementById("country-facts");

// Load countries.json (fallback to hardcoded if it fails)
async function loadCountries() {
  try {
    const res = await fetch("countries.json");
    countries = await res.json();
  } catch (e) {
    console.error("Failed to load countries.json, using fallback.", e);
    countries = [
      { name: "Morocco" },
      { name: "France" }
    ];
  }
  populateSuggestions();
  showRandomCountry();
}

// Populate autocomplete list
function populateSuggestions() {
  dataList.innerHTML = "";
  countries.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    dataList.appendChild(opt);
  });
}

// Show a random country
function showRandomCountry() {
  const idx = Math.floor(Math.random() * countries.length);
  currentCountry = countries[idx];
  feedback.textContent = "";
  factsDiv.innerHTML = "";
  userInput.value = "";
}

// Fetch and display country facts
async function loadCountryFacts(name) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`
    );
    const [data] = await res.json();
    return {
      capital: data.capital?.[0] || "N/A",
      population: data.population.toLocaleString(),
      flag: data.flags.png
    };
  } catch (e) {
    console.error("Could not fetch facts for", name, e);
    return null;
  }
}

// Check the user's guess
async function checkGuess() {
  const guess   = userInput.value.trim().toLowerCase();
  const actual  = currentCountry.name.toLowerCase();
  feedback.textContent = guess === actual ? "🎉 Correct!" : "❌ Try again!";
  feedback.style.color = guess === actual ? "green" : "red";

  if (guess === actual) {
    const facts = await loadCountryFacts(currentCountry.name);
    if (facts) {
      factsDiv.innerHTML = `
        <p><img src="${facts.flag}" alt="Flag of ${currentCountry.name}"> 
           <strong>Capital:</strong> ${facts.capital}</p>
        <p><strong>Population:</strong> ${facts.population}</p>
      `;
    }
  } else {
    factsDiv.innerHTML = "";
  }
}

// Event listeners
document.getElementById("guess-button").addEventListener("click", checkGuess);
nextButton.addEventListener("click", showRandomCountry);
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") checkGuess();
});

// Initialize globe and countries
window.onload = async () => {
  await loadCountries();

  const world = Globe()(document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');

  world.controls().autoRotate = true;
  world.controls().autoRotateSpeed = 0.5;
};
