let collection = JSON.parse(localStorage.getItem("collection")) || [];
let gameCards = JSON.parse(localStorage.getItem("gameCards")) || [];
let dropRates = JSON.parse(localStorage.getItem("dropRates")) || {
  common: 60,
  rare: 25,
  epic: 10,
  legendary: 4,
  mythic: 1
};

/* =====================
   INIT CARDS
===================== */
if (gameCards.length === 0) {
  gameCards = [
    { id: 1, name: "Pikachu", rarity: "common", index: 1 },
    { id: 2, name: "Evoli", rarity: "rare", index: 2 },
    { id: 3, name: "Mewtwo", rarity: "legendary", index: 3 },
    { id: 4, name: "Arceus", rarity: "mythic", index: 4 }
  ];
  saveGameCards();
}

/* =====================
   NAV
===================== */
function showScreen(screen) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (screen === "booster") renderBooster();
  if (screen === "collection") renderCollection();
  if (screen === "admin") renderAdmin();
}

/* =====================
   BOOSTER + ANIMATION
===================== */
function renderBooster() {
  document.getElementById("app").innerHTML = `
    <h2>🎁 Booster</h2>
    <button onclick="openBooster()">Ouvrir booster</button>
    <div id="boosterResult"></div>
  `;
}

function getRandomCard() {
  const roll = Math.random() * 100;

  let pool = [];

  if (roll < dropRates.mythic) {
    pool = gameCards.filter(c => c.rarity === "mythic");
  } else if (roll < dropRates.mythic + dropRates.legendary) {
    pool = gameCards.filter(c => c.rarity === "legendary");
  } else if (roll < dropRates.mythic + dropRates.legendary + dropRates.epic) {
    pool = gameCards.filter(c => c.rarity === "epic");
  } else if (roll < dropRates.mythic + dropRates.legendary + dropRates.epic + dropRates.rare) {
    pool = gameCards.filter(c => c.rarity === "rare");
  } else {
    pool = gameCards.filter(c => c.rarity === "common");
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function openBooster() {
  const result = document.getElementById("boosterResult");
  result.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const card = getRandomCard();

    let existing = collection.find(c => c.name === card.name);

    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      collection.push({
        ...card,
        index: collection.length + 1,
        count: 1
      });
    }

    saveCollection();

    result.innerHTML += `
      <div class="booster-card">
        <div class="tcg-card ${card.rarity}">
          <h3>${card.name}</h3>
          <p>${card.rarity}</p>
        </div>
      </div>
    `;
  }
}

/* =====================
   COLLECTION = POKÉMON TCG POCKET STYLE
===================== */
function renderCollection() {
  const app = document.getElementById("app");

  app.innerHTML = `<h2>📚 Collection</h2><div class="catalogue">`;

  gameCards.forEach(card => {
    const owned = collection.find(c => c.name === card.name);

    app.innerHTML += `
      <div class="tcg-card ${card.rarity} ${owned ? "" : "locked"}">
        <h3>${card.name}</h3>
        <p>${card.rarity}</p>

        ${
          owned
            ? `<span class="badge">x${owned.count}</span>`
            : `<p>Non obtenu</p>`
        }
      </div>
    `;
  });

  app.innerHTML += `</div>`;
}

/* =====================
   ADMIN + DELETE CARDS
===================== */
function renderAdmin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>🛠️ Admin</h2>

    <input id="name" placeholder="Nom"><br><br>

    <select id="rarity">
      <option value="common">Common</option>
      <option value="rare">Rare</option>
      <option value="epic">Epic</option>
      <option value="legendary">Legendary</option>
      <option value="mythic">Mythic</option>
    </select><br><br>

    <input id="index" type="number" placeholder="Index"><br><br>

    <button onclick="addCard()">Ajouter carte</button>

    <hr>

    <div id="list"></div>
  `;

  renderList();
}

/* add card */
function addCard() {
  const name = document.getElementById("name").value;
  const rarity = document.getElementById("rarity").value;
  const index = parseInt(document.getElementById("index").value);

  if (!name || !index) return;

  gameCards.push({
    id: Date.now(),
    name,
    rarity,
    index
  });

  saveGameCards();
  renderAdmin();
}

/* LIST + DELETE */
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  gameCards.forEach((c, i) => {
    list.innerHTML += `
      <div class="tcg-card ${c.rarity}">
        <h4>${c.name}</h4>
        <p>#${c.index}</p>
        <button onclick="deleteCard(${i})">🗑️ Supprimer</button>
      </div>
    `;
  });
}

function deleteCard(index) {
  gameCards.splice(index, 1);
  saveGameCards();
  renderAdmin();
}

/* =====================
   SAVE
===================== */
function saveCollection() {
  localStorage.setItem("collection", JSON.stringify(collection));
}

function saveGameCards() {
  localStorage.setItem("gameCards", JSON.stringify(gameCards));
}

/* =====================
   START
===================== */
showScreen("booster");