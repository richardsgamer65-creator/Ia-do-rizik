// Busca páginas para o site Rizik AI. Só https, sem cookies, sem endereços locais.
const BLOCKED = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[?::1)/i;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || msg.type !== "fetch") return;

  (async () => {
    try {
      const u = new URL(msg.url);
      if (u.protocol !== "https:" || BLOCKED.test(u.hostname)) {
        throw new Error("Endereço não permitido.");
      }
      const r = await fetch(u.href, { credentials: "omit", redirect: "follow" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const text = (await r.text()).slice(0, 400000);
      sendResponse({ ok: true, text });
    } catch (e) {
      sendResponse({ ok: false, error: String((e && e.message) || e) });
    }
  })();

  return true; // resposta assíncrona
});
