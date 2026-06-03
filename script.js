let collection = JSON.parse(localStorage.getItem("collection")) || [];
let gameCards = JSON.parse(localStorage.getItem("gameCards")) || [];

/* =====================
   INIT CARDS
===================== */
if (gameCards.length === 0) {
  gameCards = [
    { id: 1, name: "Pikachu", rarity: "common", index: 1 },
    { id: 2, name: "Evoli", rarity: "rare", index: 2 },
    { id: 3, name: "Dracaufeu", rarity: "legendary", index: 3 },
    { id: 4, name: "Mewtwo", rarity: "mythic", index: 4 }
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
   BOOSTER (5 CARDS FIXED)
===================== */
function renderBooster() {
  document.getElementById("app").innerHTML = `
    <h2>🎁 Booster</h2>
    <button onclick="openBooster()">Ouvrir booster</button>
    <div id="boosterResult"></div>
  `;
}

function getRandomCard() {
  return gameCards[Math.floor(Math.random() * gameCards.length)];
}

async function openBooster() {
  const result = document.getElementById("boosterResult");
  result.innerHTML = "";

  const PACK_SIZE = 5;

  for (let i = 0; i < PACK_SIZE; i++) {
    const card = getRandomCard();

    let existing = collection.find(c => c.name === card.name);

    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      collection.push({
        ...card,
        count: 1
      });
    }

    saveCollection();

    const el = document.createElement("div");
    el.className = "pack-card";
    el.innerHTML = `
      <div class="card ${card.rarity}">
        <h3>${card.name}</h3>
        <p>${card.rarity}</p>
      </div>
    `;

    result.appendChild(el);

    await new Promise(r => setTimeout(r, 600));
  }
}

/* =====================
   COLLECTION (POKÉDEX STYLE)
===================== */
function renderCollection() {
  const app = document.getElementById("app");

  app.innerHTML = `<h2>📚 Collection</h2><div class="grid">`;

  gameCards.forEach(card => {
    const owned = collection.find(c => c.name === card.name);

    app.innerHTML += `
      <div class="card ${card.rarity}">
        <h3>${card.name}</h3>
        <p>${card.rarity}</p>

        <span class="badge ${owned ? "owned" : "locked"}">
          ${owned ? "OBTENU" : "NON OBTENU"}
        </span>

        ${
          owned
            ? `<div class="count">x${owned.count}</div>`
            : `<div class="count">???</div>`
        }
      </div>
    `;
  });

  app.innerHTML += `</div>`;
}

/* =====================
   ADMIN + DELETE
===================== */
function renderAdmin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>🛠️ Admin</h2>

    <input id="name" placeholder="Nom"><br><br>

    <select id="rarity">
      <option value="common">Common</option>
      <option value="rare">Rare</option>
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

  gameCards.forEach((c, i) => {
    list.innerHTML += `
      <div class="card">
        <h4>${c.name}</h4>
        <p>${c.rarity}</p>
        <small>#${c.index}</small>
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