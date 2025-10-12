# VentasBroncaReact.js

Repositorio de la aplicación web VentasBronca (React + Vite).

Resumen de lo implementado
- Estructura base con Vite y React.
- Integración de Bootstrap (CSS y bundle JS) para estilos y componentes interactivos.
- Componentes principales creados:
	- `Navbar`, `Hero` (carrusel), `Footer`.
	- Sección de productos: `ProductsSection`, `ProductCard`, `Lightbox`.
	- Carrito funcional básico: `CartContext`, `FloatingCart`, `CartModal`.
	- Páginas: `About` (`/nosotros`) y `Contact` (`/contacto`).
	- Blog simple: `BlogList` (`/blogs`) y `BlogPost` (`/blogs/:slug`).

Ramas en el repositorio
- `main` (rama principal)
- `felipe-norambuena` (rama de trabajo actual)
- `juan-pablo` (rama creada vacía para colaborador)

Cómo ejecutar localmente

1. Clonar el repositorio (si aún no lo hiciste):

```powershell
git clone https://github.com/FelipeNorambuena/VentasBroncaReact.js.git
cd VentasBroncaReact.js
```

2. Instalar dependencias e iniciar el servidor de desarrollo:

```powershell
npm install
npm run dev
```

3. Abrir en el navegador la URL que muestre Vite (por defecto http://localhost:5173).

Rutas disponibles (sin React Router):
- `/` — Home (Navbar, Hero, Productos, Footer)
- `/nosotros` — Página "Nosotros"
- `/contacto` — Página "Contacto"
- `/blogs` — Listado de posts
- `/blogs/:slug` — Artículo individual (ej.: `/blogs/paracord-espacio`)

Notas técnicas
- El proyecto usa un enrutado simple basado en `window.location.pathname` (sin React Router) para páginas estáticas.
- El carrito usa `CartContext` para estado in-memory (no persistente). Puedes mejorar la persistencia con `localStorage`.

Cómo contribuir (crear PR)



Próximos pasos sugeridos
- Migrar a React Router para navegación SPA (si prefieres enlaces internos sin recarga completa).
- Conectar el formulario de contacto a un backend o servicio de correo.
- Habilitar persistencia del carrito y mejorar la UX del modal.



---
_Este README fue generado y actualizado automáticamente con el estado actual del proyecto._
