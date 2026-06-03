// ========================
// BASE CARTES
// ========================
const baseCards = [
  { id: 1, name: "Draco", rarity: 1 },
  { id: 2, name: "Aqua", rarity: 2 },
  { id: 3, name: "Pyro", rarity: 3 },
  { id: 4, name: "Luma", rarity: 4 },
  { id: 5, name: "Void", rarity: 5 },
  { id: 6, name: "Chrono", rarity: 6 }
];

// ========================
// DROP RATES
// ========================
const rates = [
  [1, 55],
  [2, 25],
  [3, 12],
  [4, 6],
  [5, 1.5],
  [6, 0.5]
];

// ========================
// STATE GLOBAL
// ========================
let currentPack = [];
let index = 0;
let cooldown = 0;
let interval = null;

// ========================
// LOCAL STORAGE
// ========================
function getCollection() {
  return JSON.parse(localStorage.getItem("cards") || "[]");
}

function saveCollection(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function getAdminCards() {
  return JSON.parse(localStorage.getItem("adminCards") || "[]");
}

// ========================
// MERGE CARTES (BASE + ADMIN)
// ========================
function getAllCards() {
  return [...baseCards, ...getAdminCards()];
}

// ========================
// RARETÉ RNG
// ========================
function getRarity() {
  let r = Math.random() * 100;
  let sum = 0;

  for (let [rarity, rate] of rates) {
    sum += rate;
    if (r <= sum) return rarity;
  }

  return 1;
}

// ========================
// OUVERTURE PACK (5 FIXES)
// ========================
function openPack() {
  const pack = [];

  for (let i = 0; i < 5; i++) {
    const rarity = getRarity();
    const pool = getAllCards().filter(c => c.rarity === rarity);

    const card = pool[Math.floor(Math.random() * pool.length)] || baseCards[0];

    pack.push(card);
  }

  const old = getCollection();
  saveCollection([...old, ...pack]);

  return pack;
}

// ========================
// BOOSTER UI
// ========================
function renderBooster() {
  const el = document.getElementById("booster");

  el.innerHTML = `
    <button id="openBtn">
      ${cooldown > 0 ? "Cooldown " + cooldown + "s" : "Ouvrir Booster"}
    </button>

    <div id="cardDisplay"></div>
  `;

  document.getElementById("openBtn").onclick = openBooster;
}

// ========================
// OPEN BOOSTER FLOW
// ========================
function openBooster() {
  if (cooldown > 0) return;

  currentPack = openPack();
  index = 0;

  showCard();

  const display = document.getElementById("cardDisplay");

  display.onclick = () => {
    index++;

    if (index < currentPack.length) {
      showCard();
    } else {
      display.innerHTML = `<p>Pack terminé 🎉</p>`;
    }
  };

  startCooldown();
}

// ========================
// SHOW CARD (1 PAR 1)
// ========================
function showCard() {
  const display = document.getElementById("cardDisplay");
  const c = currentPack[index];

  display.innerHTML = `
    <div class="card">
      <h2>${c.name}</h2>
      <p>Rarity: ${c.rarity}</p>
      <p>${index + 1} / 5</p>
      <p>Tap pour suivante →</p>
    </div>
  `;
}

// ========================
// COOLDOWN
// ========================
function startCooldown() {
  cooldown = 20;

  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    cooldown--;

    renderBooster();

    if (cooldown <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

// ========================
// COLLECTION
// ========================
function renderCollection() {
  const el = document.getElementById("collection");
  const owned = getCollection();
  const all = baseCards;

  el.innerHTML = "<h2>Collection</h2>";

  all.forEach(c => {
    const found = owned.find(x => x.id === c.id);

    el.innerHTML += `
      <div class="card">
        <h3>${found ? c.name : "???"}</h3>
        <p>${found ? "Obtenu" : "Locked"}</p>
      </div>
    `;
  });
}

// ========================
// ADMIN
// ========================
function renderAdmin() {
  const el = document.getElementById("admin");
  const adminCards = getAdminCards();

  el.innerHTML = `
    <h2>Admin</h2>

    <input id="cardName" placeholder="Nom carte" />
    <input id="cardRarity" type="number" min="1" max="6" placeholder="Rareté" />

    <button onclick="addCard()">Ajouter carte</button>

    <h3>Cartes admin</h3>
    <div id="adminList"></div>
  `;

  const list = document.getElementById("adminList");

  adminCards.forEach(c => {
    list.innerHTML += `
      <div class="card">
        <b>${c.name}</b> (R${c.rarity})
      </div>
    `;
  });
}

function addCard() {
  const name = document.getElementById("cardName").value;
  const rarity = Number(document.getElementById("cardRarity").value);

  if (!name || !rarity) return;

  const adminCards = getAdminCards();

  const newCard = {
    id: Date.now(),
    name,
    rarity
  };

  localStorage.setItem(
    "adminCards",
    JSON.stringify([...adminCards, newCard])
  );

  renderAdmin();
}

// ========================
// TABS
// ========================
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");

  if (tab === "booster") renderBooster();
  if (tab === "collection") renderCollection();
  if (tab === "admin") renderAdmin();
}

// ========================
// INIT
// ========================
showTab("booster");