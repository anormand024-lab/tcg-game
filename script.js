
// ========================
// BASE CARDS
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
// STATE GLOBAL (IMPORTANT)
// ========================
let currentPack = [];
let index = 0;
let cooldown = 0;
let interval = null;

// ========================
// STORAGE
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
// MERGE ALL CARDS
// ========================
function getAllCards() {
  return [...baseCards, ...getAdminCards()];
}

// ========================
// RARITY RNG
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
// OPEN PACK (5 FIXE + SAFE)
// ========================
function openPack() {
  const pack = [];

  for (let i = 0; i < 5; i++) {
    const rarity = getRarity();
    const pool = getAllCards().filter(c => c.rarity === rarity);

    const card = pool[Math.floor(Math.random() * pool.length)] || baseCards[0];

    pack.push(card);
  }

  // save collection
  saveCollection([...getCollection(), ...pack]);

  return pack;
}

// ========================
// BOOSTER RENDER (IMPORTANT FIX)
// ========================
function renderBooster() {
  const el = document.getElementById("booster");

  el.innerHTML = `
    <button id="openBtn">
      ${cooldown > 0 ? "Cooldown " + cooldown + "s" : "Ouvrir Booster"}
    </button>

    <div id="cardBox"></div>
  `;

  document.getElementById("openBtn").onclick = openBooster;
}

// ========================
// OPEN BOOSTER (FIX STABLE FLOW)
// ========================
function openBooster() {
  if (cooldown > 0) return;

  currentPack = openPack();
  index = 0;

  showCard();

  const box = document.getElementById("cardBox");

  // IMPORTANT: pas de reset renderBooster ici
  box.onclick = () => {
    index++;

    if (index < currentPack.length) {
      showCard();
    } else {
      box.innerHTML = `<p>Pack terminé 🎉</p>`;
    }
  };

  startCooldown();
}

// ========================
// SHOW CARD (SAFE)
// ========================
function showCard() {
  const box = document.getElementById("cardBox");

  const c = currentPack[index];

  if (!c) return;

  box.innerHTML = `
    <div class="card">
      <h2>${c.name}</h2>
      <p>Rarity: ${c.rarity}</p>
      <p>${index + 1} / 5</p>
      <p>Tap pour suivante →</p>
    </div>
  `;
}

// ========================
// COOLDOWN (SAFE)
// ========================
function startCooldown() {
  cooldown = 20;

  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    cooldown--;

    // IMPORTANT: ne PAS reset pack
    const btn = document.getElementById("openBtn");
    if (btn) {
      btn.innerText = cooldown > 0
        ? `Cooldown ${cooldown}s`
        : "Ouvrir Booster";
    }

    if (cooldown <= 0) {
      clearInterval(interval);
    }
  }, 1000);
}

// ========================
// COLLECTION (FIX ADMIN CARDS)
// ========================
function renderCollection() {
  const el = document.getElementById("collection");

  const owned = getCollection();
  const all = getAllCards();

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
// ADMIN (FIX PERSISTENCE)
// ========================
function renderAdmin() {
  const el = document.getElementById("admin");

  const adminCards = getAdminCards();

  el.innerHTML = `
    <h2>Admin</h2>

    <input id="name" placeholder="Nom carte" />
    <input id="rarity" type="number" min="1" max="6" placeholder="Rareté" />

    <button onclick="addCard()">Ajouter</button>

    <h3>Cartes admin</h3>
    <div id="adminList"></div>
  `;

  const list = document.getElementById("adminList");

  adminCards.forEach(c => {
    list.innerHTML += `
      <div class="card">
        ${c.name} (R${c.rarity})
      </div>
    `;
  });
}

// ========================
// ADD CARD FIX
// ========================
function addCard() {
  const name = document.getElementById("name").value;
  const rarity = Number(document.getElementById("rarity").value);

  if (!name || !rarity) return;

  const adminCards = getAdminCards();

  adminCards.push({
    id: Date.now(),
    name,
    rarity
  });

  localStorage.setItem("adminCards", JSON.stringify(adminCards));

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

// INIT
showTab("booster");