// include-header-footer.js
// Inserta header y footer reutilizables desde /public o /src para páginas estáticas en `public/`.

(function () {
  'use strict';

  async function fetchFragment(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) return null;
      return await res.text();
    } catch (err) {
      console.warn('No se pudo cargar fragmento:', path, err);
      return null;
    }
  }

  // Intenta reemplazar placeholders por el contenido de header/footer si existen
  async function includeHeaderFooter() {
    // header-placeholder
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      // Primero intenta cargar un fragmento en public/header.html (ruta relativa)
      const headerHtml = await fetchFragment('/public/header.html') || await fetchFragment('/header.html') || await fetchFragment('/src/html/header.html');
      if (headerHtml) {
        headerPlaceholder.innerHTML = headerHtml;
      }
    }

    // footer-placeholder (opcional)
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      const footerHtml = await fetchFragment('/public/footer.html') || await fetchFragment('/footer.html') || await fetchFragment('/src/html/footer.html');
      if (footerHtml) {
        footerPlaceholder.innerHTML = footerHtml;
      }
    }
  }

  // Ejecuta al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', includeHeaderFooter);
  } else {
    includeHeaderFooter();
  }
})();