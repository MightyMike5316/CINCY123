/* Westside-Old Window Repair — small progressive enhancements.
   The site works fully without JavaScript; this only adds conveniences. */
(function () {
  "use strict";

  /* ---- Mobile navigation toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) toggle.click();
    });
  }

  /* ---- Highlight today's row in any hours table ---- */
  var today = (new Date().getDay() + 6) % 7; // Monday = 0 … Sunday = 6, matching the table order
  document.querySelectorAll("[data-hours] tr[data-day]").forEach(function (row) {
    if (Number(row.getAttribute("data-day")) === today) {
      row.classList.add("today");
      var th = row.querySelector("th");
      if (th) th.insertAdjacentHTML("beforeend", ' <span class="visually-hidden">(today)</span>');
    }
  });

  /* ---- Reviews from /reviews.json (static HTML is the fallback) ---- */
  var containers = document.querySelectorAll("#all-reviews, #home-reviews");
  if (!containers.length || !window.fetch) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function stars(n) {
    n = Math.max(0, Math.min(5, Math.round(n)));
    return '<span class="stars" aria-label="' + n + ' out of 5 stars">' + "★".repeat(n) + "☆".repeat(5 - n) + "</span>";
  }
  function monthYear(iso) {
    var d = new Date(iso + "T12:00:00");
    return isNaN(d) ? esc(iso) : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  function card(r) {
    return (
      '<article class="review-card"><blockquote>' + esc(r.text) + "</blockquote>" +
      '<div class="review-meta">' + stars(r.rating) + " <strong>" + esc(r.author) + "</strong> " +
      '<time datetime="' + esc(r.date) + '">' + monthYear(r.date) + "</time> " +
      '<span class="review-source">' + esc(r.source || "Google") + " review</span></div></article>"
    );
  }

  fetch("/reviews.json", { cache: "no-cache" })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.reviews) || !data.reviews.length) return;
      var reviews = data.reviews.slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
      containers.forEach(function (el) {
        var limit = Number(el.getAttribute("data-reviews-limit")) || reviews.length;
        el.innerHTML = reviews.slice(0, limit).map(card).join("");
      });
      var avg = reviews.reduce(function (s, r) { return s + Number(r.rating || 0); }, 0) / reviews.length;
      document.querySelectorAll("[data-rating-avg]").forEach(function (el) { el.textContent = avg.toFixed(1); });
      document.querySelectorAll("[data-rating-count]").forEach(function (el) { el.textContent = reviews.length; });
    })
    .catch(function () { /* keep the static markup */ });
})();
