let collection = JSON.parse(localStorage.getItem("collection")) || [];
let gameCards = JSON.parse(localStorage.getItem("gameCards")) || [];
let dropRates = JSON.parse(localStorage.getItem("dropRates")) || {
  common: 70,
  rare: 25,
  legendary: 5
};

/* =========================
   INIT CARTES
========================= */
if (gameCards.length === 0) {
  gameCards = [
    { id: 1, name: "Pikachu", rarity: "common", index: 1 },
    { id: 2, name: "Dracaufeu", rarity: "rare", index: 2 },
    { id: 3, name: "Mewtwo", rarity: "legendary", index: 3 },
    { id: 4, name: "Evoli", rarity: "common", index: 4 },
    { id: 5, name: "Lugia", rarity: "legendary", index: 5 }
  ];
  saveGameCards();
}

/* =========================
   NAVIGATION
========================= */
function showScreen(screen) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (screen === "booster") renderBooster();
  if (screen === "collection") renderCollection();
  if (screen === "admin") renderAdmin();
}

/* =========================
   BOOSTER SYSTEM
========================= */
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

  if (roll < dropRates.legendary) {
    pool = gameCards.filter(c => c.rarity === "legendary");
  } else if (roll < dropRates.legendary + dropRates.rare) {
    pool = gameCards.filter(c => c.rarity === "rare");
  } else {
    pool = gameCards.filter(c => c.rarity === "common");
  }

  if (pool.length === 0) pool = gameCards;

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
      <div class="card">
        <h3>${card.name}</h3>
        <p>${card.rarity}</p>
      </div>
    `;
  }
}

/* =========================
   COLLECTION GRID (100 SLOTS)
========================= */
function renderCollection() {
  const app = document.getElementById("app");

  app.innerHTML = "<h2>📚 Collection</h2>";

  app.innerHTML += `<div class="grid">`;

  for (let i = 1; i <= 100; i++) {
    const card = collection.find(c => c.index === i);

    if (card) {
      app.innerHTML += `
        <div class="card owned">
          <h4>${card.name}</h4>
          <p>${card.rarity}</p>
          <small>#${i}</small>
          <span class="count">x${card.count || 1}</span>
        </div>
      `;
    } else {
      app.innerHTML += `
        <div class="card locked">
          <h4>???</h4>
          <small>#${i}</small>
        </div>
      `;
    }
  }

  app.innerHTML += `</div>`;
}

/* =========================
   ADMIN SYSTEM
========================= */
function renderAdmin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>🛠️ Admin</h2>

    <input id="name" placeholder="Nom carte"><br><br>

    <select id="rarity">
      <option value="common">Common</option>
      <option value="rare">Rare</option>
      <option value="legendary">Legendary</option>
    </select><br><br>

    <input id="index" type="number" placeholder="Index (1-100)"><br><br>

    <button onclick="addCard()">Ajouter carte</button>

    <hr>

    <h3>🎲 Drop rates (%)</h3>

    <input id="c" type="number" value="${dropRates.common}"> Common<br>
    <input id="r" type="number" value="${dropRates.rare}"> Rare<br>
    <input id="l" type="number" value="${dropRates.legendary}"> Legendary<br>

    <button onclick="saveRates()">Save rates</button>

    <hr>

    <div id="list"></div>
  `;

  renderList();
}

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

function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  gameCards.forEach(c => {
    list.innerHTML += `
      <div class="card">
        <h4>${c.name}</h4>
        <p>${c.rarity}</p>
        <small>#${c.index}</small>
      </div>
    `;
  });
}

/* =========================
   SAVE SYSTEM
========================= */
function saveCollection() {
  localStorage.setItem("collection", JSON.stringify(collection));
}

function saveGameCards() {
  localStorage.setItem("gameCards", JSON.stringify(gameCards));
}

function saveRates() {
  dropRates = {
    common: parseInt(document.getElementById("c").value),
    rare: parseInt(document.getElementById("r").value),
    legendary: parseInt(document.getElementById("l").value)
  };

  localStorage.setItem("dropRates", JSON.stringify(dropRates));
  alert("Saved !");
}

/* =========================
   START
========================= */
showScreen("booster");