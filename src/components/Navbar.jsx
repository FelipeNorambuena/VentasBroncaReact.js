import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import './navbar.css'
import logo from '../assets/images/logo.jpg'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { totalItems } = useContext(CartContext)
  const navigate = useNavigate()
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  const isActive = (p) => {
    if (!p) return false
    if (p === '/') return path === '/' || path === ''
    return path === p || path.startsWith(p + '/')
  }

  return (
    <header>
  <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm navbar-custom" role="navigation" aria-label="Navegación principal">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex flex-column align-items-center justify-content-center me-4" to="/" aria-label="VentasBronca - Inicio" style={{ minWidth: 90 }}>
            <img src={logo} alt="Logo VentasBronca" className="logo-img mb-1" style={{ height: 48, width: 'auto' }} />
            <span className="brand-text fw-bold" style={{ fontSize: '1.1rem' }}>VentasBronca</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Abrir menú de navegación">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/productos') ? 'active' : ''}`} to="/productos">Productos</Link>
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
                <Link className={`nav-link ${isActive('/nosotros') ? 'active' : ''}`} to="/nosotros">Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/blogs') ? 'active' : ''}`} to="/blogs">Blogs</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/contacto') ? 'active' : ''}`} to="/contacto">Contacto</Link>
              </li>
              <li className="nav-item d-lg-none">
                <Link className="nav-link" to="/registro">Registrarse</Link>
              </li>
            </ul>

            <form className="d-flex ms-lg-3 me-lg-3 my-2 my-lg-0" role="search" aria-label="Búsqueda de productos">
              <div className="input-group">
                <input className="form-control" type="search" placeholder="Buscar productos..." aria-label="Buscar productos" required />
                <button className="btn btn-outline-success" type="submit" aria-label="Buscar">Buscar</button>
              </div>
            </form>

            <button className="btn btn-outline-primary d-none d-lg-flex align-items-center me-2 nav-cart-btn" data-bs-toggle="modal" data-bs-target="#cartModal" aria-label="Ver carrito de compras">
              Carrito <span id="cart-count-nav" className="badge bg-danger ms-1">{totalItems}</span>
            </button>

            <div className="d-flex align-items-center ms-auto">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 py-1 me-2"
                style={{ fontSize: '0.95rem' }}
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline-success btn-sm px-3 py-1 d-none d-lg-inline"
                style={{ fontSize: '0.95rem' }}
                onClick={() => navigate('/registro')}
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
