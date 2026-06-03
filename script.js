let collection = JSON.parse(localStorage.getItem("collection")) || [];
let gameCards = JSON.parse(localStorage.getItem("gameCards")) || [];
let dropRates = JSON.parse(localStorage.getItem("dropRates")) || {
  common: 70,
  rare: 25,
  legendary: 5
};

// 🧱 base si vide
if (gameCards.length === 0) {
  gameCards = [
    { id: 1, name: "Pikachu", rarity: "common", image: "", index: 1 },
    { id: 2, name: "Dracaufeu", rarity: "rare", image: "", index: 2 },
    { id: 3, name: "Mewtwo", rarity: "legendary", image: "", index: 3 }
  ];
  saveGameCards();
}

/* =====================
   NAVIGATION
===================== */
function showScreen(screen) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (screen === "booster") renderBooster();
  if (screen === "collection") renderCollection();
  if (screen === "admin") renderAdmin();
}

/* =====================
   BOOSTER
===================== */
function renderBooster() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>🎁 Booster</h2>
    <button onclick="openBooster()">Ouvrir booster</button>
    <div id="boosterResult"></div>
  `;
}

// 🎲 random selon rates
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

    const newCard = {
      ...card,
      index: collection.length + 1
    };

    collection.push(newCard);
    saveCollection();

    result.innerHTML += createCardHTML(newCard, true);
  }
}

/* =====================
   CARD UI
===================== */
function createCardHTML(card, flip = false) {
  return `
    <div class="card ${flip ? "booster-card" : ""}" onclick="flipCard(this)">
      <div class="card-inner">
        <div class="card-face card-front ${card.rarity}">
          ❓
        </div>
        <div class="card-face card-back">
          <div>
            <h3>${card.name}</h3>
            <p>${card.rarity}</p>
            <small>#${card.index}</small>
          </div>
        </div>
      </div>
    </div>
  `;
}

function flipCard(el) {
  el.classList.toggle("flipped");
}

/* =====================
   COLLECTION 100 SLOTS
===================== */
function renderCollection() {
  const app = document.getElementById("app");

  app.innerHTML = "<h2>📚 Collection (100 slots)</h2>";

  for (let i = 1; i <= 100; i++) {
    const card = collection.find(c => c.index === i);

    if (card) {
      app.innerHTML += `
        <div class="card">
          <h3>${card.name}</h3>
          <p>${card.rarity}</p>
          <small>#${i}</small>
        </div>
      `;
    } else {
      app.innerHTML += `
        <div class="card" style="opacity:0.2">
          <h3>???</h3>
          <small>#${i}</small>
        </div>
      `;
    }
  }
}

/* =====================
   ADMIN
===================== */
function renderAdmin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>🛠️ Admin</h2>

    <input id="name" placeholder="Nom"><br>

    <select id="rarity">
      <option value="common">Common</option>
      <option value="rare">Rare</option>
      <option value="legendary">Legendary</option>
    </select><br>

    <input id="image" placeholder="Image URL"><br>

    <input id="index" type="number" placeholder="Index (1-100)"><br>

    <button onclick="addCard()">Ajouter carte</button>

    <hr>

    <h3>🎲 Drop rates</h3>

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
  const image = document.getElementById("image").value;
  const index = parseInt(document.getElementById("index").value);

  if (!name || !index) return;

  gameCards.push({
    id: Date.now(),
    name,
    rarity,
    image,
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

/* =====================
   SAVE
===================== */
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
  alert("Rates saved !");
}

/* =====================
   START
===================== */
showScreen("booster");