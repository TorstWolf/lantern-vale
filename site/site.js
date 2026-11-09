/* Vayns Library — fills Squarespace Code Blocks with page content hosted on GitHub.
   A Code Block contains just:  <div data-vl-page="home"></div>
   and this script loads site/pages/home.html into it. Edit the pages in the repo, push, done. */
(function () {
  var BASE = "https://play.vaynslibrary.com/site/pages/";
  function fill(el) {
    if (el.getAttribute("data-vl-loaded")) return;
    el.setAttribute("data-vl-loaded", "1");
    var name = el.getAttribute("data-vl-page");
    // the minute stamp skips GitHub's 10-minute CDN cache, so edits show up within a minute
    var stamp = Math.floor(Date.now() / 60000);
    fetch(BASE + encodeURIComponent(name) + ".html?v=" + stamp, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) { el.innerHTML = html; })
      .catch(function () {
        el.innerHTML = '<div class="vl"><p class="vl-muted">This section could not be loaded. Please refresh the page.</p></div>';
        el.removeAttribute("data-vl-loaded");
      });
  }
  function run() { document.querySelectorAll("[data-vl-page]").forEach(fill); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
  // Squarespace's editor and page transitions can add blocks later
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
