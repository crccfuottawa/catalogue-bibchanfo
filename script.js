
const PAGE_SIZE = 10;
let records = [];
let filteredRecords = [];
let currentPage = 1;

const ids = ["titleFilter", "authorFilter", "subjectFilter", "typeFilter", "startYearFilter", "endYearFilter"];
const elements = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));

function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"' && quoted && next === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell); cell = ""; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i++;
      row.push(cell); cell = "";
      if (row.some(value => value !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift().map(h => h.replace(/^\uFEFF/, '').trim());
  return rows.map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
}

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function splitOptions(value) {
  return String(value ?? "").split("|").map(v => v.trim()).filter(Boolean);
}

function yearFrom(value) {
  const match = String(value ?? "").match(/\b(\d{4})\b/);
  return match ? Number(match[1]) : null;
}

function matchesText(recordValue, query) {
  if (!query) return true;
  return splitOptions(recordValue).some(option => normalize(option).includes(normalize(query)));
}

function applyFilters() {
  const title = elements.titleFilter.value;
  const author = elements.authorFilter.value;
  const subject = elements.subjectFilter.value;
  const type = elements.typeFilter.value;
  const start = Number(elements.startYearFilter.value) || null;
  const end = Number(elements.endYearFilter.value) || null;

  filteredRecords = records.filter(record => {
    const recordStart = yearFrom(record.DateDébut || record.Date);
    const recordEnd = yearFrom(record.DateFin || record.Date) ?? recordStart;
    return matchesText(record.Titre, title)
      && matchesText(record.Auteur, author)
      && matchesText(record.Sujets, subject)
      && (!type || normalize(record.Type) === normalize(type))
      && (!start || recordEnd === null || recordEnd >= start)
      && (!end || recordStart === null || recordStart <= end);
  });

  currentPage = 1;
  render();
}

function addDetail(dl, label, value) {
  if (!value) return;
  const dt = document.createElement("dt"); dt.textContent = label;
  const dd = document.createElement("dd"); dd.textContent = splitOptions(value).join("; ");
  dl.append(dt, dd);
}

function renderRecords() {
  const container = document.getElementById("results");
  container.innerHTML = "";
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRecords = filteredRecords.slice(startIndex, startIndex + PAGE_SIZE);

  if (!pageRecords.length) {
    container.innerHTML = '<p class="empty">Aucune notice ne correspond à ces critères.</p>';
    return;
  }

  const template = document.getElementById("recordTemplate");
  pageRecords.forEach(record => {
    const card = template.content.cloneNode(true);
    card.querySelector(".record-type").textContent = record.Type || "Notice";
    card.querySelector(".record-number").textContent = record["Numéro notice"] ? `Notice ${record["Numéro notice"]}` : "";
    card.querySelector(".record-title").textContent = record.Titre || "Sans titre";
    const dl = card.querySelector(".record-details");
    addDetail(dl, "Auteur", record.Auteur);
    addDetail(dl, "Périodique", record["Titre Périodique"]);
    addDetail(dl, "Date", record.Date || [record.DateDébut, record.DateFin].filter(Boolean).join(" – "));
    addDetail(dl, "Volume / numéro", [record.Volume && `vol. ${record.Volume}`, record["Numéro"] && `no ${record["Numéro"]}`].filter(Boolean).join(", "));
    addDetail(dl, "Collation", record.Collation);
    addDetail(dl, "Éditeur", record.Editeur);
    addDetail(dl, "Lieu", record.Lieu);
    addDetail(dl, "Notes", record.Notes);
    const subjectList = card.querySelector(".subject-list");
    splitOptions(record.Sujets).forEach(subject => {
      const tag = document.createElement("span");
      tag.className = "subject-tag";
      tag.textContent = subject;
      subjectList.appendChild(tag);
    });
    container.appendChild(card);
  });
}

function renderPagination() {
  const nav = document.getElementById("pagination");
  nav.innerHTML = "";
  const pages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  if (pages <= 1) return;

  const makeButton = (label, page, disabled = false, current = false) => {
    const button = document.createElement("button");
    button.textContent = label;
    button.disabled = disabled;
    if (current) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => {
      currentPage = page;
      render();
      window.scrollTo({
        top: document.getElementById("results").offsetTop - 20,
        behavior: "smooth"
      });
    });
    return button;
  };

  nav.appendChild(makeButton("Précédent", currentPage - 1, currentPage === 1));

  const visiblePages = new Set([1, pages]);
  for (let page = Math.max(1, currentPage - 2); page <= Math.min(pages, currentPage + 2); page++) {
    visiblePages.add(page);
  }

  let previousPage = 0;
  [...visiblePages].sort((a, b) => a - b).forEach(page => {
    if (previousPage && page > previousPage + 1) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis";
      ellipsis.textContent = "…";
      nav.appendChild(ellipsis);
    }
    nav.appendChild(makeButton(String(page), page, false, page === currentPage));
    previousPage = page;
  });

  nav.appendChild(makeButton("Suivant", currentPage + 1, currentPage === pages));
}

function render() {
  document.getElementById("resultCount").textContent = `${filteredRecords.length} notice${filteredRecords.length === 1 ? "" : "s"}`;
  renderRecords();
  renderPagination();
}

async function init() {
  try {
    const response = await fetch("data.csv", { cache: "no-store" });
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    records = parseCSV(await response.text());
    filteredRecords = [...records];
    const types = [...new Set(records.flatMap(r => splitOptions(r.Type)).filter(Boolean))].sort((a,b) => a.localeCompare(b, "fr"));
    types.forEach(type => { const option = document.createElement("option"); option.value = type; option.textContent = type; elements.typeFilter.appendChild(option); });
    ids.forEach(id => elements[id].addEventListener(id === "typeFilter" ? "change" : "input", applyFilters));
    document.getElementById("resetButton").addEventListener("click", () => { ids.forEach(id => elements[id].value = ""); applyFilters(); });
    render();
  } catch (error) {
    console.error(error);
    document.getElementById("results").innerHTML = '<p class="empty">Impossible de charger les données du catalogue.</p>';
    document.getElementById("resultCount").textContent = "Erreur de chargement";
  }
}
init();
