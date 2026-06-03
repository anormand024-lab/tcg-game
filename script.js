let collection = JSON.parse(localStorage.getItem("collection")) || [];

// 🃏 cartes du jeu
const cards = [
  { id: 1, name: "Pikachu", rarity: "common" },
  { id: 2, name: "Dracaufeu", rarity: "rare" },
  { id: 3, name: "Mewtwo", rarity: "legendary" },
  { id: 4, name: "Evoli", rarity: "common" },
  { id: 5, name: "Lugia", rarity: "legendary" }
];

// 📱 navigation
function showScreen(screen) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (screen === "booster") {
    app.innerHTML = `
      <h2 class="booster-title">🎁 Ouverture du booster</h2>
      <button onclick="openBooster()">Ouvrir</button>
      <div id="boosterResult"></div>
    `;
  }

  if (screen === "collection") {
    renderCollection();
  }
}

// 🎁 ouvrir booster
function openBooster() {
  const result = document.getElementById("boosterResult");
  result.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const card = cards[Math.floor(Math.random() * cards.length)];

    // sauvegarde collection
    collection.push({
      ...card,
      index: collection.length + 1
    });

    save();

    // HTML carte avec flip
    result.innerHTML += `
      <div class="card booster-card" onclick="flipCard(this)">
        <div class="card-inner">
          <div class="card-face card-front">
            ❓ Carte
          </div>

          <div class="card-face card-back">
            <div>
              <h3>${card.name}</h3>
              <p>${card.rarity}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// 🔄 flip carte
function flipCard(el) {
  el.classList.toggle("flipped");
}

// 📚 collection
function renderCollection() {
  const app = document.getElementById("app");

  app.innerHTML = "<h2>📚 Collection</h2>";

  if (collection.length === 0) {
    app.innerHTML += "<p>Aucune carte</p>";
    return;
  }

  collection.forEach(card => {
    app.innerHTML += `
      <div class="card">
        <h3>${card.name}</h3>
        <p>${card.rarity}</p>
        <small>#${card.index}</small>
      </div>
    `;
  });
}

// 💾 sauvegarde
function save() {
  localStorage.setItem("collection", JSON.stringify(collection));
}

// 🚀 écran par défaut
showScreen("booster");