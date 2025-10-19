// Entry point for the Fluxwing marketing site prototype.
// Handles progressive enhancement hooks for the terminal, gallery population, and small UI interactions.

import { componentShowcase, screenShowcase } from "./gallery-data.js";

const analyticsDefaults = () => ({
  path: window.location.pathname ?? "/",
});

const captureEvent = (eventName, properties = {}) => {
  const client = window.posthog;
  if (!client || typeof client.capture !== "function") {
    return;
  }

  try {
    client.capture(eventName, { ...analyticsDefaults(), ...properties });
  } catch (error) {
    console.debug("Analytics capture failed", error);
  }
};

captureEvent("page_view");

const YEAR_SPAN = document.querySelector("[data-year]");
if (YEAR_SPAN) {
  YEAR_SPAN.textContent = new Date().getFullYear().toString();
}

const copyButtons = document.querySelectorAll("[data-copy]");
copyButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.getAttribute("data-copy") ?? "";
    const label = btn.textContent?.trim() ?? "copy";

    try {
      await navigator.clipboard.writeText(text);
      const original = btn.textContent;
      btn.textContent = "Copied!";
      captureEvent("cta_copy_clicked", {
        label,
        success: true,
      });
      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    } catch (error) {
      console.error("Copy failed", error);
      btn.textContent = "Copy manually ↑";
      captureEvent("cta_copy_clicked", {
        label,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
});

async function fetchAsciiSnippet(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Unable to fetch ${path}`);
    }
    const text = await response.text();
    const codeBlockMatch = text.match(/```([a-zA-Z0-9-]*)?\n([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[2]) {
      return codeBlockMatch[2].trim();
    }
    return text.trim();
  } catch (error) {
    console.error("Error loading ASCII example", error);
    return "╳ Unable to load ASCII preview.";
  }
}

function renderGalleryCard({ title, category, summary, ascii }) {
  const article = document.createElement("article");
  article.className = "gallery-card";

  const heading = document.createElement("h3");
  heading.textContent = title;
  article.appendChild(heading);

  if (category) {
    const badge = document.createElement("span");
    badge.className = "gallery-card__category";
    badge.textContent = category;
    heading.appendChild(document.createTextNode(" "));
    heading.appendChild(badge);
  }

  const pre = document.createElement("pre");
  pre.textContent = ascii;
  article.appendChild(pre);

  if (summary) {
    const info = document.createElement("p");
    info.textContent = summary;
    article.appendChild(info);
  }

  return article;
}

const gallery = document.querySelector("[data-gallery]");
if (gallery) {
  const galleryItems = [
    ...componentShowcase.map((item) => ({ ...item, category: "Component" })),
    ...screenShowcase.map((item) => ({ ...item, category: "Screen" })),
  ];

  Promise.all(
    galleryItems.map(async (item) => {
      const ascii = await fetchAsciiSnippet(item.asciiPath);
      return { ...item, ascii };
    }),
  ).then((items) => {
    gallery.innerHTML = "";
    items.forEach((item) => {
      gallery.appendChild(renderGalleryCard(item));
    });
  });
}

const typedTerminals = document.querySelectorAll("[data-typed-terminal]");
if (typedTerminals.length) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  typedTerminals.forEach((terminal) => {
    const outputNode = terminal.querySelector("[data-typed-output]");
    const banner = terminal.querySelector("[data-typed-banner]");
    const commandsAttr = terminal.getAttribute("data-typed-commands");

    if (!outputNode || !commandsAttr) {
      return;
    }

    const commands = commandsAttr
      .split("|")
      .map((cmd) => cmd.trim())
      .filter(Boolean);

    if (!commands.length) {
      return;
    }

    const responseAttr = terminal.getAttribute("data-typed-responses");
    const responses = responseAttr
      ? responseAttr
          .split("|")
          .map((line) => line.trim())
          .filter(Boolean)
      : ["→ marketplace registry synced", "→ fluxwing plugin installed"];

    while (responses.length < commands.length) {
      responses.push("");
    }

    captureEvent("typed_terminal_start", {
      commands: commands.length,
    });

    if (prefersReducedMotion) {
      terminal.classList.add("is-complete");
      if (banner) {
        banner.setAttribute("aria-hidden", "false");
      }
      captureEvent("typed_terminal_complete", {
        commands: commands.length,
        reducedMotion: true,
      });
      return;
    }

    const prompt = "fluxwing@cli % ";
    const finishLine = "✔ ready: fluxwing";
    let buffer = "";
    let currentLine = 0;
    let charIndex = 0;

    const typeDelay = () => 55 + Math.random() * 55;

    const revealBanner = () => {
      setTimeout(() => {
        buffer += `${finishLine}\n`;
        outputNode.textContent = buffer;
        terminal.classList.remove("is-typing");
        terminal.classList.add("is-complete");
        if (banner) {
          banner.setAttribute("aria-hidden", "false");
        }
        captureEvent("typed_terminal_complete", {
          commands: commands.length,
          reducedMotion: false,
        });
      }, 320);
    };

    const typeNext = () => {
      if (currentLine >= commands.length) {
        revealBanner();
        return;
      }

      const command = commands[currentLine];

      if (charIndex === 0) {
        buffer += `${prompt}`;
        outputNode.textContent = buffer;
      }

      if (charIndex < command.length) {
        buffer += command.charAt(charIndex);
        charIndex += 1;
        outputNode.textContent = buffer;
        setTimeout(typeNext, typeDelay());
        return;
      }

      buffer += "\n";
      outputNode.textContent = buffer;

      const response = responses[currentLine] ?? "";
      charIndex = 0;
      currentLine += 1;

      if (response) {
        setTimeout(() => {
          buffer += `${response}\n`;
          outputNode.textContent = buffer;
          setTimeout(typeNext, 480);
        }, 220);
        return;
      }

      setTimeout(typeNext, 420);
    };

    terminal.classList.add("is-typing");
    outputNode.textContent = "";
    if (banner) {
      banner.setAttribute("aria-hidden", "true");
    }

    setTimeout(() => {
      typeNext();
    }, 650);
  });
}

const asciiPalettes = document.querySelectorAll("[data-ascii-section]");
asciiPalettes.forEach((section) => {
  const modeButtons = section.querySelectorAll("[data-ascii-mode]");
  const templateView = section.querySelector("[data-template-view]");
  const sampleView = section.querySelector("[data-sample-view]");

  if (!modeButtons.length || !templateView || !sampleView) {
    return;
  }

  const setMode = (mode) => {
    const isTemplate = mode !== "sample";
    section.classList.toggle("is-template", isTemplate);
    section.classList.toggle("is-sample", !isTemplate);
    templateView.setAttribute("aria-hidden", (!isTemplate).toString());
    sampleView.setAttribute("aria-hidden", isTemplate.toString());

    modeButtons.forEach((btn) => {
      const btnMode = btn.getAttribute("data-ascii-mode");
      const active = btnMode === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active.toString());
    });
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-ascii-mode") ?? "template";
      setMode(mode);
      captureEvent("ascii_palette_mode_selected", {
        mode,
        section: section.getAttribute("data-title") ?? section.id ?? "unknown",
      });
    });
  });

  if (section.classList.contains("is-sample")) {
    setMode("sample");
  } else {
    setMode("template");
  }
});

// TODO: mount xterm.js instance when ready and replace fallback <pre> content.
