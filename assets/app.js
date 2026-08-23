// sachncs capability radar — interactive frontend
// Loads data/repos.json and renders a Chart.js radar chart with:
//   - hover tooltips (per-repo)
//   - clickable legend (toggle / solo)
//   - language filter chips
//   - group-by-language toggle
//   - axis label click → dim weak repos
//   - search box + sort selector
//   - reset button

const LANGS = [
  { id: "Python",      color: "#7c3aed" },
  { id: "TypeScript",  color: "#f59e0b" },
  { id: "Rust",        color: "#06b6d4" },
  { id: "JavaScript",  color: "#10b981" },
  { id: "Go",          color: "#3b82f6" },
  { id: "Objective-C", color: "#ec4899" },
  { id: "Other",       color: "#8b949e" },
];

const state = {
  data: null,
  axes: [],
  repos: [],
  filteredLanguages: new Set(LANGS.map(l => l.id)),
  groupByLang: false,
  solo: null,            // repo name currently soloed
  highlightedAxis: null, // axis id currently highlighted
  sortBy: "score",
  search: "",
};

// ---------- bootstrap ----------
async function bootstrap() {
  await loadData();
  buildChips();
  buildLegend();
  buildChart();
  bindControls();
  renderMeta();
  bindCanvasGlow();
  // re-render on resize
  window.addEventListener("resize", debounce(() => state.chart && state.chart.resize(), 80));
}

function bindCanvasGlow() {
  const inner = document.querySelector(".canvas-inner");
  if (!inner) return;
  inner.addEventListener("mouseenter", () => inner.classList.add("is-hot"));
  inner.addEventListener("mouseleave", () => inner.classList.remove("is-hot"));
}

async function loadData() {
  const res = await fetch("data/repos.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`repos.json ${res.status}`);
  state.data = await res.json();
  state.axes = state.data.axes;
  state.repos = state.data.repos;
}

function renderMeta() {
  const total = state.repos.length;
  const byLang = {};
  for (const r of state.repos) byLang[r.language || "Other"] = (byLang[r.language || "Other"] || 0) + 1;
  const langStr = Object.entries(byLang).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${v} ${k}`).join(" · ");
  document.getElementById("meta").textContent = `${total} repos · ${langStr}`;
  document.getElementById("generatedAt").textContent =
    `data refreshed ${formatDate(state.data.generatedAt)}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

// ---------- color helpers ----------
function langColor(lang) {
  const l = LANGS.find(x => x.id === lang);
  return l ? l.color : "#8b949e";
}
function langColorAlpha(lang, a) {
  const c = langColor(lang);
  return hexToRgba(c, a);
}
function hexToRgba(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ---------- chips ----------
function buildChips() {
  const counts = {};
  for (const r of state.repos) counts[r.language || "Other"] = (counts[r.language || "Other"] || 0) + 1;
  const host = document.getElementById("langChips");
  host.innerHTML = "";
  for (const l of LANGS) {
    if (!counts[l.id]) continue;
    const el = document.createElement("button");
    el.type = "button";
    el.className = "chip";
    el.dataset.lang = l.id;
    el.innerHTML = `<span class="dot" style="background:${l.color}"></span> ${l.id} <span style="color:var(--fg-2)">${counts[l.id]}</span>`;
    el.addEventListener("click", () => {
      const isActive = state.filteredLanguages.has(l.id);
      if (isActive) state.filteredLanguages.delete(l.id);
      else state.filteredLanguages.add(l.id);
      el.classList.toggle("active", !isActive);
      el.classList.toggle("muted", isActive);
      rebuildDatasets();
    });
    el.classList.add("active");
    host.appendChild(el);
  }
}

// ---------- legend ----------
function getVisibleRepos() {
  let list = state.repos.filter(r => state.filteredLanguages.has(r.language || "Other"));
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.description || "").toLowerCase().includes(q)
    );
  }
  switch (state.sortBy) {
    case "name":    list = list.slice().sort((a,b) => a.name.localeCompare(b.name)); break;
    case "recent":  list = list.slice().sort((a,b) => (b.pushedAt || "").localeCompare(a.pushedAt || "")); break;
    case "stars":   list = list.slice().sort((a,b) => (b.stars || 0) - (a.stars || 0)); break;
    case "score":
    default:        list = list.slice().sort((a,b) => sumScores(b) - sumScores(a));
  }
  return list;
}

function sumScores(r) {
  return Object.values(r.scores || {}).reduce((a,b)=>a+b, 0);
}

