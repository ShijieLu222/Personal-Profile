const cursor = document.querySelector(".cursor-dot");
const hoverTargets = document.querySelectorAll("a, button, .experience-item, .project-entry, .education-panel, .skill-cloud span, .interest-slice");
const particleCanvas = document.querySelector(".hero-particles");
const interactiveCards = document.querySelectorAll(".interactive-card");
const parallaxPanels = document.querySelectorAll("[data-parallax-panel]");

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
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
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

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  });
});

parallaxPanels.forEach((panel) => {
  panel.addEventListener("pointermove", (event) => {
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    panel.style.setProperty("--panel-x", `${x}px`);
    panel.style.setProperty("--panel-y", `${y}px`);
  });

  panel.addEventListener("pointerleave", () => {
    panel.style.setProperty("--panel-x", "0px");
    panel.style.setProperty("--panel-y", "0px");
  });
});

if (particleCanvas) {
  const context = particleCanvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0, active: false };
  let particles = [];
  let flickers = [];
  let animationFrame;

  const resizeParticles = () => {
    const rect = particleCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = rect.width * ratio;
    particleCanvas.height = rect.height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(150, Math.max(78, Math.floor((rect.width * rect.height) / 14500)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      size: 0.8 + Math.random() * 1.6,
      pulse: Math.random() * Math.PI * 2,
    }));

    flickers = Array.from({ length: 28 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: 1 + Math.random() * 2.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.018 + Math.random() * 0.04,
      tone: Math.random() > 0.72 ? "green" : "cyan",
    }));
  };

  const drawParticles = () => {
    const width = particleCanvas.clientWidth;
    const height = particleCanvas.clientHeight;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#020303";
    context.fillRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      if (!prefersReducedMotion) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.015;
      }

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 170 && distance > 1) {
          const force = (170 - distance) / 170;
          particle.x -= (dx / distance) * force * 0.5;
          particle.y -= (dy / distance) * force * 0.5;
        }
      }

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 118) {
          const alpha = (1 - distance / 118) * 0.16;
          context.strokeStyle = `rgba(131, 230, 239, ${alpha})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      const glow = 0.45 + Math.sin(particle.pulse) * 0.22;
      context.fillStyle = `rgba(246, 244, 234, ${glow})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    flickers.forEach((flicker) => {
      if (!prefersReducedMotion) flicker.phase += flicker.speed;
      const intensity = Math.max(0, Math.sin(flicker.phase) * Math.sin(flicker.phase * 0.37));
      if (intensity < 0.18) return;

      const color = flicker.tone === "green" ? "148, 242, 189" : "131, 230, 239";
      context.fillStyle = `rgba(${color}, ${intensity * 0.32})`;
      context.beginPath();
      context.arc(flicker.x, flicker.y, flicker.size + intensity * 2.2, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = `rgba(${color}, ${intensity * 0.18})`;
      context.beginPath();
      context.moveTo(flicker.x - 8, flicker.y);
      context.lineTo(flicker.x + 8, flicker.y);
      context.moveTo(flicker.x, flicker.y - 8);
      context.lineTo(flicker.x, flicker.y + 8);
      context.stroke();
    });

    const gradient = context.createRadialGradient(width * 0.58, height * 0.45, 0, width * 0.58, height * 0.45, Math.max(width, height) * 0.45);
    gradient.addColorStop(0, "rgba(148, 242, 189, 0.12)");
    gradient.addColorStop(0.46, "rgba(131, 230, 239, 0.05)");
    gradient.addColorStop(1, "rgba(5, 6, 6, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    animationFrame = requestAnimationFrame(drawParticles);
  };

  particleCanvas.addEventListener("pointermove", (event) => {
    const rect = particleCanvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });

  particleCanvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  resizeParticles();
  drawParticles();
  window.addEventListener("resize", resizeParticles);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
}
