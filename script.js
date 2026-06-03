// =========================
// STATE GLOBAL
// =========================
let state = {
  page: "booster",
  pack: [],
  index: 0,
  cooldown: 0,
  opening: false
};

// =========================
// BASE CARDS
// =========================
const cards = [
  { id: 1, name: "Draco", rarity: 1 },
  { id: 2, name: "Aqua", rarity: 2 },
  { id: 3, name: "Pyro", rarity: 3 },
  { id: 4, name: "Luma", rarity: 4 },
  { id: 5, name: "Void", rarity: 5 },
  { id: 6, name: "Chrono", rarity: 6 }
];

// =========================
// DROP SYSTEM
// =========================
const rates = [
  [1, 55],
  [2, 25],
  [3, 12],
  [4, 6],
  [5, 1.5],
  [6, 0.5]
];

// =========================
// STORAGE SAFE
// =========================
const storage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// =========================
// UTIL: RARETY
// =========================
function getRarity() {
  let r = Math.random() * 100;
  let sum = 0;

  for (let [rarity, rate] of rates) {
    sum += rate;
    if (r <= sum) return rarity;
  }

  return 1;
}

// =========================
// GET ALL CARDS (ADMIN + BASE)
// =========================
function getAllCards() {
  return [...cards, ...storage.get("adminCards")];
}

// =========================
// OPEN PACK (5 FIXED)
// =========================
function openPack() {
  let pack = [];

  for (let i = 0; i < 5; i++) {
    const rarity = getRarity();
    const pool = getAllCards().filter(c => c.rarity === rarity);
    const card = pool[Math.floor(Math.random() * pool.length)];

    pack.push(card);
  }

  const owned = storage.get("collection");
  storage.set("collection", [...owned, ...pack]);

  return pack;
}

// =========================
// NAVIGATION
// =========================
function go(page) {
  state.page = page;

  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");

  render();
}

// =========================
// BOOSTER SYSTEM PRO
// =========================
function renderBooster() {
  const el = document.getElementById("booster");

  el.innerHTML = `
    <button id="openBtn">
      ${state.cooldown > 0 ? "Cooldown " + state.cooldown + "s" : "Open Pack"}
    </button>

    <div id="cardZone"></div>
  `;

  document.getElementById("openBtn").onclick = startOpen;
}

// =========================
// OPEN PACK FLOW (PRO)
// =========================
function startOpen() {
  if (state.cooldown > 0 || state.opening) return;

  state.opening = true;
  state.pack = openPack();
  state.index = 0;

  showCard();

  const zone = document.getElementById("cardZone");

  zone.onclick = () => {
    if (!state.opening) return;

    state.index++;

    if (state.index < state.pack.length) {
      showCard();
    } else {
      state.opening = false;
      zone.innerHTML = "<h3>Pack terminé 🎉</h3>";
    }
  };

  startCooldown();
}

// =========================
// SHOW CARD PRO
// =========================
function showCard() {
  const zone = document.getElementById("cardZone");
  const c = state.pack[state.index];

  zone.classList.add("flash");
  setTimeout(() => zone.classList.remove("flash"), 200);

  zone.innerHTML = `
    <div class="card r${c.rarity}">
      <h2>${c.name}</h2>
      <p>Rarity ${c.rarity}</p>
      <small>${state.index + 1}/5</small>
    </div>
  `;
}

// =========================
// COOLDOWN PRO
// =========================
function startCooldown() {
  state.cooldown = 20;

  const t = setInterval(() => {
    state.cooldown--;

    if (state.page === "booster") renderBooster();

    if (state.cooldown <= 0) clearInterval(t);
  }, 1000);
}

// =========================
// COLLECTION PRO
// =========================
function renderCollection() {
  const el = document.getElementById("collection");

  const owned = storage.get("collection");
  const all = getAllCards();

  el.innerHTML = "<h2>Collection</h2>";

  all.forEach(c => {
    const found = owned.find(x => x.id === c.id);

    el.innerHTML += `
      <div class="card r${c.rarity}">
        <h3>${found ? c.name : "???"}</h3>
        <p>${found ? "Owned" : "Locked"}</p>
      </div>
    `;
  });
}

// =========================
// ADMIN PRO
// =========================
function renderAdmin() {
  const el = document.getElementById("admin");

  const adminCards = storage.get("adminCards");

  el.innerHTML = `
    <h2>Admin Panel</h2>

    <input id="n" placeholder="Name"/>
    <input id="r" type="number" min="1" max="6" placeholder="Rarity"/>

    <button onclick="addCard()">Add Card</button>

    <h3>Custom Cards</h3>
    <div id="list"></div>
  `;

  const list = document.getElementById("list");

  adminCards.forEach(c => {
    list.innerHTML += `
      <div class="card r${c.rarity}">
        ${c.name} (R${c.rarity})
      </div>
    `;
  });
}

// =========================
// ADD CARD PRO
// =========================
function addCard() {
  const name = document.getElementById("n").value;
  const rarity = Number(document.getElementById("r").value);

  const list = storage.get("adminCards");

  list.push({
    id: Date.now(),
    name,
    rarity
  });

  storage.set("adminCards", list);

  renderAdmin();
}

// =========================
// MAIN RENDER
// =========================
function render() {
  if (state.page === "booster") renderBooster();
  if (state.page === "collection") renderCollection();
  if (state.page === "admin") renderAdmin();
}

// INIT
go("booster");