function buildLegend() {
  const host = document.getElementById("legend");
  host.innerHTML = "";
  const items = getVisibleRepos();
  document.getElementById("legendCount").textContent = items.length;
  for (const r of items) {
    const total = sumScores(r);
    const el = document.createElement("div");
    el.className = "legend-item";
    el.dataset.name = r.name;
    el.innerHTML = `
      <span class="swatch" style="background:${langColor(r.language)}"></span>
      <span class="name" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</span>
      <span class="meta">${total.toFixed(1)}</span>`;
    el.addEventListener("click", () => toggleSolo(r.name, el));
    host.appendChild(el);
  }
}

function refreshLegendClasses() {
  document.querySelectorAll(".legend-item").forEach(el => {
    el.classList.toggle("solo", state.solo && el.dataset.name === state.solo);
    el.classList.toggle("hidden", !isRepoVisible(el.dataset.name) && !state.solo);
  });
}

function isRepoVisible(name) {
  const r = state.repos.find(x => x.name === name);
  if (!r) return false;
  if (!state.filteredLanguages.has(r.language || "Other")) return false;
  if (state.search) {
    const q = state.search.toLowerCase();
    if (!r.name.toLowerCase().includes(q) &&
        !(r.description || "").toLowerCase().includes(q)) return false;
  }
  return true;
}

// ---------- chart ----------
let chart = null;

function buildChart() {
  const ctx = document.getElementById("radar").getContext("2d");
  const datasets = buildDatasets();
  const totalDuration = 900;
  // stagger datasets so each repo polygon "draws itself in" sequentially
  datasets.forEach((ds, i) => {
    ds.animation = {
      duration: totalDuration,
      delay: i * 60,
      easing: "easeOutQuart",
    };
  });

  chart = new Chart(ctx, {
    type: "radar",
    data: { labels: state.axes.map(a => a.label), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      plugins: {
        legend: { display: false }, // we render our own
        tooltip: {
          backgroundColor: "#161b22",
          borderColor: "#30363d",
          borderWidth: 1,
          padding: 10,
          titleColor: "#e6edf3",
          bodyColor: "#c9d1d9",
          titleFont: { weight: "bold", size: 13 },
          callbacks: {
            title: (items) => {
              const ds = chart.data.datasets[items[0].datasetIndex];
              const repo = ds.__repo;
              if (!repo) return ds.label;
              return repo.name;
            },
            label: (item) => {
              const ds = chart.data.datasets[item.datasetIndex];
              const repo = ds.__repo;
              if (!repo) return `${item.label}: ${item.formattedValue}`;
              const axisLabel = chart.data.labels[item.dataIndex];
              return `${axisLabel}: ${item.formattedValue}/10`;
            },
            afterBody: (items) => {
              const ds = chart.data.datasets[items[0].datasetIndex];
              const repo = ds.__repo;
              if (!repo) return "";
              const lines = [];
              if (repo.description) lines.push("", repo.description);
              lines.push("", "↗ open on GitHub");
              return lines;
            },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            color: "#6e7681",
            backdropColor: "transparent",
            font: { size: 10 },
          },
          grid: { color: "#21262d" },
          angleLines: { color: "#30363d" },
          pointLabels: {
            color: "#c9d1d9",
            font: { size: 12, weight: "500" },
          },
        },
      },
      onClick: (evt, elements) => {
        if (!elements.length) return;
        const ds = chart.data.datasets[elements[0].datasetIndex];
        if (ds.__repo) window.open(ds.__repo.url, "_blank", "noopener");
      },
    },
  });
  state.chart = chart;
}

function buildDatasets() {
  if (state.groupByLang) return buildLangDatasets();
  return buildRepoDatasets();
}

function buildRepoDatasets() {
  return getVisibleRepos().map(r => {
    const c = langColor(r.language);
    return {
      label: r.name,
      data: state.axes.map(a => r.scores[a.id] || 0),
      borderColor: c,
      backgroundColor: hexToRgba(c, 0.06),
      borderWidth: 1,
      pointRadius: 2,
      pointHoverRadius: 4,
      pointBackgroundColor: c,
      __repo: r,
    };
  });
}

function buildLangDatasets() {
  const visible = getVisibleRepos();
  const grouped = {};
  for (const r of visible) {
    const k = r.language || "Other";
    (grouped[k] = grouped[k] || []).push(r);
  }
  const datasets = [];
  for (const lang of LANGS) {
    const group = grouped[lang.id];
    if (!group || !group.length) continue;
    const avg = state.axes.map(a => {
      const sum = group.reduce((s, r) => s + (r.scores[a.id] || 0), 0);
      return Math.round((sum / group.length) * 100) / 100;
    });
    datasets.push({
      label: `${lang.id} (n=${group.length})`,
      data: avg,
      borderColor: lang.color,
      backgroundColor: hexToRgba(lang.color, 0.18),
      borderWidth: 2.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: lang.color,
      __repo: null,
    });
  }
  return datasets;
}

