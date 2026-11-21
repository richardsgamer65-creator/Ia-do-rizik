// Ponte entre a página do Rizik AI e a extensão.
window.addEventListener("message", event => {
  if (event.source !== window || !event.data) return;
  const d = event.data;

  if (d.type === "RIZIK_PING") {
    window.postMessage({ type: "RIZIK_PONG" }, "*");
  } else if (d.type === "RIZIK_FETCH" && typeof d.url === "string") {
    chrome.runtime.sendMessage({ type: "fetch", url: d.url }, res => {
      window.postMessage({
        type: "RIZIK_FETCH_RESULT",
        id: d.id,
        ok: !!(res && res.ok),
        text: res && res.text,
        error: (res && res.error) || (chrome.runtime.lastError && chrome.runtime.lastError.message) || ""
      }, "*");
    });
  }
});
