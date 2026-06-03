
// --------------------
// CARDS BASE
// --------------------
const baseCards = [
  { id: 1, name: "Draco", rarity: 1 },
  { id: 2, name: "Aqua", rarity: 2 },
  { id: 3, name: "Pyro", rarity: 3 },
  { id: 4, name: "Luma", rarity: 4 },
  { id: 5, name: "Void", rarity: 5 },
  { id: 6, name: "Chrono", rarity: 6 }
];

// --------------------
// DROP RATES
// --------------------
const rates = [
  [1, 55],
  [2, 25],
  [3, 12],
  [4, 6],
  [5, 1.5],
  [6, 0.5]
];

// --------------------
// STORAGE
// --------------------
function getCollection() {
  return JSON.parse(localStorage.getItem("cards") || "[]");
}

function saveCollection(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
}

// --------------------
// GACHA
// --------------------
function getRarity() {
  let r = Math.random() * 100;
  let sum = 0;

  for (let [rarity, rate] of rates) {
    sum += rate;
    if (r <= sum) return rarity;
  }

  return 1;
}

function openPack() {
  const pack = [];

  for (let i = 0; i < 5; i++) {
    const rarity = getRarity();
    const pool = baseCards.filter(c => c.rarity === rarity);
    const card = pool[Math.floor(Math.random() * pool.length)];

    pack.push(card);
  }

  const old = getCollection();
  saveCollection([...old, ...pack]);

  return pack;
}

// --------------------
// BOOSTER TAB
// --------------------
let cooldown = 0;

function renderBooster() {
  const el = document.getElementById("booster");

  el.innerHTML = `
    <button id="openBtn">
      ${cooldown > 0 ? "Cooldown " + cooldown + "s" : "Ouvrir Booster"}
    </button>
    <div id="pack"></div>
  `;

  document.getElementById("openBtn").onclick = () => {
    if (cooldown > 0) return;

    const pack = openPack();
    let i = 0;

    const packDiv = document.getElementById("pack");

    function showCard() {
      const c = pack[i];

      packDiv.innerHTML = `
        <div class="card">
          <h3>${c.name}</h3>
          <p>Rarity ${c.rarity}</p>
          <p>Tap pour suivante</p>
        </div>
      `;

      i++;
    }

    showCard();

    packDiv.onclick = () => {
      if (i < pack.length) showCard();
    };

    cooldown = 20;

    const t = setInterval(() => {
      cooldown--;
      renderBooster();
      if (cooldown <= 0) clearInterval(t);
    }, 1000);
  };
}

// --------------------
// COLLECTION TAB
// --------------------
function renderCollection() {
  const el = document.getElementById("collection");
  const owned = getCollection();

  el.innerHTML = "<h2>Collection</h2>";

  baseCards.forEach(c => {
    const found = owned.find(x => x.id === c.id);

    el.innerHTML += `
      <div class="card ${found ? "" : "locked"}">
        <h3>${found ? c.name : "???"}</h3>
        <p>${found ? "Obtenu" : "Locked"}</p>
      </div>
    `;
  });
}

// --------------------
// ADMIN TAB
// --------------------
function renderAdmin() {
  const el = document.getElementById("admin");

  el.innerHTML = `
    <h2>Admin</h2>
    <p>(simple demo)</p>
    <input id="name" placeholder="Nom carte"/>
    <input id="rarity" type="number" min="1" max="6"/>
    <button onclick="addCard()">Ajouter</button>
  `;
}

function addCard() {
  alert("Version simple: admin non persisté (on peut upgrader après)");
}

// --------------------
// TABS
// --------------------
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");

  if (tab === "booster") renderBooster();
  if (tab === "collection") renderCollection();
  if (tab === "admin") renderAdmin();
}

// INIT
showTab("booster");