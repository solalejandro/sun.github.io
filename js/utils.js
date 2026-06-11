/* ============================================================
   Utils — Helpers de DOM, formato y notificaciones
   ============================================================ */
import { getLang } from "./i18n.js";

/** Escapa HTML para evitar inyección al renderizar datos del usuario. */
export function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Crea un elemento desde HTML. */
export function html(strings, ...values) {
  return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ""), "");
}

/** Notificación tipo toast. */
let toastTimer;
export function toast(message, type = "") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.className = "toast show " + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = "toast " + type; }, 3200);
}

/** Formatea una fecha legible según idioma. */
export function fmtDate(ts) {
  const d = new Date(ts);
  const locale = getLang() === "en" ? "en-US" : "es-ES";
  return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}

/** Fecha de hoy en formato largo para documentos. */
export function today() {
  return fmtDate(Date.now());
}

/** Formatea importe monetario; devuelve string tal cual si no es numérico. */
export function money(val, currency = "") {
  const n = Number(String(val).replace(/[^0-9.,-]/g, "").replace(",", "."));
  if (isNaN(n)) return val || "";
  const locale = getLang() === "en" ? "en-US" : "es-ES";
  const formatted = n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency ? `${formatted} ${currency}` : formatted;
}

/** Descarga un archivo de texto. */
export function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Copia texto al portapapeles con fallback. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch {}
    ta.remove();
    return ok;
  }
}

/** Normaliza texto para búsquedas (sin acentos, minúsculas). */
export function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Devuelve un valor o un guion si está vacío (para documentos). */
export function val(v, fallback = "____________") {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
}

/** Slug para nombres de archivo. */
export function slug(str) {
  return normalize(str).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "documento";
}
