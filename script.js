/* script.js (updated)
   - All placeholders replaced with your portfolio URLs
   - Injects/updates Book JSON-LD in <head>
   - Smooth scroll, form validation, download counter, updateBookStatus()
*/

/* ---------- Helpers ---------- */
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function onDOM(fn){ document.addEventListener('DOMContentLoaded', fn); }

/* ---------- Book JSON-LD (work-in-progress) ----------
   Values set to your portfolio domain. Edit if you host files elsewhere.
*/
window.bookJson = {
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "Pysimplify",
  "author": {
    "@type": "Person",
    "name": "Rahul Swain",
    "url": "https://rahul-portfolio.vercel.app/"
  },
  "url": "https://rahul-portfolio.vercel.app/book/pysimplify",
  "description": "PySimplify is a simple, beginner-friendly Python guide that explains everything in easy English with clear examples and visuals. It helps complete beginners learn programming step-by-step, with practice in every chapter. (Draft / In progress.)",
  // cover image (absolute URL). Replace if you host image at a different path.
  "image": "https://rahul-portfolio.vercel.app/assets/PySimplify_EBook.png",
  "bookFormat": "https://schema.org/EBook",
  "inLanguage": "en",
  "publisher": {
    "@type": "Organization",
    "name": "Rahul Swain"
  }
};

/* ---------- Inject JSON-LD into <head> (if not present) ---------- */
function ensureJsonLdInjected() {
  const existing = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .find(s => {
      try {
        const o = JSON.parse(s.textContent || '{}');
        return o && (o['@type'] === 'Book' || (Array.isArray(o['@type']) && o['@type'].includes('Book')));
      } catch (err) {
        return false;
      }
    });

  if (existing) {
    existing.textContent = JSON.stringify(window.bookJson, null, 2);
    return existing;
  } else {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(window.bookJson, null, 2);
    (document.head || document.body).appendChild(script);
    return script;
  }
}

