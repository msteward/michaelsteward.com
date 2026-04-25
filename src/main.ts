import './globals.css';
import './app.css';

// ── Theme ─────────────────────────────────────────────────────────────────────

const btn = document.getElementById('theme-toggle') as HTMLButtonElement | null;

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch {}
  if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
}

if (btn) {
  const current = (document.documentElement.getAttribute('data-theme') ?? 'dark') as 'light' | 'dark';
  btn.setAttribute('aria-pressed', String(current === 'dark'));

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  try { if (localStorage.getItem('theme') !== null) return; } catch {}
  applyTheme(e.matches ? 'dark' : 'light');
});

// ── Clock ─────────────────────────────────────────────────────────────────────

const clockEl = document.getElementById('clock');

function updateClock() {
  if (clockEl) {
    clockEl.textContent = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Vancouver',
    });
  }
}

updateClock();
setInterval(updateClock, 30_000);

// ── Footer year ───────────────────────────────────────────────────────────────

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
