/* =========================================================
   SCIENCE PRO — Shared behaviour
   Runs on every page: header scroll shadow, mobile nav toggle,
   the scroll-reveal animation for .reveal elements, and the
   non-blocking font swap.
   ========================================================= */

// Progressive enhancement: flip off the no-js fallback (which shows
// .reveal content instantly) the moment JS is confirmed running.
document.documentElement.classList.remove("no-js");

// Font loading: the Google Fonts stylesheet in <head> is linked with
// media="print" specifically so it never blocks first paint (the browser
// still fetches it in the background at normal priority — media="print"
// only affects whether it's applied, not whether it's downloaded). The
// moment this script runs, flip it to media="all" so the real fonts take
// over. This script tag has `defer`, so this still runs before
// DOMContentLoaded, immediately after the HTML finishes parsing.
const webfontsLink = document.getElementById("webfontsLink");
if (webfontsLink) webfontsLink.media = "all";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      toggle.setAttribute(
        "aria-expanded",
        navLinks.classList.contains("open") ? "true" : "false"
      );
    });
    // Close menu when a link is tapped (mobile)
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  initScrollReveal();
});

/* ---------------------------------------------------------
   Scroll-reveal
   Any element with class="reveal" (added in static HTML, or
   tagged onto dynamically-created cards in the js/pages/*.js
   files) fades and slides up into place the first time it
   scrolls into view. Runs once per element, then stops
   watching it — no need to replay on every scroll.
   --------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* Small helper used by class10.html / subject.html / topic pages (e.g. soundwaves.html)
   to read query params like ?subject=physics&game=speed-racer            */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