/* ---------- Smooth scrolling + active link highlighting ---------- */
onDOM(() => {
  // inject JSON-LD early
  ensureJsonLdInjected();

  const navLinks = $$('.main-nav a[href^="#"]');
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      setTimeout(() => target.removeAttribute('tabindex'), 1000);
    });
  });

  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function updateActive() {
    const offset = Math.max(window.innerHeight * 0.15, 80);
    let current = sections[0];
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top - offset <= 0) current = sec;
    }
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current.id}`));
  }
  updateActive();
  window.addEventListener('scroll', throttle(updateActive, 150));
});

/* ---------- Throttle helper ---------- */
function throttle(fn, wait = 100){
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

/* ---------- Contact form validation & simple UX ---------- */
onDOM(() => {
  const form = $('.contact-form');
  if (!form) return;

  const nameInput = $('#fullname');
  const emailInput = $('#email');
  const messageInput = $('#message');

  function showError(el, msg) {
    clearError(el);
    const span = document.createElement('div');
    span.className = 'field-error';
    span.setAttribute('role','alert');
    span.style.color = '#ffb3a7';
    span.style.fontSize = '0.95rem';
    span.style.marginTop = '6px';
    span.textContent = msg;
    el.parentNode.insertBefore(span, el.nextSibling);
  }
  function clearError(el){
    const next = el.nextSibling;
    if (next && next.className === 'field-error') next.remove();
  }

  form.addEventListener('submit', (e) => {
    let valid = true;
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name.');
      valid = false;
    } else clearError(nameInput);

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError(emailInput, 'Please enter your email.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      showError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else clearError(emailInput);

    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please write a short message.');
      valid = false;
    } else clearError(messageInput);

    if (!valid) {
      e.preventDefault();
      const firstError = form.querySelector('.field-error');
      if (firstError) firstError.previousElementSibling.focus();
    } else {
      const btn = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const orig = btn.textContent;
        btn.textContent = 'Sending...';
        setTimeout(() => {
          try { btn.textContent = orig; btn.disabled = false; } catch {}
        }, 1200);
      }
    }
  });
});

/* ---------- Download preview counter + toast ---------- */
onDOM(() => {
  const downloadLinks = Array.from(document.querySelectorAll('a[download], a[href$=".pdf"]'));
  if (!downloadLinks.length) return;

  const toast = document.createElement('div');
  toast.id = 'ebook-toast';
  toast.setAttribute('aria-live','polite');
  Object.assign(toast.style, {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    padding: '10px 14px',
    background: 'rgba(10,10,12,0.9)',
    color: '#fff',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
    transform: 'translateY(12px)',
    opacity: '0',
    transition: 'opacity .25s ease, transform .25s ease',
    zIndex: 9999,
    fontSize: '0.95rem'
  });
  document.body.appendChild(toast);

  function showToast(msg){
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2200);
  }

  downloadLinks.forEach(link => {
    link.addEventListener('click', () => {
      try {
        const key = 'pysimplify_preview_count';
        const n = parseInt(localStorage.getItem(key) || '0', 10) + 1;
        localStorage.setItem(key, String(n));
        showToast(`Preview downloaded — total downloads (local): ${n}`);
        console.info(`[script.js] Preview downloads (local): ${n}`);
      } catch (err) {
        // ignore storage errors
      }
    });
  });
});

/* ---------- Book status updater (processing -> published) ----------
   Updates both visible badge and the JSON-LD <script> in the head.
   Usage: updateBookStatus({ published: true, date: '2025-12-01', isbn: '978-...' })
*/
function updateBookStatus({ published = false, date = '', isbn = '' } = {}) {
  const badge = document.querySelector('.badge');
  if (badge) {
    if (published) {
      badge.classList.remove('processing');
      badge.classList.add('published');
      badge.textContent = 'Published';
    } else {
      badge.classList.remove('published');
      badge.classList.add('processing');
      badge.textContent = 'Draft — In progress';
    }
  }

  if (published && date) window.bookJson.datePublished = date;
  else delete window.bookJson.datePublished;

  if (isbn) window.bookJson.isbn = isbn;
  else delete window.bookJson.isbn;

  try {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    let found = false;
    for (const s of scripts) {
      try {
        const obj = JSON.parse(s.textContent || '{}');
        if (obj && (obj['@type'] === 'Book' || (Array.isArray(obj['@type']) && obj['@type'].includes('Book')))) {
          s.textContent = JSON.stringify(window.bookJson, null, 2);
          found = true;
          break;
        }
      } catch (err) {
        // ignore JSON parse errors for unrelated scripts
      }
    }
    if (!found) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(window.bookJson, null, 2);
      (document.head || document.body).appendChild(script);
    }
    console.info('[script.js] book JSON-LD updated', window.bookJson);
  } catch (err) {
    console.warn('[script.js] Could not update JSON-LD:', err);
  }
}

/* Expose updateBookStatus globally */
window.updateBookStatus = updateBookStatus;

/* ---------- Small accessibility: add focus outlines only on keyboard nav ---------- */
onDOM(() => {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('show-focus-outline');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
});
/* Client-side submit (demo): prevents navigation, shows success toast and clears form */
onDOM(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // reuse existing validation if present
    const name = form.querySelector('#fullname');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    // simple validation (you already have inline validators; this is extra safety)
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      // focus first empty
      if (!name.value.trim()) name.focus();
      else if (!email.value.trim()) email.focus();
      else message.focus();
      return;
    }

    // simulate sending delay
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // simulate network send (replace with real fetch if you have endpoint)
    await new Promise(res => setTimeout(res, 900));

    // show a small success message (toast)
    const toast = document.createElement('div');
    toast.textContent = 'Message sent — I will reply soon. Thank you!';
    Object.assign(toast.style, {
      position:'fixed', right:'18px', bottom:'18px', padding:'10px 14px',
      background:'#062026', color:'#dff7ff', borderRadius:'8px', zIndex:9999
    });
    document.body.appendChild(toast);
    setTimeout(()=> toast.remove(), 3000);

    // reset form
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = origText;
  });
});

/* ---------- End of file ---------- */
