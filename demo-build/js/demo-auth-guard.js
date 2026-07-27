(() => {
  window.__demoRuntimeErrors = [];
  window.addEventListener('error', (event) => {
    window.__demoRuntimeErrors.push({
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    window.__demoRuntimeErrors.push({
      message: event.reason?.message || String(event.reason || 'Unhandled rejection'),
      stack: event.reason?.stack || ''
    });
  });

  const isAuthPage = /(?:^|\/)index\.html?$/.test(location.pathname) || location.pathname.endsWith('/demo-build/');
  if (isAuthPage) return;
  if (sessionStorage.getItem('constellation-demo-verified') === 'true') return;
  window.location.href = 'index.html';
})();

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('global-loader-overlay')?.classList.remove('active');
  }, 1200);
});
