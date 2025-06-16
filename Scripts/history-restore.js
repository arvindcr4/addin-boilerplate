// Restore cached history methods after Office.js overrides.
(function restoreHistoryMethods() {
  if (window._historyCache) {
    try {
      window.history.replaceState = window._historyCache.replaceState;
      window.history.pushState = window._historyCache.pushState;
    } catch (err) {
      // Ignore any errors – worst-case the history APIs stay patched.
      console.warn('history-restore: unable to restore History APIs', err);
    } finally {
      delete window._historyCache;
    }
  }
})();
