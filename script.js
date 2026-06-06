const cursor = document.querySelector(".cursor-dot");
const hoverTargets = document.querySelectorAll("a, button, .card, .project-card, .portrait-frame, .skill-cloud span, .interest-grid span");
const matrixCanvas = document.querySelector(".site-matrix");
const styleToggle = document.querySelector(".style-toggle");

if (cursor) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.opacity = "1";
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".site-nav a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

if (styleToggle) {
  styleToggle.addEventListener("click", () => {
    const isSharp = document.body.dataset.style === "sharp";
    document.body.dataset.style = isSharp ? "glass" : "sharp";
    styleToggle.textContent = isSharp ? "Style" : "Sharp";
  });
}

if (matrixCanvas) {
  const context = matrixCanvas.getContext("2d");
  const symbols = "010101 AI WEB3 KEN HKU BRISTOL";
  let columns = [];
  let animationFrame;

  const resizeMatrix = () => {
    const rect = matrixCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    matrixCanvas.width = rect.width * ratio;
    matrixCanvas.height = rect.height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const columnCount = Math.ceil(rect.width / 14);
    columns = Array.from({ length: columnCount }, (_, index) => ({
      x: index * 14,
      y: Math.random() * rect.height,
      speed: 0.18 + Math.random() * 0.42,
      tone: Math.random(),
    }));
  };

  const drawMatrix = () => {
    const width = matrixCanvas.clientWidth;
    const height = matrixCanvas.clientHeight;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(5, 5, 5, 0.68)";
    context.fillRect(0, 0, width, height);
    context.font = "13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

    columns.forEach((column, columnIndex) => {
      for (let row = -40; row < height + 40; row += 22) {
        const value = symbols[(columnIndex + row + Math.floor(column.y)) % symbols.length];
        const active = Math.sin((row + column.y) * 0.035 + columnIndex) > 0.68;
        context.fillStyle = active ? "rgba(244, 244, 239, 0.66)" : "rgba(244, 244, 239, 0.16)";
        context.fillText(value, column.x, row + column.y);
      }

      if (Math.random() > 0.985) {
        context.fillStyle = column.tone > 0.5 ? "rgba(244, 244, 239, 0.28)" : "rgba(110, 110, 110, 0.48)";
        context.fillRect(column.x, column.y % height, 7, 14);
      }

      column.y = (column.y + column.speed) % 22;
    });

    animationFrame = requestAnimationFrame(drawMatrix);
  };

  resizeMatrix();
  drawMatrix();
  window.addEventListener("resize", resizeMatrix);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
}
