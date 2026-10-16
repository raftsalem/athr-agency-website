const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? '✕' : '☰';
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = '☰';
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
form?.addEventListener('submit', e => {
  e.preventDefault();
  // Replace the placeholder below with Athr Agency's real WhatsApp number.
  const whatsappNumber = '20XXXXXXXXXX';
  if (whatsappNumber.includes('X')) {
    toast.textContent = 'قبل النشر: افتح script.js واستبدل 20XXXXXXXXXX برقم واتساب الوكالة بكود مصر 20 بدون + أو مسافات.';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 6500);
    return;
  }
  const data = new FormData(form);
  const message = `أهلًا Athr Agency، اسمي ${data.get('name')}.\nالخدمة المطلوبة: ${data.get('service')}.\nتفاصيل المشروع: ${data.get('message') || 'حابب أعرف تفاصيل أكتر.'}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
