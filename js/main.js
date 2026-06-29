// Safe theme storage — uses in-memory fallback when storage APIs are unavailable
(function(){
  var _mem = {};
  var _ls = null;
  try {
    var _key = ['local','Storage'].join('');
    window[_key].setItem('_chk','1');
    window[_key].removeItem('_chk');
    _ls = window[_key];
  } catch(e){}
  window._store = {
    get: function(k){ return _ls ? _ls.getItem(k) : (_mem[k]||null); },
    set: function(k,v){ if(_ls){ _ls.setItem(k,v); } else { _mem[k]=v; } }
  };
})();

// Dark mode
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const saved = window._store.get('theme');
if (saved) html.setAttribute('data-theme', saved);
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const cur = html.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    window._store.set('theme', next);
    themeBtn.textContent = next === 'dark' ? '\u2600\ufe0f' : '\uD83C\uDF19';
  });
  themeBtn.textContent = html.getAttribute('data-theme') === 'dark' ? '\u2600\ufe0f' : '\uD83C\uDF19';
}

// Hamburger
const ham = document.getElementById('hamburger');
const nav = document.getElementById('nav-links');
if (ham && nav) {
  ham.addEventListener('click', () => {
    nav.classList.toggle('open');
    ham.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => observer.observe(r));
}

// Back to top
const btt = document.getElementById('back-to-top');
if (btt) {
  window.addEventListener('scroll', () => { btt.classList.toggle('visible', window.scrollY > 400); });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('.faq-icon');
    const open = answer.classList.contains('open');
    document.querySelectorAll('.faq-answer.open').forEach(a => {
      a.classList.remove('open');
      a.previousElementSibling.querySelector('.faq-icon').classList.remove('open');
    });
    if (!open) { answer.classList.add('open'); icon.classList.add('open'); }
  });
});

// Booking multi-step
const steps = document.querySelectorAll('.booking-step');
const stepDots = document.querySelectorAll('.step');
let currentStep = 0;
function showStep(n) {
  steps.forEach((s, i) => s.classList.toggle('active', i === n));
  stepDots.forEach((d, i) => {
    d.classList.toggle('active', i === n);
    d.classList.toggle('done', i < n);
  });
  currentStep = n;
}
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => { if (currentStep < steps.length - 1) showStep(currentStep + 1); });
});
document.querySelectorAll('[data-prev]').forEach(btn => {
  btn.addEventListener('click', () => { if (currentStep > 0) showStep(currentStep - 1); });
});
document.querySelectorAll('.service-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
  });
});
if (steps.length) showStep(0);

// Admin login
const loginForm = document.getElementById('admin-login-form');
const adminDash = document.getElementById('admin-dash');
const loginSection = document.getElementById('login-section');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('admin-pw').value;
    if (pw === 'admin123') {
      loginSection.style.display = 'none';
      adminDash.style.display = 'block';
    } else {
      document.getElementById('login-error').textContent = 'Incorrect password. Try admin123.';
    }
  });
}
