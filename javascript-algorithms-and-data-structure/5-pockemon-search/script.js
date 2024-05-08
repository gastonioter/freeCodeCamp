let isFetching = false;

const form = document.querySelector(".form");
const pokemonInp = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-button");
const pokemonNameEl = document.querySelector("#pokemon-name");
const idEl = document.querySelector("#pokemon-id");
const widthEl = document.querySelector("#weight");
const heightEl = document.querySelector("#height");
const typesContainer = document.querySelector("#types");
const hpEl = document.querySelector("#hp");
const attackEl = document.querySelector("#attack");
const defenseEl = document.querySelector("#defense");
const spAttackEl = document.querySelector("#special-attack");
const spDfenseEl = document.querySelector("#special-defense");
const speedEl = document.querySelector("#speed");
const pokemonImg = document.querySelector("#sprite");

let pokemonFetched = null;

async function handleSubmit(e) {
  e.preventDefault();
  if (!pokemonInp.value) return alert("Please enter a pokémon name or id");

  const pokemonToSearch = pokemonInp.value;
  await fetchPokemon(pokemonToSearch);

  if (pokemonFetched) {
    renderPokemonData();
  } else {
    resetData();
  }
}

function renderPokemonData() {
  const { name, id, height, weight, types, stats, sprites } = pokemonFetched;
  console.log(stats);

  pokemonNameEl.textContent = `${name.toUpperCase()} `;
  idEl.textContent = `#${id}`;

  widthEl.textContent = `Weight: ${weight}`;
  heightEl.textContent = `Height: ${height}`;
  typesContainer.innerHTML = types
    .map(({ type }) => `<span class="type">${type.name.toUpperCase()}</span>`)
    .join("");

  stats.forEach(({ stat, base_stat }) => {
    console.log(stat);

    document.getElementById(stat.name).textContent = base_stat;
  });

  pokemonImg.src = sprites.front_default;
}

function resetData() {
  pokemonNameEl.textContent = "";
  idEl.textContent = "";
  widthEl.textContent = "";
  heightEl.textContent = "";
  typesContainer.innerHTML = "";
  hpEl.textContent = "";
  attackEl.textContent = "";
  spAttackEl.textContent = "";
  defenseEl.textContent = "";
  spDfenseEl.textContent = "";
  speedEl.textContent = "";
  pokemonImg.src = "";
  pokemonImg.alt = "";
}
async function fetchPokemon(pokemon) {
  try {
    updateFetchingUI(true);
    const res = await fetch(
      `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemon.toLowerCase()}`
    );

    if (!res.ok) throw new Error("Pokémon not found");

    const data = await res.json();
    console.log(data);

    if (!data) throw new Error("Pokémon not found");

    pokemonFetched = data;
  } catch (err) {
    pokemonFetched = null;
    alert(err.message);
  } finally {
    updateFetchingUI(false);
  }
}

function updateFetchingUI(value) {
  isFetching = value;
  searchBtn.style.cursor = isFetching ? "not-allowed" : "pointer";
  searchBtn.textContent = isFetching ? "Loading..." : "Search";
}
form.addEventListener("submit", handleSubmit);
