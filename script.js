addEventListener("DOMContentLoaded", (event) => {
  (function () {
    const container = document.querySelector(".container.nav");
    const toggle = container && container.querySelector(".nav-toggle");
    const nav = container && container.querySelector("nav");

    if (!toggle || !nav) return;

    function setExpanded(isOpen) {
      toggle.setAttribute("aria-expanded", String(!!isOpen));
      container.classList.toggle("nav-open", !!isOpen);
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setExpanded(!container.classList.contains("nav-open"));
    });

    // close when clicking a link or outside
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setExpanded(false);
    });
    document.addEventListener("click", function (e) {
      if (!container.contains(e.target)) setExpanded(false);
    });

    // optional: close on ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setExpanded(false);
    });
  })();

  /* ---------- i18n for The App Atelier (DE default, EN fallback) ---------- */

  (function () {
    // --- 1) Helpers
    const SUPPORTED = ["de", "en"];

    function normalizeLang(raw) {
      const v = (raw || "").toLowerCase();
      if (v.startsWith("de")) return "de";
      return "en"; // default fallback
    }

    function getInitialLang() {
      const url = new URL(window.location.href);
      const qLang = url.searchParams.get("lang");
      if (qLang && SUPPORTED.includes(normalizeLang(qLang)))
        return normalizeLang(qLang);

      const saved = localStorage.getItem("aa_lang");
      if (saved && SUPPORTED.includes(saved)) return saved;

      const nav = navigator.language || navigator.userLanguage || "en";
      return normalizeLang(nav);
    }

    function setLang(lang) {
      localStorage.setItem("aa_lang", lang);
      document.documentElement.setAttribute("lang", lang);
      translatePage(lang);
      updateToggleLabel(lang);
    }

    // --- 2) Base dictionary (extend per page if needed)
    // Keys sind frei wählbar – du referenzierst sie über data-i18n="key"
    const DICT = {
      de: {
        // navigation
        "nav.projects": "Projekte",
        "nav.about": "Über uns",
        "nav.method": "Methodologie",
        "nav.career": "Karriere",
        "nav.imprint": "Impressum",
        "nav.privacy": "Datenschutz",

        // generic
        "cta.apply": "Jetzt bewerben",
        "cta.contact": "Kontakt aufnehmen",
        "footer.copyright": "© 2025 The App Atelier",

        // careers
        "career.hero.kicker": "Werde Teil des Ateliers",
        "career.hero.title": "Karriere bei The App Atelier",
        "career.hero.subtitle":
          "Wir gestalten digitale Erlebnisse wie Kunstwerke – mit Präzision, Empathie und Code.",
        "career.section.open": "Aktuelle Stellen",
        "career.section.culture": "Unsere Kultur",
        "career.section.apply": "Bewirb dich jetzt",
        "career.mailto.copy": "E-Mail-Adresse kopieren",

        // roles headings (Beispiele)
        "role.frontend.title": "Frontend-Entwickler:in (m/w/d)",
        "role.ux.title": "UX / UI Designer:in (m/w/d)",
        "role.workingstudent.title": "Werkstudent:in Web-Development (m/w/d)",

        // method page (Beispiele)
        "method.hero.title": "Unsere Methodologie",
        "method.hero.kicker": "Vorgehensweise & FAQ",
      },
      en: {
        // navigation
        "nav.projects": "Projects",
        "nav.about": "About",
        "nav.method": "Methodology",
        "nav.career": "Careers",
        "nav.imprint": "Imprint",
        "nav.privacy": "Privacy",

        // generic
        "cta.apply": "Apply now",
        "cta.contact": "Get in touch",
        "footer.copyright": "© 2025 The App Atelier",

        // careers
        "career.hero.kicker": "Join the Atelier",
        "career.hero.title": "Careers at The App Atelier",
        "career.hero.subtitle":
          "We craft digital experiences like artworks — with precision, empathy, and code.",
        "career.section.open": "Open Positions",
        "career.section.culture": "Our Culture",
        "career.section.apply": "Apply Now",
        "career.mailto.copy": "Copy email address",

        // roles headings (examples)
        "role.frontend.title": "Frontend Engineer (f/m/d)",
        "role.ux.title": "UX / UI Designer (f/m/d)",
        "role.workingstudent.title": "Working Student Web-Development (f/m/d)",

        // method page (examples)
        "method.hero.title": "Our Methodology",
        "method.hero.kicker": "Approach & FAQ",
      },
    };

    // Optional: per-page extension via window.AA_I18N_EXT = { de:{...}, en:{...} } vor script.js
    function mergeDict(base, ext) {
      if (!ext) return base;
      const out = { de: { ...base.de }, en: { ...base.en } };
      if (ext.de) Object.assign(out.de, ext.de);
      if (ext.en) Object.assign(out.en, ext.en);
      return out;
    }

    // --- 3) Translate routine
    function t(key, lang) {
      const dict = CURRENT_DICT[lang] || {};
      return dict[key] != null ? dict[key] : CURRENT_DICT.de[key] || key;
    }

    function translatePage(lang) {
      // a) Innertext/HTML
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        const useHtml = el.hasAttribute("data-i18n-html");
        const value = t(key, lang);
        if (useHtml) el.innerHTML = value;
        else el.textContent = value;
      });

      // b) Attribute (z. B. placeholder, title, aria-label)
      document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        const map = el.getAttribute("data-i18n-attr"); // z. B. "placeholder:form.search.placeholder,title:form.search.title"
        if (!map) return;
        map.split(",").forEach((pair) => {
          const [attr, key] = pair.split(":").map((s) => s.trim());
          if (attr && key) {
            const value = t(key, lang);
            el.setAttribute(attr, value);
          }
        });
      });
    }

    // --- 4) Toggle UI (kleiner Knopf oben rechts)
    function injectToggle() {
      if (document.getElementById("aa-lang-toggle")) return;
      const btn = document.createElement("button");
      btn.id = "aa-lang-toggle";
      btn.type = "button";
      btn.style.cssText =
        "position:fixed;right:14px;bottom:14px;z-index:50;border:1px solid var(--stroke);background:#fff;padding:10px 12px;border-radius:999px;box-shadow:var(--shadow-soft);font-weight:600;cursor:pointer;";
      btn.addEventListener("click", () =>
        setLang(currentLang === "de" ? "en" : "de")
      );
      document.body.appendChild(btn);
      updateToggleLabel(currentLang);
    }

    function updateToggleLabel(lang) {
      const el = document.getElementById("aa-lang-toggle");
      if (!el) return;
      el.textContent = lang === "de" ? "EN" : "DE";
      el.setAttribute(
        "aria-label",
        lang === "de" ? "Switch to English" : "Auf Deutsch umschalten"
      );
      el.title = el.getAttribute("aria-label");
    }

    // --- 5) Boot
    let CURRENT_DICT = mergeDict(DICT, window.AA_I18N_EXT);
    let currentLang = getInitialLang();

    window.AA_i18n = {
      setLang,
      get lang() {
        return currentLang;
      },
      extend(ext) {
        CURRENT_DICT = mergeDict(CURRENT_DICT, ext);
        translatePage(currentLang);
      },
    };

    document.addEventListener("DOMContentLoaded", () => {
      setLang(currentLang);
      injectToggle();
    });
  })();
});
