// includes.js
// Lädt HTML-Partials anhand des Attributs data-include
// Funktioniert auch rekursiv (Partials können wieder Partials enthalten)

async function loadPartials(rootElement) {
  const root = rootElement || document;
  const includeElements = root.querySelectorAll("[data-include]");

  const tasks = [];

  includeElements.forEach((el) => {
    const url = el.getAttribute("data-include");
    if (!url) return;

    const task = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Laden von " + url);
        }
        return response.text();
      })
      .then((html) => {
        el.removeAttribute("data-include"); // damit wir nicht doppelt laden
        el.innerHTML = html;

        // Rekursiv: neu eingefügte Inhalte auch prüfen
        return loadPartials(el);
      })
      .catch((error) => {
        console.error(error);
        el.innerHTML = "<!-- Fehler beim Laden von " + url + " -->";
      });

    tasks.push(task);
  });

  return Promise.all(tasks);
}

document.addEventListener("DOMContentLoaded", function () {
  loadPartials();
});
