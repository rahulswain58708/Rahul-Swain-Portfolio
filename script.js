/* script.js — clean, product-first, future AI ready */

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const onDOM = fn => document.addEventListener('DOMContentLoaded', fn);

/* ---------- Smooth scrolling + active nav ---------- */
onDOM(() => {
  const navLinks = $$('.main-nav a[href^="#"]');
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  function updateActive() {
    const offset = Math.max(window.innerHeight * 0.15, 80);
    let current = sections[0];
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top - offset <= 0) current = sec;
    }
    navLinks.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === `#${current.id}`)
    );
  }

  updateActive();
  window.addEventListener('scroll', throttle(updateActive, 150));
});

/* ---------- Throttle ---------- */
function throttle(fn, wait = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

/* ---------- Contact form (client-side demo) ---------- */
onDOM(() => {
  const form = $('.contact-form');
  if (!form) return;

  const name = $('#fullname');
  const email = $('#email');
  const message = $('#message');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      (!name.value.trim() ? name :
       !email.value.trim() ? email : message).focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    await new Promise(res => setTimeout(res, 900));

    showToast('Message sent — I will reply soon.');
    form.reset();
    btn.disabled = false;
    btn.textContent = original;
  });
});

/* ---------- Toast utility ---------- */
function showToast(text) {
  const toast = document.createElement('div');
  toast.textContent = text;
  Object.assign(toast.style, {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    padding: '10px 14px',
    background: 'rgba(10,10,12,0.9)',
    color: '#dff7ff',
    borderRadius: '10px',
    zIndex: 9999
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

/* ---------- Accessibility: focus outline only on keyboard ---------- */
onDOM(() => {
  function handleTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('show-focus-outline');
      window.removeEventListener('keydown', handleTab);
    }
  }
  window.addEventListener('keydown', handleTab);
});
