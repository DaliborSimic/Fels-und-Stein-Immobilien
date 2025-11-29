document.addEventListener("DOMContentLoaded", function () {
  const includeElements = document.querySelectorAll("[data-include]");
  const fetches = [];

  includeElements.forEach(function (el) {
    const file = el.getAttribute("data-include");
    if (!file) return;

    const p = fetch(file)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Konnte Datei nicht laden: " + file);
        }
        return response.text();
      })
      .then(function (html) {
        el.innerHTML = html;
      })
      .catch(function (error) {
        console.error(error);
        el.innerHTML = "<!-- Fehler beim Laden von " + file + " -->";
      });

    fetches.push(p);
  });

  // Wenn alle Partials geladen sind, dann dein ursprüngliches script.js nachladen
  Promise.all(fetches)
    .then(function () {
      const script = document.createElement("script");
      script.src = "./assets/js/script.js";
      document.body.appendChild(script);
    })
    .catch(function (error) {
      console.error("Fehler beim Laden der Partials:", error);
    });
});