function rebuildDatasets() {
  if (!state.chart) return;
  state.chart.data.datasets = buildDatasets();
  state.chart.update();
  buildLegend();
  refreshLegendClasses();
  applyAxisHighlight();
}

function toggleSolo(name, el) {
  if (state.solo === name) state.solo = null;
  else state.solo = name;
  document.querySelectorAll(".legend-item").forEach(e => {
    e.classList.toggle("solo", e.dataset.name === state.solo);
  });
  state.chart.data.datasets.forEach((ds, i) => {
    if (!ds.__repo) return;
    if (!state.solo) {
      ds.backgroundColor = hexToRgba(langColor(ds.__repo.language), 0.06);
      ds.borderWidth = 1;
    } else {
      const isThis = ds.__repo.name === state.solo;
      ds.backgroundColor = isThis
        ? hexToRgba(langColor(ds.__repo.language), 0.35)
        : "rgba(88, 166, 255, 0.02)";
      ds.borderWidth = isThis ? 2.6 : 0.6;
    }
  });
  state.chart.update();
}

// axis highlight: clicking an axis label fades repos weak on that axis
function applyAxisHighlight() {
  const axis = state.highlightedAxis;
  state.chart.data.datasets.forEach(ds => {
    if (!ds.__repo) return;
    if (!axis) {
      ds.backgroundColor = state.solo
        ? (ds.__repo.name === state.solo
            ? hexToRgba(langColor(ds.__repo.language), 0.35)
            : "rgba(88,166,255,0.02)")
        : hexToRgba(langColor(ds.__repo.language), 0.06);
      ds.borderWidth = state.solo && ds.__repo.name === state.solo ? 2.6 : 1;
      return;
    }
    const score = ds.__repo.scores[axis] || 0;
    if (score < 3) {
      ds.backgroundColor = "rgba(88,166,255,0.02)";
      ds.borderWidth = 0.4;
    } else {
      ds.backgroundColor = hexToRgba(langColor(ds.__repo.language), 0.18);
      ds.borderWidth = 1.6;
    }
  });
  state.chart.update();
}

// ---------- controls ----------
function bindControls() {
  document.getElementById("groupByLang").addEventListener("change", (e) => {
    state.groupByLang = e.target.checked;
    rebuildDatasets();
  });
  document.getElementById("resetBtn").addEventListener("click", resetAll);
  document.getElementById("sortBy").addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    buildLegend();
    refreshLegendClasses();
  });
  document.getElementById("search").addEventListener("input", debounce((e) => {
    state.search = e.target.value.trim();
    buildLegend();
    refreshLegendClasses();
    rebuildDatasets();
  }, 120));

  // Click an axis label → highlight that axis
  // Chart.js v4 doesn't expose click on pointLabels directly; we listen on canvas
  // and convert coordinates to angle → axis index.
  document.getElementById("radar").addEventListener("click", (evt) => {
    if (!state.chart) return;
    const rect = state.chart.canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left - rect.width / 2;
    const y = evt.clientY - rect.top - rect.height / 2;
    const r = Math.sqrt(x*x + y*y);
    // outside the chart area?
    const radiusMax = Math.min(rect.width, rect.height) * 0.42;
    if (r > radiusMax) {
      state.highlightedAxis = null;
      applyAxisHighlight();
      return;
    }
    let angle = Math.atan2(y, x) * 180 / Math.PI + 90; // adjust because Chart.js starts at top
    if (angle < 0) angle += 360;
    const idx = Math.round(angle / (360 / state.axes.length)) % state.axes.length;
    const axisId = state.axes[idx].id;
    state.highlightedAxis = (state.highlightedAxis === axisId) ? null : axisId;
    applyAxisHighlight();
  });
}

function resetAll() {
  state.groupByLang = false;
  state.solo = null;
  state.highlightedAxis = null;
  state.sortBy = "score";
  state.search = "";
  state.filteredLanguages = new Set(LANGS.map(l => l.id));
  document.getElementById("groupByLang").checked = false;
  document.getElementById("sortBy").value = "score";
  document.getElementById("search").value = "";
  document.querySelectorAll("#langChips .chip").forEach(c => {
    c.classList.add("active");
    c.classList.remove("muted");
  });
  rebuildDatasets();
}

// ---------- helpers ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
}
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

bootstrap().catch(err => {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<pre style="color:#f85149;padding:20px;background:#161b22">Failed to load: ${escapeHtml(err.message)}\n\nTry refreshing — if the problem persists, the data file may be missing.</pre>`
  );
  console.error(err);
});