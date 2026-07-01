const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initLenis = () => {
  if (prefersReducedMotion || typeof Lenis === "undefined") return null;

  const lenis = new Lenis({
    duration: 1.12,
    smoothWheel: true,
    wheelMultiplier: 0.92,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
  return lenis;
};

const initHeader = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 32);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
};

const initCursor = () => {
  const cursor = document.querySelector(".cursor-dot");
  if (!cursor || window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion) return;

  const hoverTargets = document.querySelectorAll(
    "a, button, .experience-item, .project-entry, .education-panel, .skill-cloud span, .interest-slice, .contact-card"
  );

  window.addEventListener("mousemove", (event) => {
    cursor.style.opacity = "1";
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
};

const initReveal = () => {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
};

const initNavState = () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".site-nav a");
  if (!sections.length || !navLinks.length) return;

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
};

const initInteractiveCards = () => {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll(".interactive-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });
  });
};

const initEducationPanels = () => {
  if (window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion) return;

  document.querySelectorAll("[data-parallax-panel]").forEach((panel) => {
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
};

const initExperienceFocus = () => {
  const cards = [...document.querySelectorAll("[data-experience-card]")];
  if (!cards.length) return;

  const setActiveCard = (activeCard) => {
    cards.forEach((card) => {
      card.classList.toggle("is-active", card === activeCard);
      card.classList.toggle("is-muted", card !== activeCard);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveCard(visible.target);
    },
    { threshold: [0.25, 0.45, 0.65], rootMargin: "-18% 0px -28% 0px" }
  );

  cards.forEach((card) => observer.observe(card));
  setActiveCard(cards[0]);
};

const initGsapMotion = () => {
  if (prefersReducedMotion || typeof gsap === "undefined") return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (typeof SplitType !== "undefined") {
    const routeTitle = document.querySelector(".hero-title-route");
    if (routeTitle && !routeTitle.dataset.split) {
      routeTitle.dataset.split = "true";
      const split = new SplitType(routeTitle, { types: "words", wordClass: "split-word" });
      gsap.from(split.words, {
        yPercent: 86,
        opacity: 0,
        duration: 0.58,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.24,
      });
    }
  }

  gsap.from(".hero-title-ken, .hero-title-name", {
    y: 38,
    opacity: 0,
    duration: 0.72,
    ease: "power3.out",
    stagger: 0.1,
  });

  if (typeof ScrollTrigger === "undefined") return;

  gsap.to(".hero-blueprint", {
    yPercent: 8,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.utils.toArray(".section-heading").forEach((heading) => {
    gsap.from(heading.children, {
      y: 24,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: heading,
        start: "top 78%",
      },
    });
  });
};

const initIcons = () => {
  if (typeof lucide !== "undefined") lucide.createIcons();
};

window.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initHeader();
  initCursor();
  initReveal();
  initNavState();
  initInteractiveCards();
  initEducationPanels();
  initExperienceFocus();
  initGsapMotion();
  initIcons();
});
