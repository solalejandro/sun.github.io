/* ============================================================
   Store — Gestión de casos en localStorage
   ============================================================ */

const KEY = "jb_cases_v1";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent("caseschange"));
}

export const STATUSES = ["draft", "sent", "progress", "resolved"];

export function getCases() {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function getCase(id) {
  return read().find((c) => c.id === id) || null;
}

export function saveCase(payload) {
  const list = read();
  const now = Date.now();
  const existingIdx = payload.id ? list.findIndex((c) => c.id === payload.id) : -1;

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...payload, updatedAt: now };
    write(list);
    return list[existingIdx];
  }

  const record = {
    id: "c_" + now.toString(36) + Math.random().toString(36).slice(2, 6),
    caseType: payload.caseType,
    title: payload.title,
    icon: payload.icon || "📄",
    document: payload.document || "",
    values: payload.values || {},
    status: payload.status || "draft",
    notes: payload.notes || "",
    createdAt: now,
    updatedAt: now,
  };
  list.push(record);
  write(list);
  return record;
}

export function updateCase(id, patch) {
  const list = read();
  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: Date.now() };
  write(list);
  return list[idx];
}

export function deleteCase(id) {
  write(read().filter((c) => c.id !== id));
}

export function stats() {
  const list = read();
  const s = { total: list.length, draft: 0, sent: 0, progress: 0, resolved: 0 };
  list.forEach((c) => { s[c.status] = (s[c.status] || 0) + 1; });
  return s;
}

export function exportJSON() {
  return JSON.stringify(read(), null, 2);
}
