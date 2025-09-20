/* ...existing code... */
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

// Function to update logo src based on theme
const updateLogos = (theme) => {
  const logos = document.querySelectorAll('.logo img, .footer-col-2 img');
  // Detect if we're in pages folder or root
  const isInPages = window.location.pathname.includes('/pages/');
  const pathPrefix = isInPages ? '../' : '';
  const logoSrc = theme === 'dark' ? `${pathPrefix}images/ritmo-sport-claro.png` : `${pathPrefix}images/ritmo-sport.png`;
  logos.forEach(logo => logo.src = logoSrc);
};

// Theme toggle with persistence
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
  updateLogos(savedTheme);
}
if (themeToggle) {
  const current = body.getAttribute('data-theme') || 'light';
  themeToggle.setAttribute('aria-pressed', String(current === 'dark'));
  themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
    updateLogos(next);
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

// Sombra en navbar al hacer scroll
const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
});

// Resalta el enlace activo en el navbar según la URL
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.primary-nav ul li a');
  const current = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    // Quita la clase active de todos
    link.classList.remove('active');
    // Si el href coincide con la página actual, agrega active
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
});
