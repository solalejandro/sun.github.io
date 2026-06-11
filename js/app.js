/* ============================================================
   app.js — Router SPA (hash-based) y renderizado de vistas.
   ============================================================ */
import { t, loc, getLang, setLang, applyStaticTranslations } from "./i18n.js";
import { esc, toast, fmtDate, downloadText, copyText, normalize, slug } from "./utils.js";
import { CATEGORIES, CASES, caseById, casesByCategory, categoryById } from "./data/cases.js";
import { KB, FALLBACK, SUGGESTIONS, RIGHTS } from "./data/knowledge.js";
import * as store from "./store.js";

const view = document.getElementById("view");

/* ---------- Estado del asistente (wizard) ---------- */
const wizard = { caseId: null, step: 0, values: {} };

/* ============================================================
   ROUTER
   ============================================================ */
const routes = {
  "": renderHome,
  "/": renderHome,
  "/casos": renderCases,
  "/asistente": renderAssistant,
  "/panel": renderDashboard,
  "/derechos": renderRights,
  "/aviso-legal": renderLegal,
};

function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query || "");
  return { path, params };
}

function router() {
  const { path, params } = parseHash();

  // Rutas dinámicas: /caso/:id  y  /documento/:id
  if (path.startsWith("/caso/")) {
    renderWizard(path.split("/")[2]);
  } else if (path.startsWith("/documento/")) {
    renderDocument(path.split("/")[2]);
  } else {
    const handler = routes[path] || renderNotFound;
    handler(params);
  }

  // Marca enlace activo
  document.querySelectorAll(".primary-nav a").forEach((a) => {
    const href = a.getAttribute("href").replace(/^#/, "");
    a.classList.toggle("active", href === path || (href === "/" && path === "/"));
  });

  // Cierra menú móvil y sube arriba
  document.getElementById("primaryNav").classList.remove("open");
  document.getElementById("navToggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  document.getElementById("main").focus({ preventScroll: true });
}

function go(path) { location.hash = path; }

/* ============================================================
   INIT
   ============================================================ */
function init() {
  document.documentElement.lang = getLang();
  applyStaticTranslations();

  // Menú móvil
  const toggle = document.getElementById("navToggle");
  toggle.addEventListener("click", () => {
    const nav = document.getElementById("primaryNav");
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Cambio de idioma
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });
  document.addEventListener("langchange", () => router());

  window.addEventListener("hashchange", router);
  router();
}

document.addEventListener("DOMContentLoaded", init);

/* ============================================================
   HELPERS DE RENDER
   ============================================================ */
function pageHead(title, lead) {
  return `<section class="page-head"><div class="container">
    <h1>${esc(title)}</h1><p>${esc(lead)}</p>
  </div></section>`;
}

function crumbs(items) {
  return `<div class="crumbs">${items
    .map((i, idx) => (i.href ? `<a href="${i.href}">${esc(i.label)}</a>` : `<span>${esc(i.label)}</span>`) + (idx < items.length - 1 ? " / " : ""))
    .join("")}</div>`;
}


/* ============================================================
   VISTA: HOME
   ============================================================ */
function renderHome() {
  const popular = ["multa-trafico", "reembolso-producto", "deposito-alquiler", "compensacion-vuelo"]
    .map(caseById).filter(Boolean);

  view.innerHTML = `
  <section class="hero">
    <div class="container">
      <div>
        <span class="eyebrow">${esc(t("hero.eyebrow"))}</span>
        <h1>${esc(t("hero.title"))}</h1>
        <p class="lead">${esc(t("hero.lead"))}</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#/casos">${esc(t("hero.cta1"))}</a>
          <a class="btn btn-light" href="#/asistente">${esc(t("hero.cta2"))}</a>
        </div>
        <div class="hero-stats">
          <div><div class="num">${CASES.length}</div><div class="lbl">${esc(t("hero.stat1"))}</div></div>
          <div><div class="num">${CASES.length}+</div><div class="lbl">${esc(t("hero.stat2"))}</div></div>
          <div><div class="num">100%</div><div class="lbl">${esc(t("hero.stat3"))}</div></div>
        </div>
      </div>
      <div class="hero-card">
        <form id="heroSearch" class="hero-search" role="search">
          <input type="search" name="q" placeholder="${esc(t("hero.searchPlaceholder"))}" aria-label="${esc(t("hero.searchPlaceholder"))}" />
          <button class="btn btn-primary" type="submit">${esc(t("hero.searchBtn"))}</button>
        </form>
        <div style="margin-top:14px;color:var(--slate-400);font-size:.85rem">${esc(t("hero.popular"))}</div>
        <div class="hero-chips">
          ${popular.map((c) => `<button class="chip" data-go="#/caso/${c.id}">${c.icon} ${esc(loc(c.title))}</button>`).join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2>${esc(t("home.catsTitle"))}</h2>
        <p>${esc(t("home.catsLead"))}</p>
      </div>
      <div class="cat-grid">
        ${CATEGORIES.map((cat) => {
          const n = casesByCategory(cat.id).length;
          return `<a class="cat-card" href="#/casos?cat=${cat.id}">
            <div class="cat-icon">${cat.icon}</div>
            <h3>${esc(loc(cat.name))}</h3>
            <p>${n} ${n === 1 ? "caso" : "casos"}</p>
            <span class="tag">${esc(t("cases.start"))} →</span>
          </a>`;
        }).join("")}
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="section-head">
        <h2>${esc(t("home.howTitle"))}</h2>
        <p>${esc(t("home.howLead"))}</p>
      </div>
      <div class="steps">
        <div class="step"><div class="n">1</div><h3>${esc(t("home.step1Title"))}</h3><p class="muted">${esc(t("home.step1Desc"))}</p></div>
        <div class="step"><div class="n">2</div><h3>${esc(t("home.step2Title"))}</h3><p class="muted">${esc(t("home.step2Desc"))}</p></div>
        <div class="step"><div class="n">3</div><h3>${esc(t("home.step3Title"))}</h3><p class="muted">${esc(t("home.step3Desc"))}</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="card pad-lg" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:space-between">
        <div style="flex:1;min-width:260px">
          <h2 style="margin-bottom:8px">🔒 ${esc(t("home.privacyTitle"))}</h2>
          <p class="muted mb-0">${esc(t("home.privacyDesc"))}</p>
        </div>
        <a class="btn btn-primary" href="#/casos">${esc(t("home.startNow"))}</a>
      </div>
    </div>
  </section>`;

  // Eventos
  view.querySelector("#heroSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = new FormData(e.target).get("q") || "";
    go(`/casos?q=${encodeURIComponent(q)}`);
  });
  view.querySelectorAll("[data-go]").forEach((el) =>
    el.addEventListener("click", () => go(el.dataset.go.replace(/^#/, ""))));
}

/* ============================================================
   VISTA: LISTADO DE CASOS
   ============================================================ */
function renderCases(params) {
  const initialCat = params?.get("cat") || "all";
  const initialQ = params?.get("q") || "";

  view.innerHTML = `
    ${pageHead(t("cases.title"), t("cases.lead"))}
    <section class="section"><div class="container">
      <div class="toolbar">
        <input type="search" id="caseSearch" placeholder="${esc(t("cases.searchPlaceholder"))}" value="${esc(initialQ)}" />
      </div>
      <div class="filter-pills" id="catPills">
        <button class="pill" data-cat="all">${esc(t("cases.all"))}</button>
        ${CATEGORIES.map((c) => `<button class="pill" data-cat="${c.id}">${c.icon} ${esc(loc(c.name))}</button>`).join("")}
      </div>
      <div class="case-grid mt-3" id="caseGrid"></div>
    </div></section>`;

  let activeCat = initialCat;
  const searchEl = view.querySelector("#caseSearch");
  const gridEl = view.querySelector("#caseGrid");
  const pills = view.querySelectorAll("#catPills .pill");

  function paint() {
    const q = normalize(searchEl.value);
    pills.forEach((p) => p.classList.toggle("active", p.dataset.cat === activeCat));

    const list = CASES.filter((c) => {
      const inCat = activeCat === "all" || c.category === activeCat;
      const hay = normalize(`${loc(c.title)} ${loc(c.desc)} ${loc(categoryById(c.category)?.name)}`);
      const match = !q || hay.includes(q);
      return inCat && match;
    });

    if (!list.length) {
      gridEl.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="big">🔍</div><p>${esc(t("cases.none"))}</p></div>`;
      return;
    }

    gridEl.innerHTML = list.map((c) => {
      const cat = categoryById(c.category);
      return `<div class="case-card">
        <div class="top">
          <div class="ci">${c.icon}</div>
          <div><h3>${esc(loc(c.title))}</h3>
          <span class="badge cat">${cat.icon} ${esc(loc(cat.name))}</span></div>
        </div>
        <p class="desc">${esc(loc(c.desc))}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <span class="muted" style="font-size:.82rem">${Math.ceil(c.fields.length / 3)} ${esc(t("cases.steps"))}</span>
          <a class="btn btn-primary btn-sm" href="#/caso/${c.id}">${esc(t("cases.start"))} →</a>
        </div>
      </div>`;
    }).join("");
  }

  pills.forEach((p) => p.addEventListener("click", () => { activeCat = p.dataset.cat; paint(); }));
  searchEl.addEventListener("input", paint);
  paint();
}


/* ============================================================
   VISTA: WIZARD (formulario guiado por pasos)
   ============================================================ */
const FIELDS_PER_STEP = 3;

function stepsFor(caseDef) {
  const chunks = [];
  for (let i = 0; i < caseDef.fields.length; i += FIELDS_PER_STEP) {
    chunks.push(caseDef.fields.slice(i, i + FIELDS_PER_STEP));
  }
  return chunks;
}

function fieldInput(f, value) {
  const v = esc(value ?? "");
  const ph = esc(loc(f.label));
  if (f.type === "textarea") {
    return `<textarea id="f_${f.name}" name="${f.name}" placeholder="${ph}">${v}</textarea>`;
  }
  if (f.type === "select") {
    const opts = (f.options || []).map((o) =>
      `<option value="${esc(o.value)}" ${value === o.value ? "selected" : ""}>${esc(loc(o.label))}</option>`).join("");
    return `<select id="f_${f.name}" name="${f.name}"><option value="">—</option>${opts}</select>`;
  }
  const typeMap = { money: "text", number: "number", date: "date", email: "email", tel: "tel", text: "text" };
  const inputType = typeMap[f.type] || "text";
  return `<input id="f_${f.name}" name="${f.name}" type="${inputType}" value="${v}" placeholder="${ph}" ${f.type === "number" ? 'min="0"' : ""} />`;
}

function renderWizard(caseId) {
  const def = caseById(caseId);
  if (!def) return renderNotFound();

  // Reinicia el estado si cambiamos de caso
  if (wizard.caseId !== caseId) {
    wizard.caseId = caseId;
    wizard.step = 0;
    wizard.values = {};
  }

  const steps = stepsFor(def);
  const total = steps.length;
  const cat = categoryById(def.category);
  const stepFields = steps[wizard.step];
  const pct = Math.round(((wizard.step) / total) * 100);
  const isLast = wizard.step === total - 1;

  view.innerHTML = `
  <section class="section"><div class="container">
    ${crumbs([{ label: t("nav.cases"), href: "#/casos" }, { label: loc(cat.name), href: `#/casos?cat=${cat.id}` }, { label: loc(def.title) }])}
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
      <div class="cat-icon">${def.icon}</div>
      <div><h1 style="margin:0;font-size:1.6rem">${esc(loc(def.title))}</h1>
      <p class="muted mb-0">${esc(loc(def.desc))}</p></div>
    </div>

    <div class="wizard-wrap">
      <div class="card">
        <div class="progress"><i style="width:${pct}%"></i></div>
        <div class="step-label">${esc(t("wiz.step"))} ${wizard.step + 1} ${esc(t("wiz.of"))} ${total}</div>
        <h3 style="margin-top:6px">${esc(loc(cat.name))}</h3>

        ${def.juris ? `<div class="juris-note">⚖️ <strong>${esc(t("wiz.jurisHint"))}:</strong> ${esc(loc(def.juris))}</div>` : ""}

        <form id="wizForm" novalidate>
          ${stepFields.map((f) => `
            <div class="field ${f.req ? "req" : ""}" data-field="${f.name}">
              <label for="f_${f.name}">${esc(loc(f.label))}</label>
              ${fieldInput(f, wizard.values[f.name])}
              <div class="err">${esc(t("wiz.required"))}</div>
            </div>`).join("")}

          <div class="wizard-actions">
            <button type="button" class="btn btn-ghost" id="btnBack">${wizard.step === 0 ? esc(t("wiz.startOver")) : "← " + esc(t("wiz.back"))}</button>
            <button type="submit" class="btn btn-primary" id="btnNext">${isLast ? esc(t("wiz.generate")) + " →" : esc(t("wiz.next")) + " →"}</button>
          </div>
        </form>
      </div>

      <aside>
        <div class="sidebar-note">
          <h4>💡 ${esc(t("wiz.tipsTitle"))}</h4>
          <ul>${(loc(def.tips) || []).map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul>
        </div>
      </aside>
    </div>
  </div></section>`;

  const form = view.querySelector("#wizForm");

  function collect() {
    new FormData(form).forEach((val, key) => { wizard.values[key] = String(val).trim(); });
  }

  function validate() {
    let ok = true;
    stepFields.forEach((f) => {
      if (!f.req) return;
      const wrap = view.querySelector(`[data-field="${f.name}"]`);
      const el = view.querySelector(`#f_${f.name}`);
      const empty = !String(el.value || "").trim();
      wrap.classList.toggle("invalid", empty);
      if (empty && ok) { el.focus(); ok = false; }
      else if (empty) ok = false;
    });
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    collect();
    if (!validate()) { toast(t("wiz.required"), "err"); return; }
    if (isLast) {
      generateDocument(def);
    } else {
      wizard.step++;
      renderWizard(caseId);
    }
  });

  view.querySelector("#btnBack").addEventListener("click", () => {
    collect();
    if (wizard.step === 0) {
      wizard.values = {};
      go("/casos");
    } else {
      wizard.step--;
      renderWizard(caseId);
    }
  });
}

/* ============================================================
   GENERACIÓN DE DOCUMENTO
   ============================================================ */
let currentDoc = null;

function generateDocument(def) {
  const lang = getLang();
  const text = def.build(wizard.values, lang);
  currentDoc = {
    caseId: def.id,
    title: loc(def.title),
    icon: def.icon,
    document: text,
    values: { ...wizard.values },
    nextSteps: loc(def.nextSteps) || [],
    storeId: null,
  };
  go("/documento/preview");
}

/* ============================================================
   VISTA: DOCUMENTO
   ============================================================ */
function renderDocument(id) {
  let doc;
  if (id === "preview" && currentDoc) {
    doc = currentDoc;
  } else {
    const saved = store.getCase(id);
    if (!saved) return renderNotFound();
    const def = caseById(saved.caseType);
    doc = {
      caseId: saved.caseType,
      title: saved.title,
      icon: saved.icon,
      document: saved.document,
      values: saved.values,
      nextSteps: def ? loc(def.nextSteps) || [] : [],
      storeId: saved.id,
    };
    currentDoc = doc;
  }

  view.innerHTML = `
  <section class="section"><div class="container">
    ${crumbs([{ label: t("nav.cases"), href: "#/casos" }, { label: doc.title }])}
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:6px">
      <div class="cat-icon">${doc.icon}</div>
      <div><h1 style="margin:0;font-size:1.6rem">✅ ${esc(t("doc.title"))}</h1></div>
    </div>
    <p class="muted">${esc(t("doc.lead"))}</p>

    <div class="doc-wrap mt-2">
      <div>
        <div class="doc-paper" id="docPaper" contenteditable="false">${esc(doc.document)}</div>
      </div>
      <div class="doc-actions">
        <div class="card">
          <button class="btn btn-primary btn-block" id="btnCopy">📋 ${esc(t("doc.copy"))}</button>
          <button class="btn btn-ghost btn-block mt-2" id="btnDownload">⬇️ ${esc(t("doc.download"))}</button>
          <button class="btn btn-ghost btn-block mt-2" id="btnPrint">🖨️ ${esc(t("doc.print"))}</button>
          <button class="btn btn-ghost btn-block mt-2" id="btnEdit">✏️ ${esc(t("doc.edit"))}</button>
          <hr style="border:none;border-top:1px solid var(--slate-200);margin:14px 0">
          <button class="btn btn-gold btn-block" id="btnSave">💾 ${esc(t("doc.save"))}</button>
        </div>
        ${doc.nextSteps && doc.nextSteps.length ? `
        <div class="sidebar-note">
          <h4>📌 ${esc(t("doc.nextSteps"))}</h4>
          <ul>${doc.nextSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        </div>` : ""}
      </div>
    </div>
  </div></section>`;

  const paper = view.querySelector("#docPaper");

  view.querySelector("#btnCopy").addEventListener("click", async () => {
    const ok = await copyText(paper.innerText);
    toast(ok ? t("doc.copied") : "Error", ok ? "ok" : "err");
  });

  view.querySelector("#btnDownload").addEventListener("click", () => {
    downloadText(`${slug(doc.title)}.txt`, paper.innerText);
  });

  view.querySelector("#btnPrint").addEventListener("click", () => window.print());

  view.querySelector("#btnEdit").addEventListener("click", (e) => {
    const editing = paper.getAttribute("contenteditable") === "true";
    paper.setAttribute("contenteditable", String(!editing));
    e.currentTarget.classList.toggle("btn-primary", !editing);
    e.currentTarget.classList.toggle("btn-ghost", editing);
    if (!editing) { paper.focus(); toast(t("doc.editHint")); }
    else { currentDoc.document = paper.innerText; }
  });

  view.querySelector("#btnSave").addEventListener("click", () => {
    currentDoc.document = paper.innerText;
    if (doc.storeId) {
      store.updateCase(doc.storeId, { document: currentDoc.document });
      toast(t("doc.saved"), "ok");
    } else {
      const rec = store.saveCase({
        caseType: doc.caseId,
        title: doc.title,
        icon: doc.icon,
        document: currentDoc.document,
        values: doc.values,
        status: "draft",
      });
      currentDoc.storeId = rec.id;
      doc.storeId = rec.id;
      toast(t("doc.savedCase"), "ok");
    }
  });
}


/* ============================================================
   VISTA: PANEL / MIS CASOS
   ============================================================ */
const STATUS_LABELS = {
  draft: { es: "Borrador", en: "Draft", dot: "s-draft" },
  sent: { es: "Enviado", en: "Sent", dot: "s-sent" },
  progress: { es: "En curso", en: "In progress", dot: "s-progress" },
  resolved: { es: "Resuelto", en: "Resolved", dot: "s-resolved" },
};

function renderDashboard() {
  const cases = store.getCases();
  const s = store.stats();
  const lang = getLang();

  const statusOptions = (current) => store.STATUSES.map((st) =>
    `<option value="${st}" ${current === st ? "selected" : ""}>${STATUS_LABELS[st][lang]}</option>`).join("");

  view.innerHTML = `
    ${pageHead(t("dash.title"), t("dash.lead"))}
    <section class="section"><div class="container">
      <div class="stat-row">
        <div class="stat"><div class="v">${s.total}</div><div class="l">${esc(t("dash.total"))}</div></div>
        <div class="stat draft"><div class="v">${s.draft}</div><div class="l">${esc(t("dash.draft"))}</div></div>
        <div class="stat sent"><div class="v">${s.sent}</div><div class="l">${esc(t("dash.sent"))}</div></div>
        <div class="stat resolved"><div class="v">${s.resolved}</div><div class="l">${esc(t("dash.resolved"))}</div></div>
      </div>

      ${cases.length ? `
        <div style="display:flex;justify-content:flex-end;margin-bottom:14px">
          <button class="btn btn-ghost btn-sm" id="btnExport">⬇️ ${esc(t("dash.export"))}</button>
        </div>
        <div id="caseList">
          ${cases.map((c) => `
            <div class="case-row" data-id="${c.id}">
              <div class="ci">${c.icon}</div>
              <div class="meta">
                <h4>${esc(c.title)}</h4>
                <div class="sub"><span class="status-dot ${STATUS_LABELS[c.status]?.dot || ""}"></span>${esc(t("dash.created"))}: ${esc(fmtDate(c.createdAt))}</div>
              </div>
              <select class="status-select" data-status="${c.id}" aria-label="${esc(t("dash.status"))}">${statusOptions(c.status)}</select>
              <a class="btn btn-primary btn-sm" href="#/documento/${c.id}">${esc(t("dash.view"))}</a>
              <button class="btn btn-ghost btn-sm" data-del="${c.id}">🗑️</button>
            </div>`).join("")}
        </div>
      ` : `
        <div class="empty">
          <div class="big">📂</div>
          <p>${esc(t("dash.empty"))}</p>
          <a class="btn btn-primary" href="#/casos">${esc(t("dash.emptyCta"))}</a>
        </div>`}
    </div></section>`;

  view.querySelectorAll("[data-status]").forEach((sel) =>
    sel.addEventListener("change", () => {
      store.updateCase(sel.dataset.status, { status: sel.value });
      renderDashboard();
    }));

  view.querySelectorAll("[data-del]").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (confirm(t("dash.confirmDelete"))) {
        store.deleteCase(btn.dataset.del);
        toast(t("dash.deleted"), "ok");
        renderDashboard();
      }
    }));

  const exp = view.querySelector("#btnExport");
  if (exp) exp.addEventListener("click", () => downloadText("justiciabot-casos.json", store.exportJSON()));
}

/* ============================================================
   VISTA: ASISTENTE (chatbot por palabras clave)
   ============================================================ */
function matchKB(input) {
  const q = normalize(input);
  let best = null, bestScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(normalize(kw))) score += kw.length; // favorece coincidencias largas
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  return bestScore > 0 ? best : null;
}

function renderAssistant() {
  const lang = getLang();
  view.innerHTML = `
    ${pageHead(t("assist.title"), t("assist.lead"))}
    <section class="section"><div class="container">
      <div class="chat-wrap">
        <div class="chat-box">
          <div class="chat-log" id="chatLog" aria-live="polite"></div>
          <div class="suggestions" id="suggestions">
            ${SUGGESTIONS[lang].map((s) => `<button class="chip" style="color:var(--navy-700);border-color:var(--slate-300)" data-sug="${esc(s)}">${esc(s)}</button>`).join("")}
          </div>
          <form class="chat-input" id="chatForm">
            <input type="text" id="chatInput" placeholder="${esc(t("assist.placeholder"))}" autocomplete="off" />
            <button class="btn btn-primary" type="submit">${esc(t("assist.send"))}</button>
          </form>
        </div>
        <aside>
          <div class="sidebar-note">
            <h4>📚 ${esc(t("assist.topicsTitle"))}</h4>
            <ul>
              ${KB.slice(0, 8).map((k) => {
                const c = caseById(k.caseId);
                return c ? `<li><a href="#/caso/${c.id}">${c.icon} ${esc(loc(c.title))}</a></li>` : "";
              }).join("")}
            </ul>
          </div>
          <p class="muted" style="font-size:.8rem;margin-top:12px">⚠️ ${esc(t("assist.disclaimer"))}</p>
        </aside>
      </div>
    </div></section>`;

  const log = view.querySelector("#chatLog");
  const form = view.querySelector("#chatForm");
  const input = view.querySelector("#chatInput");

  function addMsg(htmlContent, who) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.innerHTML = htmlContent;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  // Convierte **negrita** y enlaza al caso
  function botReply(text) {
    addMsg("…", "bot");
    const placeholder = log.lastChild;
    setTimeout(() => {
      const match = matchKB(text);
      let html;
      if (match) {
        const c = caseById(match.caseId);
        html = mdBold(loc(match.answer));
        if (c) html += `<span class="src"><a href="#/caso/${c.id}">${esc(t("assist.openCase"))}</a></span>`;
      } else {
        html = mdBold(loc(FALLBACK)) + `<span class="src"><a href="#/casos">${esc(t("nav.cases"))} →</a></span>`;
      }
      placeholder.innerHTML = html;
      log.scrollTop = log.scrollHeight;
    }, 350);
  }

  function send(text) {
    const clean = text.trim();
    if (!clean) return;
    addMsg(esc(clean), "user");
    botReply(clean);
    input.value = "";
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
  view.querySelectorAll("[data-sug]").forEach((b) =>
    b.addEventListener("click", () => send(b.dataset.sug)));

  // Saludo inicial
  addMsg(esc(t("assist.greeting")), "bot");
}

function mdBold(str) {
  return esc(str).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/* ============================================================
   VISTA: DERECHOS
   ============================================================ */
function renderRights() {
  view.innerHTML = `
    ${pageHead(t("rights.title"), t("rights.lead"))}
    <section class="section"><div class="container">
      <div class="article-grid">
        ${RIGHTS.map((r) => `
          <div class="article">
            <h3>${r.icon} ${esc(loc(r.title))}</h3>
            ${r.items.map((it) => `
              <details>
                <summary>${esc(loc(it.q))}</summary>
                <p>${esc(loc(it.a))}</p>
              </details>`).join("")}
          </div>`).join("")}
      </div>
      <div class="card pad-lg mt-3 text-center">
        <h3>${esc(t("hero.cta2"))}</h3>
        <p class="muted">${esc(t("assist.lead"))}</p>
        <a class="btn btn-primary" href="#/asistente">${esc(t("nav.assistant"))} →</a>
      </div>
    </div></section>`;
}

/* ============================================================
   VISTA: AVISO LEGAL
   ============================================================ */
function renderLegal() {
  const lang = getLang();
  const content = lang === "en" ? {
    title: "Legal notice & privacy",
    body: `
      <h2>Not legal advice</h2>
      <p>JusticiaBot is a free, open educational tool that helps you understand common consumer situations and generate template documents. It is <strong>not a law firm</strong>, does not provide legal representation and does not create an attorney–client relationship. The generated documents are templates that you should review and adapt to your specific situation and jurisdiction. For important matters, consult a qualified lawyer.</p>
      <h2>Jurisdiction</h2>
      <p>Laws vary significantly by country, state and region. References to specific regulations (such as EU Regulation 261/2004 or the GDPR) are provided as general guidance and may not apply to your case. Always check the rules and deadlines that apply where you live.</p>
      <h2>Privacy</h2>
      <p>JusticiaBot runs entirely in your browser. The information you enter and the cases you save are stored locally on your device using <strong>localStorage</strong>. No data is sent to any server, and there is no tracking or analytics. If you clear your browser data, your saved cases will be deleted.</p>
      <h2>No warranty</h2>
      <p>The tool is provided "as is", without warranty of any kind. The authors are not liable for any outcome resulting from the use of the generated documents.</p>`,
  } : {
    title: "Aviso legal y privacidad",
    body: `
      <h2>No es asesoramiento jurídico</h2>
      <p>JusticiaBot es una herramienta educativa gratuita y abierta que te ayuda a entender situaciones de consumo habituales y a generar documentos a partir de plantillas. <strong>No es un despacho de abogados</strong>, no presta representación legal y no crea una relación abogado–cliente. Los documentos generados son plantillas que debes revisar y adaptar a tu situación concreta y a tu jurisdicción. Para asuntos importantes, consulta a un abogado cualificado.</p>
      <h2>Jurisdicción</h2>
      <p>Las leyes varían mucho según el país, la comunidad y la región. Las referencias a normas concretas (como el Reglamento UE 261/2004 o el RGPD) son orientación general y pueden no aplicarse a tu caso. Comprueba siempre las normas y los plazos vigentes en tu lugar de residencia.</p>
      <h2>Privacidad</h2>
      <p>JusticiaBot funciona íntegramente en tu navegador. La información que introduces y los casos que guardas se almacenan localmente en tu dispositivo mediante <strong>localStorage</strong>. No se envía ningún dato a ningún servidor y no hay rastreo ni analítica. Si borras los datos de tu navegador, tus casos guardados se eliminarán.</p>
      <h2>Sin garantía</h2>
      <p>La herramienta se ofrece "tal cual", sin garantía de ningún tipo. Los autores no se responsabilizan del resultado derivado del uso de los documentos generados.</p>`,
  };

  view.innerHTML = `
    ${pageHead(content.title, "")}
    <section class="section"><div class="container">
      <div class="prose">${content.body}</div>
    </div></section>`;
}

/* ============================================================
   VISTA: 404
   ============================================================ */
function renderNotFound() {
  view.innerHTML = `
    <section class="section"><div class="container">
      <div class="empty">
        <div class="big">🧭</div>
        <h2>404</h2>
        <p>${getLang() === "en" ? "Page not found." : "Página no encontrada."}</p>
        <a class="btn btn-primary" href="#/">${esc(t("nav.home"))}</a>
      </div>
    </div></section>`;
}
