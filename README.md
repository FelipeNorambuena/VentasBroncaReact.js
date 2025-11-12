# 🛒 VentasBronca - E-commerce React

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-purple.svg)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-blueviolet.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Plataforma de e-commerce moderna y completa para la venta de productos tácticos, militares, camping y outdoor. Desarrollada con React 19 y Vite, integrada con backend Xano.

---

## 📑 Tabla de Contenidos

- [🚀 Características](#-características)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [📂 Estructura de Archivos](#-estructura-de-archivos)
- [🔧 Configuración e Instalación](#-configuración-e-instalación)
- [🌐 API y Backend](#-api-y-backend)
- [📱 Componentes Principales](#-componentes-principales)
- [🔐 Sistema de Autenticación](#-sistema-de-autenticación)
- [🛍️ Sistema de Carrito](#️-sistema-de-carrito)
- [🔍 Sistema de Búsqueda](#-sistema-de-búsqueda)
- [📸 Gestión de Imágenes](#-gestión-de-imágenes)
- [🎨 Estilos y Diseño](#-estilos-y-diseño)
- [🚢 Despliegue](#-despliegue)
- [🤝 Contribución](#-contribución)

---

## 🚀 Características

### 👥 Para Clientes
- ✅ **Catálogo de productos** con imágenes múltiples y carrusel
- ✅ **Búsqueda inteligente** por nombre, descripción y categoría
- ✅ **Carrito de compras** persistente con contador flotante
- ✅ **Finalización de compra** vía WhatsApp con detalle completo
- ✅ **Galería de imágenes** con lightbox y navegación
- ✅ **Diseño responsive** optimizado para móviles y tablets
- ✅ **Navegación rápida** con React Router

### 👨‍💼 Para Administradores
- ✅ **Panel de administración** completo
- ✅ **Gestión de productos** (CRUD con imágenes múltiples)
- ✅ **Gestión de usuarios** y permisos
- ✅ **Dashboard** con estadísticas
- ✅ **Sistema de roles** (admin/cliente)
- ✅ **Carga masiva de imágenes** con preview
- ✅ **Edición en tiempo real** de inventario

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Components │  │   Context    │  │   Services   │   │
│  │   (Views)   │──│   (State)    │──│  (API Calls) │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
│         │                 │                   │          │
└─────────┼─────────────────┼───────────────────┼─────────┘
          │                 │                   │
          └─────────────────┴───────────────────┘
                            │
                            ↓
          ┌──────────────────────────────────┐
          │       XANO BACKEND (API)         │
          │  • Authentication (JWT)          │
          │  • Products Database             │
          │  • Images Storage (Vault)        │
          │  • User Management               │
          └──────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario** → Interacción en componentes React
2. **Componentes** → Consultan/actualizan Context (estado global)
3. **Context** → Llama a Services para operaciones API
4. **Services** → Realizan peticiones HTTP a Xano
5. **Xano** → Procesa y devuelve datos/imágenes
6. **Services** → Devuelven respuesta al Context
7. **Context** → Actualiza estado y re-renderiza componentes

---

## 📂 Estructura de Archivos

### 📁 `/src` - Código Fuente Principal

```
src/
├── 📄 main.jsx                    # Punto de entrada de la aplicación
├── 📄 App.jsx                     # Componente raíz con enrutamiento
├── 📄 App.css                     # Estilos globales de la app
├── 📄 index.css                   # Estilos base y variables CSS
│
├── 📁 admin/                      # Panel de Administración
│   ├── 📄 AdminLayout.jsx         # Layout base del panel admin (sidebar + contenido)
│   ├── 📄 AdminDashboard.jsx      # Dashboard con estadísticas y gráficos
│   ├── 📄 AdminProductos.jsx      # Gestión de productos (tabla, CRUD)
│   ├── 📄 AdminUsuarios.jsx       # Gestión de usuarios y roles
│   ├── 📄 AdminCrearUsuario.jsx   # Formulario creación de usuarios
│   ├── 📄 AdminPerfil.jsx         # Perfil del administrador
│   ├── 📄 AdminConfiguracion.jsx  # Configuraciones del sistema
│   ├── 📄 AdminVentasDia.jsx      # Reporte de ventas del día
│   ├── 📄 AdminVentasVendedor.jsx # Reporte por vendedor
│   ├── 📄 AdminInventario.jsx     # Control de inventario
│   ├── 📄 ProductModal.jsx        # Modal para crear/editar productos
│   ├── 📄 ProductPreviewModal.jsx # Vista previa de productos
│   └── 📄 admin.css               # Estilos del panel admin
│
├── 📁 components/                 # Componentes Reutilizables
│   ├── 📄 Navbar.jsx              # Barra navegación (logo, menú, búsqueda, carrito)
│   ├── 📄 navbar.css              # Estilos de la navbar
│   ├── 📄 Hero.jsx                # Carrusel principal de la página de inicio
│   ├── 📄 hero.css                # Estilos del hero
│   ├── 📄 Footer.jsx              # Pie de página (enlaces, redes sociales)
│   ├── 📄 ProductsSection.jsx     # Sección del catálogo de productos
│   ├── 📄 products-section.css    # Estilos de la sección de productos
│   ├── 📄 ProductCard.jsx         # Tarjeta individual de producto
│   ├── 📄 Lightbox.jsx            # Modal lightbox con carrusel de imágenes
│   ├── 📄 FloatingCart.jsx        # Botón flotante del carrito (badge contador)
│   ├── 📄 CartModal.jsx           # Modal del carrito de compras
│   ├── 📄 Login.jsx               # Formulario de inicio de sesión
│   ├── 📄 Register.jsx            # Formulario de registro
│   ├── 📄 About.jsx               # Página "Nosotros"
│   ├── 📄 Contact.jsx             # Página de contacto
│   ├── 📄 BlogList.jsx            # Listado de artículos del blog
│   ├── 📄 BlogPost.jsx            # Artículo individual del blog
│   ├── 📄 AdminInstructions.jsx   # Instrucciones para administradores
│   ├── 📄 Notification.jsx        # Sistema de notificaciones toast
│   ├── 📄 Toast.jsx               # Componente toast reutilizable
│   └── 📄 ConfirmModal.jsx        # Modal de confirmación (sí/no)
│
├── 📁 context/                    # Estado Global (Context API)
│   ├── 📄 AuthContext.jsx         # Estado autenticación (user, token, login, logout)
│   └── 📄 CartContext.jsx         # Estado carrito (items, total, add, remove, clear)
│
├── 📁 pages/                      # Páginas Completas
│   └── 📄 Productos.jsx           # Página del catálogo de productos
│
├── 📁 services/                   # Capa de Servicios (API)
│   ├── 📄 http.js                 # Cliente HTTP base con interceptores
│   ├── 📄 auth.js                 # Servicios de autenticación (login, register, me)
│   ├── 📄 products.js             # Servicios de productos (CRUD, upload imágenes)
│   └── 📄 productImage.js         # Servicios de imágenes relacionadas
│
├── 📁 utils/                      # Utilidades y Helpers
│   ├── 📄 authToken.js            # Manejo de tokens JWT (get, set, remove)
│   └── 📄 imageHelper.js          # Normalización de URLs de imágenes Xano
│
└── 📁 assets/                     # Recursos Estáticos
    ├── 📁 images/                 # Imágenes locales
    │   ├── logo.jpg               # Logo de VentasBronca
    │   ├── 5803438.jpg            # Imagen hero
    │   └── productos/             # Imágenes de productos
    │       ├── tactico/
    │       ├── camping/
    │       ├── militar/
    │       └── otros/
    └── 📁 icons/                  # Iconos SVG
```

### 📁 Archivos de Configuración Raíz

```
VentasBroncaReact.js/
├── 📄 package.json              # Dependencias y scripts NPM
├── 📄 vite.config.js            # Configuración de Vite
├── 📄 eslint.config.js          # Configuración de ESLint
├── 📄 index.html                # HTML base de la SPA
├── 📄 .env.local                # Variables de entorno (API URL, etc.)
├── 📄 .gitignore                # Archivos ignorados por Git
└── 📄 README.md                 # Este archivo
```

---

## 🔧 Configuración e Instalación

### Prerrequisitos

- **Node.js** v18.0.0 o superior
- **npm** v9.0.0 o superior
- Cuenta en **Xano** con API configurada

### Instalación Paso a Paso

1. **Clonar el repositorio:**

```powershell
git clone https://github.com/FelipeNorambuena/VentasBroncaReact.js.git
cd VentasBroncaReact.js
```

2. **Instalar dependencias:**

```powershell
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL base de la API de Xano
VITE_API_BASE_URL=https://x8ki-letl-twmt.n7.xano.io/api:trIO7Z5n

# URL de autenticación de Xano (si es diferente)
VITE_AUTH_API_URL=https://x8ki-letl-twmt.n7.xano.io/api:baot63BL
```

4. **Iniciar el servidor de desarrollo:**

```powershell
npm run dev
```

5. **Abrir en el navegador:**

Por defecto: [http://localhost:5173](http://localhost:5173)

### Scripts Disponibles

```powershell
npm run dev          # Inicia servidor de desarrollo con HMR
npm run build        # Compila para producción en /dist
npm run preview      # Vista previa del build de producción
npm run lint         # Ejecuta ESLint para verificar código
```

------

## 🌐 API y Backend

### Arquitectura Xano

El proyecto utiliza **Xano** como backend con dos APIs principales:

#### API de Productos (`trIO7Z5n`)


| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/product` | GET | Listar productos (con paginación) | No |
| `/product` | POST | Crear nuevo producto | Sí (Admin) |
| `/product/{id}` | GET | Obtener producto por ID | No |
| `/product/{id}` | PATCH | Actualizar producto | Sí (Admin) |
| `/product/{id}` | DELETE | Eliminar producto | Sí (Admin) |
| `/upload/image` | POST | Subir imagen a Xano Vault | Sí |
| `/imagen_producto` | POST | Crear relación imagen-producto | Sí |
| `/imagen_producto/{id}` | DELETE | Eliminar imagen | Sí (Admin) |

#### API de Autenticación (`baot63BL`)


| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/auth/register` | POST | Registrar nuevo usuario | No |
| `/auth/login` | POST | Iniciar sesión | No |
| `/auth/me` | GET | Obtener perfil del usuario | Sí (JWT) |

### Estructura de Datos

#### Producto (Product)
```javascript
{
  id: 42,
  name: "Guantes Impermeables",
  slug: "guantes-impermeables",
  description: "Guantes militares de alta resistencia",
  brand: "Militar",
  price: 29990,
  compare_at_price: 35990,
  currency: "CLP",
  is_active: true,
  tags: ["militar", "guantes", "impermeables"],
  attributes: "",
  category_id: 1,
  image: [                              // Array de imágenes (Xano File field)
    {
      access: "public",
      path: "/vault/usJA1K8V/.../imagen.jpg",
      name: "imagen.jpg",
      type: "image",
      size: 83084,
      mime: "image/jpeg",
      meta: { width: 1214, height: 1600 },
      url: "https://x8ki-letl-twmt.n7.xano.io/vault/.../imagen.jpg"
    }
  ],
  created_at: 1760641955091,
  updated_at: 1760641957848
}
```



### Autenticación JWT

El sistema usa **JSON Web Tokens (JWT)** para autenticación:

1. **Login:** Usuario envía credenciales → Xano devuelve token
2. **Almacenamiento:** Token se guarda en `localStorage` como `ventasbronca_token`
3. **Uso:** Token se incluye en header `Authorization: Bearer <token>` en cada petición
4. **Validación:** Xano valida el token en endpoints protegidos
5. **Expiración:** Token tiene validez de 7 días (configurable en Xano)

---

## 📱 Componentes Principales

### 🏠 Componentes Públicos

#### `Navbar.jsx`
**Ubicación:** `src/components/Navbar.jsx`  
**Propósito:** Barra de navegación principal

**Funcionalidades:**
- Logo y nombre de la marca
- Menú de navegación con rutas
- Barra de búsqueda con autocompletado
- Icono de carrito con contador de items
- Dropdown de usuario (si está autenticado)
- Botones de Login/Registro

**Props:** Ninguna (usa contexts)

**State:**
- `searchTerm`: Término de búsqueda actual
- `dropdownOpen`: Estado del menú de usuario

**Comunicación:**
- Lee `totalItems` de `CartContext`
- Lee `user`, `isAuthenticated` de `AuthContext`
- Navega con `useNavigate()` de React Router

---

#### `Hero.jsx`
**Ubicación:** `src/components/Hero.jsx`  
**Propósito:** Carrusel principal de la página de inicio

**Funcionalidades:**
- Carrusel con 3 slides (Bootstrap)
- Imágenes de fondo con overlay
- Títulos y descripciones por slide
- Botones de acción que redirigen a `/productos`
- Indicadores y controles de navegación

**Props:** Ninguna

**Comunicación:**
- Usa `Link` de React Router para navegación

---

#### `ProductsSection.jsx`
**Ubicación:** `src/components/ProductsSection.jsx`  
**Propósito:** Sección del catálogo de productos

**Funcionalidades:**
- Carga productos desde API Xano
- Sistema de búsqueda en tiempo real
- Grid responsive de productos
- Indicador de carga
- Mensaje de "sin resultados"
- Manejo de imágenes múltiples

**State:**
- `products`: Array de todos los productos
- `filteredProducts`: Productos filtrados por búsqueda
- `loading`: Estado de carga
- `lightboxProduct`: Producto seleccionado para modal

**Comunicación:**
- Llama a `productsService.list()` para obtener productos
- Lee parámetro `?search=` de URL con `useSearchParams()`
- Pasa productos a `ProductCard` como props
- Abre `Lightbox` al hacer clic en producto

**Flujo de Datos:**
```
API → ProductsSection → ProductCard → Lightbox
                      ↓
                CartContext (agregar al carrito)
```

---

#### `ProductCard.jsx`
**Ubicación:** `src/components/ProductCard.jsx`  
**Propósito:** Tarjeta individual de producto

**Funcionalidades:**
- Muestra imagen principal del producto
- Badge indicador de múltiples imágenes (📷 2)
- Nombre, precio, categoría
- Descripción truncada (2 líneas)
- Botones: "Ver detalles" y "Agregar"

**Props:**
```javascript
{
  product: {
    id, name, price, currency, image, 
    description, category, totalImages
  },
  onAdd: Function,      // Callback para agregar al carrito
  onOpen: Function      // Callback para abrir lightbox
}
```

**Eventos:**
- `onClick` en imagen → Abre lightbox
- `onClick` en "Ver detalles" → Abre lightbox
- `onClick` en "Agregar" → Añade al carrito

---

#### `Lightbox.jsx`
**Ubicación:** `src/components/Lightbox.jsx`  
**Propósito:** Modal para ver detalles y galería de imágenes

**Funcionalidades:**
- **Carrusel de imágenes** con navegación (← →)
- **Miniaturas** clickeables en la parte inferior
- **Indicador** de posición (1/3, 2/3, etc.)
- Información del producto (nombre, precio, descripción)
- Botón "Agregar al Carrito"
- Soporte para productos con múltiples imágenes

**Props:**
```javascript
{
  product: Object | null,  // Producto a mostrar
  onClose: Function        // Callback para cerrar
}
```

**State:**
- `currentImageIndex`: Índice de imagen actual
- `productImages`: Array de todas las imágenes del producto

**Lógica de Imágenes:**
1. Extrae `product._fullProduct` (objeto completo de Xano)
2. Si `image` es array → Múltiples imágenes
3. Si `image` es objeto → Una imagen
4. Fallback a imágenes relacionadas `_imagen_producto_of_product`

---

#### `FloatingCart.jsx`
**Ubicación:** `src/components/FloatingCart.jsx`  
**Propósito:** Botón flotante del carrito

**Funcionalidades:**
- Botón fijo en esquina inferior derecha
- Badge con contador de items
- Abre `CartModal` al hacer clic
- Animación de "pulse" cuando se agrega item

**Props:** Ninguna (usa `CartContext`)

**Comunicación:**
- Lee `totalItems` de `CartContext`
- Abre modal usando atributo `data-bs-toggle="modal"`

---

#### `CartModal.jsx`
**Ubicación:** `src/components/CartModal.jsx`  
**Propósito:** Modal del carrito de compras

**Funcionalidades:**
- Lista de productos en el carrito
- Cantidad y subtotal por producto
- Total de productos y precio total
- Botón "Vaciar Carrito"
- Botón "Finalizar Compra" (WhatsApp)

**Props:** Ninguna (usa `CartContext`)

**State:** Ninguno (todo viene de context)

**Comunicación:**
- Lee `items`, `totalItems`, `totalPrice` de `CartContext`
- Llama a `removeItem()`, `clearCart()` del context
- Función `sendWhatsAppOrder()` genera mensaje y abre WhatsApp

**Flujo de Finalización:**
```
1. Usuario hace clic en "Finalizar Compra"
2. Se genera mensaje con todos los items
3. Se codifica para URL
4. Se abre WhatsApp con mensaje pre-escrito
5. Usuario envía pedido al número: +56 974161396
```

---

### 🔐 Componentes de Autenticación

#### `Login.jsx`
**Ubicación:** `src/components/Login.jsx`  
**Propósito:** Formulario de inicio de sesión

**Funcionalidades:**
- Formulario email + password
- Validación de campos
- Mensajes de error
- Enlace a registro
- Redirección post-login

**Comunicación:**
- Llama a `authService.login()` con credenciales
- Actualiza `AuthContext` con el usuario
- Redirige según rol (admin → `/admin`, cliente → `/`)

---

#### `Register.jsx`
**Ubicación:** `src/components/Register.jsx`  
**Propósito:** Formulario de registro

**Funcionalidades:**
- Campos: nombre, email, password, confirmación
- Validaciones en cliente
- Mensajes de error/éxito
- Redirección automática a login

**Comunicación:**
- Llama a `authService.register()` con datos
- Redirige a `/login` tras registro exitoso

---

### 👨‍💼 Componentes de Administración

#### `AdminLayout.jsx`
**Ubicación:** `src/admin/AdminLayout.jsx`  
**Propósito:** Layout base del panel de administración

**Estructura:**
```
┌────────────────────────────────────────┐
│           Header Admin                 │
├──────────┬─────────────────────────────┤
│          │                             │
│ Sidebar  │     Contenido (Outlet)      │
│  Menú    │                             │
│          │                             │
└──────────┴─────────────────────────────┘
```

**Funcionalidades:**
- Sidebar con navegación admin
- Protección de rutas (solo admin)
- Header con logo y logout
- Outlet para renderizar sub-rutas

---

#### `AdminProductos.jsx`
**Ubicación:** `src/admin/AdminProductos.jsx`  
**Propósito:** Gestión CRUD de productos

**Funcionalidades:**
- Tabla de productos con búsqueda
- Botón "Crear Producto"
- Acciones: Editar, Vista Previa, Eliminar
- Modal `ProductModal` para crear/editar
- Modal `ProductPreviewModal` para vista previa
- Paginación (si hay muchos productos)

**State:**
- `products`: Lista de productos
- `modalOpen`: Estado del modal de edición
- `previewProduct`: Producto en vista previa

**Comunicación:**
- Llama a `productsService` para CRUD
- Maneja carga de imágenes múltiples

---

#### `ProductModal.jsx`
**Ubicación:** `src/admin/ProductModal.jsx`  
**Propósito:** Modal para crear/editar productos

**Funcionalidades:**
- Formulario completo de producto
- Campos: nombre, slug, precio, descripción, marca, etc.
- **Carga múltiple de imágenes** con preview
- Marcar imagen principal
- Eliminar imágenes
- Validaciones

**Flujo de Creación con Múltiples Imágenes:**
```
1. Usuario completa formulario
2. Selecciona 3 imágenes
3. Click en "Crear Producto"
   ├─ Se crea producto con primera imagen
   ├─ Se suben imágenes restantes a /upload/image
   ├─ Se actualiza campo 'image' con array completo
   └─ Se retorna producto con todas las imágenes
```

**Props:**
```javascript
{
  show: Boolean,
  product: Object | null,  // null para crear, objeto para editar
  onClose: Function,
  onSave: Function(productData, imageFile)
}
```

**State:**
- `form`: Datos del formulario
- `imagenes`: Array de imágenes nuevas con preview
- `imagenesExistentes`: Imágenes ya guardadas (en edición)

---

## 🔐 Sistema de Autenticación

### AuthContext (`src/context/AuthContext.jsx`)

**Propósito:** Gestionar estado global de autenticación

**Estado:**
```javascript
{
  user: {                    // Usuario autenticado
    id: 1,
    name: "Felipe",
    email: "felipe@...",
    role: "admin"
  } | null,
  isAuthenticated: Boolean,  // true si hay usuario
  loading: Boolean,          // true mientras verifica token
  isAdmin: Boolean          // true si user.role === "admin"
}
```

**Métodos:**
- `login(email, password)` → Autentica y guarda token
- `logout()` → Limpia token y usuario
- `register(data)` → Registra nuevo usuario

**Uso en Componentes:**
```javascript
import { useAuth } from '../context/AuthContext'

function MiComponente() {
  const { user, isAuthenticated, login, logout, isAdmin } = useAuth()
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />
  }
  
  return <div>Hola {user.name}</div>
}
```

---

## 🛍️ Sistema de Carrito

### CartContext (`src/context/CartContext.jsx`)

**Propósito:** Gestionar carrito de compras

**Estado:**
```javascript
{
  items: [                   // Productos en el carrito
    {
      id: 42,
      name: "Guantes",
      price: 29990,
      quantity: 2,
      image: "url..."
    }
  ],
  totalItems: 5,             // Suma de cantidades
  totalPrice: 149950         // Suma de (precio × cantidad)
}
```

**Métodos:**
- `addItem(product)` → Añade o incrementa cantidad
- `removeItem(productId)` → Elimina producto del carrito
- `clearCart()` → Vacía el carrito completo
- `showNotification(message, type)` → Muestra toast
- `showConfirm(options)` → Muestra modal de confirmación

**Uso en Componentes:**
```javascript
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

function ProductCard({ product }) {
  const { addItem, showNotification } = useContext(CartContext)
  
  const handleAdd = () => {
    addItem(product)
    showNotification('Producto agregado', 'success')
  }
  
  return <button onClick={handleAdd}>Agregar</button>
}
```

---

## 🔍 Sistema de Búsqueda

### Arquitectura

El sistema de búsqueda funciona en **dos capas**:

#### 1. Búsqueda Local (Actual)
- **Dónde:** `ProductsSection.jsx`
- **Cómo:** Filtrado en memoria del navegador
- **Velocidad:** Instantánea (< 10ms)
- **Alcance:** Productos ya cargados (máx 50)

**Flujo:**
```
Usuario escribe → Navbar captura input → Redirige a /productos?search=término
  ↓
ProductsSection lee parámetro search
  ↓
Filtra products.filter() por nombre/descripción/categoría
  ↓
Muestra filteredProducts
```

**Implementación:**
```javascript
// En ProductsSection.jsx
useEffect(() => {
  if (!searchTerm) {
    setFilteredProducts(products)
  } else {
    const term = searchTerm.toLowerCase()
    const filtered = products.filter(product => {
      return product.name.toLowerCase().includes(term) ||
             product.description.toLowerCase().includes(term) ||
             product.category.toLowerCase().includes(term)
    })
    setFilteredProducts(filtered)
  }
}, [searchTerm, products])
```

#### 2. Búsqueda en Backend (Futura)
Para catálogos grandes (> 500 productos):
- Crear endpoint `/product/search?q=término` en Xano
- Buscar en toda la base de datos
- Retornar solo resultados relevantes

---

## 📸 Gestión de Imágenes

### Flujo Completo de Imágenes

#### Subida de Imagen
```
1. Admin selecciona archivos en ProductModal
   ├─ Se crea preview local (URL.createObjectURL)
   └─ Se guarda en estado como File

2. Click en "Crear Producto"
   ├─ Primera imagen: Se envía con producto
   │  POST /product { ...datos }
   │  POST /upload/image { content: File }
   │  PATCH /product/{id} { image: [objetoImagen] }
   │
   └─ Imágenes adicionales: Se suben después
      POST /upload/image { content: File } → objeto1
      POST /upload/image { content: File } → objeto2
      PATCH /product/{id} { image: [img1, img2, img3] }

3. Xano guarda en Vault y retorna:
   {
     access: "public",
     path: "/vault/.../imagen.jpg",
     url: "https://x8ki-letl-twmt.n7.xano.io/...",
     ...metadata
   }
```

#### Normalización de URLs (`imageHelper.js`)
```javascript
// Xano puede retornar imágenes en varios formatos:
// 1. Objeto completo: { url: "...", path: "...", ...}
// 2. Solo path: "/vault/..."
// 3. URL completa: "https://..."

export function getImageUrl(imageObject) {
  if (!imageObject) return null
  
  // Prioridad 1: URL completa
  if (imageObject.url && imageObject.url.startsWith('http')) {
    return imageObject.url
  }
  
  // Prioridad 2: Path relativo
  if (imageObject.path) {
    return `${API_URL}${imageObject.path}`
  }
  
  return null
}
```

---

## 🎨 Estilos y Diseño

### Stack de Estilos

- **Bootstrap 5.3.8:** Framework CSS principal
- **Custom CSS:** Archivos `.css` por componente
- **Responsive Design:** Mobile-first con breakpoints

### Breakpoints
```css
/* Mobile: < 576px */
/* Tablet: 576px - 768px */
/* Desktop: 768px - 992px */
/* Large: 992px - 1200px */
/* XL: > 1200px */
```

### Paleta de Colores
```css
--primary: #0d6efd (Azul Bootstrap)
--success: #198754 (Verde)
--danger: #dc3545 (Rojo)
--warning: #ffc107 (Amarillo)
--info: #0dcaf0 (Celeste)
```

---

## 🚢 Despliegue

### Build para Producción

```powershell
npm run build
```

Genera carpeta `/dist` con:
- HTML, CSS, JS minificados
- Assets optimizados
- Source maps

### Opciones de Hosting

#### Vercel (Recomendado)
```powershell
npm install -g vercel
vercel
```

#### Netlify
```powershell
npm install -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages
```powershell
npm run build
# Subir carpeta /dist a rama gh-pages
```

---

## 🤝 Contribución

### Ramas del Proyecto

- `main` → Producción estable
- `felipe-norambuena` → Desarrollo principal
- `juan-pablo` → Rama de colaborador

### Flujo de Trabajo

1. Crear rama desde `felipe-norambuena`:
```powershell
git checkout felipe-norambuena
git pull origin felipe-norambuena
git checkout -b feature/nombre-feature
```

2. Realizar cambios y commit:
```powershell
git add .
git commit -m "✨ feat: Descripción del cambio"
```

3. Push y crear Pull Request:
```powershell
git push origin feature/nombre-feature
```

4. Code Review → Merge a `felipe-norambuena`

### Convenciones de Commits

- `✨ feat:` Nueva funcionalidad
- `🐛 fix:` Corrección de bug
- `📝 docs:` Cambios en documentación
- `💄 style:` Cambios de estilos/formato
- `♻️ refactor:` Refactorización de código
- `✅ test:` Añadir/modificar tests
- `🔧 chore:` Tareas de mantenimiento

---

## 📞 Contacto y Soporte

**Desarrollador Principal:** Felipe Norambuena  
**Email:** felipe@ventasbronca.com  
**WhatsApp Pedidos:** +56 974161396

**Repositorio:** [github.com/FelipeNorambuena/VentasBroncaReact.js](https://github.com/FelipeNorambuena/VentasBroncaReact.js)

---

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados © 2025 VentasBronca.

---

_Documentación generada: Octubre 2025_  
_Última actualización: 16 de Octubre de 2025_  
_Versión: 2.0.0_
