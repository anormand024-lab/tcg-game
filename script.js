let collection = JSON.parse(localStorage.getItem("collection")) || [];

const cards = [
  { name: "Pikachu", rarity: "common" },
  { name: "Dracaufeu", rarity: "rare" },
  { name: "Mewtwo", rarity: "legendary" }
];

function showScreen(screen) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (screen === "booster") {
    app.innerHTML = `
      <h2>🎁 Booster</h2>
      <button onclick="openBooster()">Ouvrir un booster</button>
      <div id="boosterResult"></div>
    `;
  }

  if (screen === "collection") {
    renderCollection();
  }
}

function openBooster() {
  const result = document.getElementById("boosterResult");
  result.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const card = cards[Math.floor(Math.random() * cards.length)];

    collection.push(card);
    save();

    result.innerHTML += `
      <div class="card">
        <h3>${card.name}</h3>
        <p>${card.rarity}</p>
      </div>
    `;
  }
}

function renderCollection() {
  const app = document.getElementById("app");

  app.innerHTML = "<h2>📚 Collection</h2>";

  collection.forEach(card => {
    app.innerHTML += `
      <div class="card">
        <h3>${card.name}</h3>
        <p>${card.rarity}</p>
      </div>
    `;
  });
}

function save() {
  localStorage.setItem("collection", JSON.stringify(collection));
}

// écran par défaut
showScreen("booster");