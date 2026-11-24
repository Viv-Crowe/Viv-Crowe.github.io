// The project gallery. To add a project, add an entry to PROJECTS.
//
//   thread  "euc" | "wattle" | "waratah"   which colour dot it gets
//   title   project name
//   year    e.g. "2025" or "2023–24"
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
  { thread: "euc", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "tall" },
  { thread: "wattle", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "wide" },
  { thread: "waratah", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "none" },
  { thread: "euc", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "square" },
  { thread: "wattle", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "tall" },
  { thread: "waratah", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "square" },
  { thread: "euc", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "none" },
  { thread: "wattle", title: "[Project title]", year: "[Year]", blurb: "[One line: what it was and what changed because of it]", link: "#", shape: "wide" },
];

const THREAD_NAMES = {
  euc: "[Thread one]",
  wattle: "[Thread two]",
  waratah: "[Thread three]",
};

(() => {
  const gallery = document.getElementById("gallery");

  // Rough relative height of each card, used to keep the columns even.
  const SHAPE_HEIGHT = { tall: 1.25, square: 1, wide: 0.625, none: 0 };
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
      const ph = el("div", `project-image placeholder shape-${shape}`, "[project image]");
      ph.setAttribute("aria-hidden", "true");
      card.append(ph);
    }

    const body = el("div", "project-body");
    const meta = el("p", "project-meta");
    meta.append(el("span", "project-thread", THREAD_NAMES[p.thread] || ""), el("span", "project-year", p.year));
    body.append(meta, el("h2", "project-title", p.title), el("p", "project-blurb", p.blurb));
    card.append(body);
    item.append(card);
    return { node: item, height: (SHAPE_HEIGHT[shape] ?? 1) + BODY_HEIGHT };
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
