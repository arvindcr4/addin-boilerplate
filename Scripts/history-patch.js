// Cache and later restore history methods because Office.js overwrites them
window._historyCache = {
  replaceState: window.history.replaceState,
  pushState: window.history.pushState,
};

// After Office.js loads, restore the cached methods
window.history.replaceState = window._historyCache.replaceState;
window.history.pushState = window._historyCache.pushState;
window._historyCache = undefined;
