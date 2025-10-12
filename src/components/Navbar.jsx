import React from 'react'
import logo from '../assets/images/logo.jpg'

export default function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm" role="navigation" aria-label="Navegación principal">
        <div className="container-fluid">
          <a className="navbar-brand d-flex flex-column align-items-center justify-content-center me-4" href="#" aria-label="VentasBronca - Inicio" style={{ minWidth: 90 }}>
            <img src={logo} alt="Logo VentasBronca" className="logo-img mb-1" style={{ height: 48, width: 'auto' }} />
            <span className="brand-text fw-bold" style={{ fontSize: '1.1rem' }}>VentasBronca</span>
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Abrir menú de navegación">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="/">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/productos">Productos</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Categorías</a>
                <ul className="dropdown-menu shadow">
                  <li><a className="dropdown-item" href="#">Militares</a></li>
                  <li><a className="dropdown-item" href="#">Mochilas y bolsos</a></li>
                  <li><a className="dropdown-item" href="#">Camping</a></li>
                  <li><a className="dropdown-item" href="#">Jockey</a></li>
                  <li><a className="dropdown-item" href="#">Caza y pesca</a></li>
                  <li><a className="dropdown-item" href="#">Iluminación</a></li>
                  <li><a className="dropdown-item" href="#">Lentes</a></li>
                  <li><a className="dropdown-item" href="#">Botas Militares</a></li>
                  <li><a className="dropdown-item" href="#">Accesorios</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Ver más</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/nosotros">Nosotros</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/blogs">Blogs</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contacto">Contacto</a>
              </li>
              <li className="nav-item d-lg-none">
                <a className="nav-link" href="/registro">Registrarse</a>
              </li>
            </ul>

            <form className="d-flex ms-lg-3 me-lg-3 my-2 my-lg-0" role="search" aria-label="Búsqueda de productos">
              <div className="input-group">
                <input className="form-control" type="search" placeholder="Buscar productos..." aria-label="Buscar productos" required />
                <button className="btn btn-outline-success" type="submit" aria-label="Buscar">Buscar</button>
              </div>
            </form>

            <button className="btn btn-outline-primary d-none d-lg-flex align-items-center me-2" data-bs-toggle="modal" data-bs-target="#cartModal" aria-label="Ver carrito de compras">
              Carrito <span id="cart-count-nav" className="badge bg-danger ms-1">0</span>
            </button>

            <div className="d-flex align-items-center ms-auto">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 py-1 me-2"
                style={{ fontSize: '0.95rem' }}
                onClick={(e) => {
                  e.preventDefault()
                  // Navegación SPA simple sin React Router
                  window.history.pushState({}, '', '/login')
                  window.dispatchEvent(new PopStateEvent('popstate'))
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline-success btn-sm px-3 py-1 d-none d-lg-inline"
                style={{ fontSize: '0.95rem' }}
                onClick={(e) => {
                  e.preventDefault()
                  window.history.pushState({}, '', '/registro')
                  window.dispatchEvent(new PopStateEvent('popstate'))
                }}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
