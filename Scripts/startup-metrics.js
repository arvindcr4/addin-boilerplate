// startup-metrics.js
// Tracks how many times the Spellbook add-in has been opened and stores the
// information both in localStorage (for convenience) and as a cookie so the
// server can also read it if needed.
(function () {
  const START_COUNT_KEY = "spellbook-start-count";
  const INSTALL_DATE_KEY = "spellbook-install-date";
  const HOST_INFO_KEY = "hostInfoValue";

  /**
   * Parse a cookie string and return the value for `name` if present.
   */
  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  /**
   * Set a cookie with sane defaults (Lax SameSite and 1-year expiry).
   */
  function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax; expires=${expires.toUTCString()}`;
  }

  /**
   * Increment the start counter and persist to both storage mechanisms.
   */
  function bumpStartCount() {
    // Prefer localStorage because it is easier to query/remove from client code.
    let count = parseInt(localStorage.getItem(START_COUNT_KEY) || "0", 10);
    if (Number.isNaN(count)) count = 0;
    count += 1;
    localStorage.setItem(START_COUNT_KEY, String(count));

    // Mirror in a cookie so server-side code can access it if needed.
    setCookie(START_COUNT_KEY, count);
  }

  /**
   * Ensure we capture first-install date once.
   */
  function ensureInstallDate() {
    if (!localStorage.getItem(INSTALL_DATE_KEY)) {
      const nowIso = new Date().toISOString();
      localStorage.setItem(INSTALL_DATE_KEY, nowIso);
      setCookie(INSTALL_DATE_KEY, nowIso);
    }
  }

  /**
   * Build host info string.
   */
  function buildHostInfo() {
    try {
      const host = (typeof Office !== "undefined" && Office.context && Office.context.host) || "Word";
      const platform = (typeof Office !== "undefined" && Office.context && Office.context.platform) || (navigator.platform.includes("Mac") ? "Mac" : "Win32");
      let version = "";
      if (typeof Office !== "undefined" && Office.context && Office.context.diagnostics && Office.context.diagnostics.officeVersion) {
        const parts = Office.context.diagnostics.officeVersion.split(".");
        version = parts[0] + "." + (parts[1] || "00");
      } else {
        const uaMatch = navigator.userAgent.match(/(\d+)\.(\d+)/);
        version = uaMatch ? uaMatch[0] : "16.00";
      }
      const lang = (typeof Office !== "undefined" && Office.context && Office.context.displayLanguage) || navigator.language || "en-US";
      return `${host}$${platform}$${version}$${lang}$$$$19`;
    } catch (err) {
      // Fallback constant string if anything goes wrong
      return "Word$Mac$16.01$en-US$$$$19";
    }
  }

  /**
   * Ensure we capture host info once.
   */
  function ensureHostInfo() {
    if (!localStorage.getItem(HOST_INFO_KEY)) {
      const info = buildHostInfo();
      localStorage.setItem(HOST_INFO_KEY, info);
      setCookie(HOST_INFO_KEY, info);
    }
  }

  // Run on DOMContentLoaded so that Office.js or other heavy scripts don’t delay counting.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      ensureInstallDate();
      ensureHostInfo();
      bumpStartCount();
    });
  } else {
    ensureInstallDate();
    ensureHostInfo();
    bumpStartCount();
  }
})();
