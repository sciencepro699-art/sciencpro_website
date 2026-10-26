/* Science Pro — "Connect us" floating button.  Tap the + and YouTube, Instagram and WhatsApp pop out.
   Add this one line before </body> on every page (already done if the earlier icons work):
   <script src="js/social.js" defer></script>
   It loads css/social.css by itself, so you do not touch style.css.
   Change your links ONLY in the LINKS list below. A link that still says YOUR_ is skipped. */
(function () {
  "use strict";
  var LINKS = [
    { name: "YouTube",   href: "https://www.youtube.com/@SciencePro-kerla", img: "assets/social/youtube.webp",   cls: "yt" },
    { name: "Instagram", href: "https://www.instagram.com/sciencepro26/",   img: "assets/social/instagram.webp", cls: "ig" },
    { name: "WhatsApp",  href: "https://wa.me/919747471053",                img: "assets/social/whatsapp.webp",  cls: "wa" }
  ];
  if (document.getElementById("spSocial")) return;
  var items = LINKS.filter(function (l) { return l.href.indexOf("YOUR_") === -1; });
  if (!items.length) return;

  function build() {
    var box = document.createElement("div");
    box.id = "spSocial"; box.className = "sp-social";

    var list = document.createElement("nav");
    list.id = "spSocialList"; list.className = "sp-social-list"; list.setAttribute("aria-label", "Science Pro on social media");
    items.forEach(function (l, i) {
      var a = document.createElement("a");
      a.className = "sp-social-btn sp-" + l.cls;
      a.href = l.href; a.target = "_blank"; a.rel = "noopener noreferrer"; a.tabIndex = -1;
      a.setAttribute("aria-label", "Science Pro on " + l.name);
      a.style.setProperty("--j", items.length - 1 - i);
      var img = document.createElement("img");
      img.src = l.img; img.alt = ""; img.width = 54; img.height = 54; img.decoding = "async";
      var tip = document.createElement("span");
      tip.className = "sp-social-tip"; tip.textContent = l.name;
      a.appendChild(img); a.appendChild(tip); list.appendChild(a);
    });

    var fab = document.createElement("button");
    fab.type = "button"; fab.className = "sp-fab";
    fab.setAttribute("aria-expanded", "false"); fab.setAttribute("aria-controls", "spSocialList");
    fab.setAttribute("aria-label", "Connect with Science Pro");
    fab.innerHTML = '<span class="sp-fab-label">Connect us</span><span class="sp-fab-plus" aria-hidden="true"></span>';

    box.appendChild(list); box.appendChild(fab); document.body.appendChild(box);

    var links = list.querySelectorAll("a");
    function setOpen(on) {
      box.classList.toggle("is-open", on);
      fab.setAttribute("aria-expanded", on ? "true" : "false");
      fab.setAttribute("aria-label", on ? "Close social links" : "Connect with Science Pro");
      for (var k = 0; k < links.length; k++) links[k].tabIndex = on ? 0 : -1;
    }
    fab.addEventListener("click", function () { setOpen(!box.classList.contains("is-open")); });
    document.addEventListener("click", function (e) { if (!box.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); } });
    list.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a")) setOpen(false); });

    requestAnimationFrame(function () { box.classList.add("is-in"); });
  }

  /* load the styles first, so nothing flashes unstyled */
  var css = document.createElement("link");
  css.rel = "stylesheet"; css.href = "css/social.css";
  var done = false;
  function go() { if (!done) { done = true; build(); } }
  css.onload = go; css.onerror = go;
  document.head.appendChild(css);
  setTimeout(go, 1500);
})();