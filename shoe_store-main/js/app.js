
// Menu toggle
const menuToggleBtn = document.getElementById('menuToggle');
const menuList = document.getElementById('MenuItems');
if (menuToggleBtn && menuList) {
  const setExpanded = (exp) => {
    menuToggleBtn.setAttribute('aria-expanded', String(exp));
    menuList.style.maxHeight = exp ? '240px' : '0px';
  };
  setExpanded(false);
  menuToggleBtn.addEventListener('click', () => {
    const exp = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    setExpanded(!exp);
  });
}

// Theme toggle with persistence
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) body.setAttribute('data-theme', savedTheme);
if (themeToggle) {
  const current = body.getAttribute('data-theme') || 'light';
  themeToggle.setAttribute('aria-pressed', String(current === 'dark'));
  themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
  });
}

// IntersectionObserver for product cards
const productCards = document.querySelectorAll('.col-4');
if ('IntersectionObserver' in window && productCards.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    })
  }, { rootMargin: '0px 0px -10% 0px' });
  productCards.forEach(card => io.observe(card));
} else {
  // Fallback: make them visible
  productCards.forEach(c => c.classList.add('visible'));
}
