// ShadowTrade Tools — Lot Size Calculator, Risk Calculator, Trading Journal

// ---------- Lot size calculator ----------
document.getElementById("calcLotBtn")?.addEventListener("click", () => {
  const balance = parseFloat(document.getElementById("lotBalance").value);
  const riskPct = parseFloat(document.getElementById("lotRisk").value);
  const sl = parseFloat(document.getElementById("lotSL").value);
  const pipValue = parseFloat(document.getElementById("lotPipValue").value);

  const valueEl = document.getElementById("lotResultValue");
  const subEl = document.getElementById("lotResultSub");

  if (!balance || !riskPct || !sl || !pipValue) {
    valueEl.textContent = "—";
    subEl.textContent = "من فضلك أدخل كل القيم بشكل صحيح";
    return;
  }

  const riskAmount = balance * (riskPct / 100);
  const lotSize = riskAmount / (sl * pipValue);

  valueEl.textContent = lotSize.toFixed(2) + " لوت";
  subEl.textContent = `مخاطرة ${riskAmount.toFixed(2)}$ عند وقف خسارة ${sl} نقطة`;
});

// ---------- Risk calculator ----------
document.getElementById("calcRiskBtn")?.addEventListener("click", () => {
  const balance = parseFloat(document.getElementById("riskBalance").value);
  const lot = parseFloat(document.getElementById("riskLot").value);
  const sl = parseFloat(document.getElementById("riskSL").value);
  const pipValue = parseFloat(document.getElementById("riskPipValue").value);

  const valueEl = document.getElementById("riskResultValue");
  const subEl = document.getElementById("riskResultSub");

  if (!balance || !lot || !sl || !pipValue) {
    valueEl.textContent = "—";
    subEl.textContent = "من فضلك أدخل كل القيم بشكل صحيح";
    return;
  }

  const riskAmount = lot * sl * pipValue;
  const riskPct = (riskAmount / balance) * 100;

  valueEl.textContent = riskAmount.toFixed(2) + " $";
  subEl.textContent = `يمثل ${riskPct.toFixed(2)}% من رأس مالك`;
});

// ---------- Trading journal ----------
const JOURNAL_KEY = "shadowtrade_journal";

function getJournal() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || [];
  } catch {
    return [];
  }
}

function saveJournal(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

function renderJournal() {
  const entries = getJournal();
  const body = document.getElementById("journalBody");
  const empty = document.getElementById("journalEmpty");
  if (!body) return;

  body.innerHTML = "";

  if (entries.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  entries
    .slice()
    .reverse()
    .forEach((entry, indexFromEnd) => {
      const realIndex = entries.length - 1 - indexFromEnd;
      const row = document.createElement("tr");
      const resultClass = entry.result >= 0 ? "positive" : "negative";
      row.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.pair}</td>
        <td>${entry.direction === "buy" ? "شراء" : "بيع"}</td>
        <td class="${resultClass}">${entry.result >= 0 ? "+" : ""}${entry.result}$</td>
        <td>${entry.notes || "—"}</td>
        <td><button class="journal-delete" data-index="${realIndex}">حذف</button></td>
      `;
      body.appendChild(row);
    });

  body.querySelectorAll(".journal-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index);
      const updated = getJournal();
      updated.splice(idx, 1);
      saveJournal(updated);
      renderJournal();
    });
  });
}

document.getElementById("journalForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = {
    date: document.getElementById("jDate").value,
    pair: document.getElementById("jPair").value,
    direction: document.getElementById("jDirection").value,
    result: parseFloat(document.getElementById("jResult").value),
    notes: document.getElementById("jNotes").value,
  };
  const entries = getJournal();
  entries.push(entry);
  saveJournal(entries);
  e.target.reset();
  renderJournal();
});

document.addEventListener("DOMContentLoaded", renderJournal);
