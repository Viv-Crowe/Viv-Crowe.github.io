// The project gallery. To add a project, add an entry to PROJECTS.
//
//   thread  "euc" | "wattle" | "waratah"   which colour dot it gets
//   title   project name
//   year    e.g. "2025" or "2021–2023" (en dash for ranges)
//   blurb   one line: what it was and what changed because of it
//   link    URL (optional; without one, the card isn't clickable)
//   image   path to an image, e.g. "images/hot-sauce.jpg" (optional)
//   alt     description of the image, for screen readers (needed with image)
//   shape   "tall" | "square" | "wide" | "none" (no image). Images are cropped
//           to this shape, which keeps the columns balanced.
//
// Cards fill the gallery left to right in this order, so put the ones you
// most want seen first.

const PROJECTS = [
  { thread: "euc", title: "sAibr | Solentropy", year: "2026", blurb: "Reduced interview processing time from days to minutes. Reports now contain direct links to primary sources.", shape: "tall" },
  { thread: "wattle", title: "Babel AI", year: "2026", blurb: "A creative project communicating AI use patterns through Anthropic's independent research dataset.", shape: "wide" },
  { thread: "waratah", title: "LanMan", year: "2026", blurb: "Data management and evidence-backed decision support for land stewardship.", shape: "none" },
  { thread: "euc", title: "ChrysaLabs", year: "2021–2023", blurb: "Developed ML algorithms for a soil measurement device.", shape: "square" },
  { thread: "wattle", title: "Inside a Drop of Saliva", year: "2026", blurb: "An interactive installation at RMIT's Discovery to Device biosensor manufacturing facility.", shape: "tall" },
];

const THREAD_NAMES = {
  euc: "Data",
  wattle: "Creative projects",
  waratah: "Biology",
};

(() => {
  const gallery = document.getElementById("gallery");

  // Rough relative height of each card, used to keep the columns even.
  const SHAPE_HEIGHT = { tall: 1.25, square: 1, wide: 0.625, none: 0 };
  const BAND_HEIGHT = { tall: 0.38, square: 0.28, wide: 0.21, none: 0 }; // no image yet
  const BODY_HEIGHT = 0.5;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function buildCard(p) {
    const shape = p.shape || (p.image ? "square" : "none");
    const item = el("article", `project thread-${p.thread}`);
    const card = el(p.link ? "a" : "div", "project-card");
    if (p.link) card.href = p.link;

    if (p.image) {
      const img = el("img", `project-image shape-${shape}`);
      img.src = p.image;
      img.alt = p.alt || "";
      img.loading = "lazy";
      card.append(img);
    } else if (shape !== "none") {
      const ph = el("div", `project-image placeholder shape-${shape}`);
      ph.setAttribute("aria-hidden", "true");
      card.append(ph);
    }

    const body = el("div", "project-body");
    const meta = el("p", "project-meta");
    meta.append(el("span", "project-thread", THREAD_NAMES[p.thread] || ""), el("span", "project-year", p.year));
    body.append(meta, el("h2", "project-title", p.title), el("p", "project-blurb", p.blurb));
    card.append(body);
    item.append(card);
    return { node: item, height: ((p.image ? SHAPE_HEIGHT : BAND_HEIGHT)[shape] ?? 0.5) + BODY_HEIGHT };
  }

  const cards = PROJECTS.map(buildCard);
  const wide = window.matchMedia("(min-width: 60rem)");
  const medium = window.matchMedia("(min-width: 38rem)");

  // Each card goes into the shortest column so far, so the first few cards
  // land across the top row. Keyboard order runs down each column in turn.
  function layout() {
    const count = wide.matches ? 3 : medium.matches ? 2 : 1;
    const columns = Array.from({ length: count }, () => ({ node: el("div", "gallery-column"), height: 0 }));
    for (const card of cards) {
      const shortest = columns.reduce((a, b) => (b.height < a.height ? b : a));
      shortest.node.append(card.node);
      shortest.height += card.height;
    }
    gallery.replaceChildren(...columns.map((c) => c.node));
  }

  wide.addEventListener("change", layout);
  medium.addEventListener("change", layout);
  layout();
})();
