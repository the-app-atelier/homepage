/* language-script.js — App Atelier
   Ziel:
   1) Browser-Translate zuverlässig ANGEBOTEN bekommen (Heuristik füttern)
   2) Nutzer*innen freundlichen Banner zeigen, wenn Gerätesprache != Deutsch
   3) Fallback-Optionen: a) Google-Translate-Proxy-Link b) ggf. eigene i18n-Strings
*/

// ------- Konfiguration -------
const SITE_DEFAULT_LANG = "de";              // Inhaltssprache deiner Seiten
const SUPPORTED = ["de", "en"];              // für optionalen i18n-Fallback
const ENABLE_I18N_FALLBACK = false;          // auf true setzen, wenn du unten DICT pflegst

// Optionale i18n: nur nutzen, wenn du ENABLE_I18N_FALLBACK = true setzt
const DICT = {
  en: {
    "banner.title": "Translate this page?",
    "banner.body": "We detected your device language is not German. You can use your browser’s built-in translator or open a translated view.",
    "banner.btnBrowser": "Use browser translator",
    "banner.btnGoogle": "Open translated view",
    "banner.dismiss": "Dismiss",
  },
  de: {
    "banner.title": "Seite übersetzen?",
    "banner.body": "Ihre Gerätesprache ist nicht Deutsch. Sie können den integrierten Browser-Übersetzer nutzen oder eine übersetzte Ansicht öffnen.",
    "banner.btnBrowser": "Browser-Übersetzer nutzen",
    "banner.btnGoogle": "Übersetzte Ansicht öffnen",
    "banner.dismiss": "Schließen",
  }
};

// ------- Helfer -------
function normLang(raw) {
  const v = (raw || "").toLowerCase();
  if (v.startsWith("de")) return "de";
  if (v.startsWith("en")) return "en";
  return "en"; // Fallback
}
function t(key, lang) {
  if (!ENABLE_I18N_FALLBACK) return DICT[SITE_DEFAULT_LANG][key] || key;
  return (DICT[lang] && DICT[lang][key]) || (DICT[SITE_DEFAULT_LANG] && DICT[SITE_DEFAULT_LANG][key]) || key;
}
function currentUrlEncoded() {
  return encodeURIComponent(window.location.href);
}

// ------- 1) Heuristik-Optimierung für Browser-Translate -------
(function improveTranslateHeuristics() {
  // a) Setze das lang-Attribut korrekt (hilft dem Seitenspracherkenner)
  const html = document.documentElement;
  if (!html.getAttribute("lang")) html.setAttribute("lang", SITE_DEFAULT_LANG);

  // b) Content-Language-Meta injizieren, falls nicht gesetzt
  if (!document.querySelector('meta[http-equiv="content-language"]')) {
    const m = document.createElement("meta");
    m.setAttribute("http-equiv", "content-language");
    m.setAttribute("content", SITE_DEFAULT_LANG);
    document.head.appendChild(m);
  }

  // c) Chrome-spezifisch: niemals "notranslate" setzen; falls vorhanden, entfernen
  // (notranslate blockiert die Leiste zuverlässig)
  document.querySelectorAll(".notranslate,[translate='no']").forEach(el => {
    el.classList.remove("notranslate");
    el.removeAttribute("translate");
  });

  // d) Optional: HTML5 translate="yes" setzen (signalisiert „darf übersetzt werden“)
  if (!html.hasAttribute("translate")) html.setAttribute("translate", "yes");
})();

// ------- 2) Zeige Banner, wenn Gerätesprache != Deutsch -------
(function showTranslateBannerIfNeeded() {
  const deviceLang = normLang(navigator.language || navigator.userLanguage || "en");
  const pageLang = (document.documentElement.getAttribute("lang") || SITE_DEFAULT_LANG).toLowerCase();
  const url = new URL(window.location.href);
  const noBanner = url.searchParams.get("noTranslateBanner") === "1";
  const dismissed = localStorage.getItem("aa_tr_banner_dismissed") === "1";

  if (noBanner || dismissed) return;
  if (deviceLang === "de") return;         // Alles gut, keine Übersetzung nötig
  if (pageLang !== "de") return;            // Seite ist bereits nicht-deutsch (z. B. /en), kein Banner

  // Banner UI
  const wrap = document.createElement("div");
  wrap.id = "aa-translate-banner";
  wrap.innerHTML = `
    <div style="
      position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;
      border:1px solid rgba(0,0,0,.1);border-radius:14px;
      background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.12);
      padding:14px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;
      font: 14px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    ">
      <div style="flex:1 1 auto;min-width:220px">
        <div style="font-weight:700;margin-bottom:4px;">${t("banner.title", deviceLang)}</div>
        <div style="opacity:.8">${t("banner.body", deviceLang)}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button id="aa-btn-browser" type="button" style="padding:8px 10px;border-radius:10px;border:1px solid rgba(0,0,0,.12);background:#fff;cursor:pointer;">
          ${t("banner.btnBrowser", deviceLang)}
        </button>
        <a id="aa-btn-google" href="https://translate.google.com/translate?sl=de&tl=${deviceLang}&u=${currentUrlEncoded()}"
           style="text-decoration:none;padding:8px 10px;border-radius:10px;border:1px solid rgba(0,0,0,.12);background:#fff;display:inline-block;">
          ${t("banner.btnGoogle", deviceLang)}
        </a>
        <button id="aa-btn-dismiss" type="button" style="padding:8px 10px;border-radius:10px;border:0;background:#f2f2f2;cursor:pointer;">
          ${t("banner.dismiss", deviceLang)}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // „Browser-Übersetzer nutzen“ – wir können ihn NICHT direkt starten.
  // Stattdessen: Hinweise & leichte Hilfen je Plattform.
  document.getElementById("aa-btn-browser").addEventListener("click", () => {
    // 1) Kleiner Tipp-Dialog je nach Browser/OS
    const ua = navigator.userAgent.toLowerCase();
    let steps = "";
    if (ua.includes("chrome")) {
      steps = "- Chrome: Tipp auf die Übersetzungsleiste am unteren/oberen Bildschirmrand.\n  (Falls nicht sichtbar: Menü ⋮ → „Übersetzen“)";
    } else if (ua.includes("safari")) {
      steps = "- Safari (iOS/macOS): aA-Icon in der Adressleiste → „Übersetzen in …“";
    } else if (ua.includes("edg")) {
      steps = "- Microsoft Edge: „Seite übersetzen“-Symbol in der Adressleiste.";
    } else {
      steps = "- Browser: Suche in der Adressleiste nach „Übersetzen“ oder öffne die Google-Übersicht.";
    }
    alert("So aktivierst du die integrierte Übersetzung:\n\n" + steps);
  });

  document.getElementById("aa-btn-dismiss").addEventListener("click", () => {
    localStorage.setItem("aa_tr_banner_dismissed", "1");
    wrap.remove();
  });
})();

// ------- 3) (Optional) Minimaler i18n-Fallback (nur wenn ENABLE_I18N_FALLBACK=true) -------
(function optionalI18nSwap() {
  if (!ENABLE_I18N_FALLBACK) return;
  const deviceLang = normLang(navigator.language || "en");
  if (deviceLang === SITE_DEFAULT_LANG) return;

  // Ersetze nur Elemente mit data-i18n (SEO-sicher, DE bleibt default im HTML)
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key, deviceLang);
    });
  });
})();
