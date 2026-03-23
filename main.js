// Pricing toggle
const prices = {
  monthly: { free: '$0', plus: '$19', pro: '$49' },
  annual:  { free: '$0', plus: '$15', pro: '$39' },
};

function setToggle(mode) {
  document.getElementById('btn-monthly').classList.toggle('active', mode === 'monthly');
  document.getElementById('btn-annual').classList.toggle('active', mode === 'annual');
  const p = prices[mode];
  document.getElementById('price-free').textContent = p.free;
  document.getElementById('price-plus').textContent = p.plus;
  document.getElementById('price-pro').textContent = p.pro;
}

// FAQ accordion
function toggleFaq(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

// Animate progress bar on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width || '68%';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.progress-fill').forEach(el => {
  const target = el.style.width;
  el.dataset.width = target;
  el.style.width = '0%';
  el.style.transition = 'width 1.2s ease';
  observer.observe(el);
});
