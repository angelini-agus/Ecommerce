# Redstore TP - Cumplimiento de Requerimientos
Este proyecto adapta la template original para cumplir los requisitos mínimos del TP de Programación II.

## Qué se implementó
- **HTML5 semántico** en todas las páginas (`header`, `nav`, `main`, `footer`).
- **CSS Grid/Flexbox** (layout principal con Flexbox). Se añadieron *breakpoints* requeridos:
  - PC > 1200px
  - Laptop 992px
  - Tablet 768px
  - Celular < 480px
- **Favicon** (`images/favicon.png` creado).
- **Optimización**: imágenes con `loading="lazy"` y `picture` (fallback a JPG/PNG).
- **Dark/Light mode** con persistencia en `localStorage` (botón 🌓 en el header).
- **Animaciones**:
  - `@keyframes` en el hero.
  - Aparición de tarjetas con `IntersectionObserver` al hacer scroll.
- **Formulario avanzado** en `account.html`:
  - 9 campos: `text`, `email`, `password`, `confirm password`, `tel`, `date`, `select`, `radio`, `checkbox`.
  - **Validación en tiempo real** con feedback visual.
  - **Simulación de envío** con `fetch` a `jsonplaceholder.typicode.com`.
- **JS modular**: `js/app.js`, `js/form.js`.

## Archivos principales
- `index.html`, `products.html`, `products-details.html`, `cart.html`, `account.html`
- `style.css`
- `js/app.js`, `js/form.js`
- `images/favicon.png`

> Nota: las imágenes `.webp` pueden añadirse como mejora. Actualmente se usa `loading="lazy"` y etiquetas `<picture>` con fallback a los archivos existentes.

