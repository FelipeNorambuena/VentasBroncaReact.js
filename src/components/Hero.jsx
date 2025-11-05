import React from 'react'
import slideImg from '../assets/images/5803438.jpg'
import cazaImg from '../assets/images/caza.jpg'
import pescaImg from '../assets/images/pesca.jpg'
import rapalaImg from '../assets/images/RapalaLogo.jpg'
import './hero.css'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <main className="main-content" tabIndex={-1}>
      <section className="hero-section" aria-label="Productos destacados">
        <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Ir a la primera imagen"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Ir a la segunda imagen"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Ir a la tercera imagen"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={cazaImg} className="d-block w-100 carousel-image" alt="Productos para caza" />
              <div className="carousel-caption d-none d-md-block">
                <h1 className="display-4 fw-bold">Equipamiento para Caza</h1>
                <p className="lead">Calidad y resistencia para tus jornadas de caza</p>
                <Link to="/productos" className="btn btn-primary btn-lg">Ver Productos</Link>
              </div>
            </div>

            <div className="carousel-item">
              <img src={pescaImg} className="d-block w-100 carousel-image" alt="Equipamiento para pesca" />
              <div className="carousel-caption d-none d-md-block">
                <h2 className="display-4 fw-bold">Equipamiento para Pesca</h2>
                <p className="lead">Accesorios y herramientas para una pesca eficiente</p>
                <Link to="/productos" className="btn btn-success btn-lg">Explorar</Link>
              </div>
            </div>

            <div className="carousel-item">
              <img src={rapalaImg} className="d-block w-100 carousel-image" alt="Rapala - marca de pesca" />
              <div className="carousel-caption d-none d-md-block">
                <h2 className="display-4 fw-bold">Marcas y Accesorios</h2>
                <p className="lead">Selección de marcas reconocidas y accesorios especializados</p>
                <Link to="/productos" className="btn btn-warning btn-lg">Descubrir</Link>
              </div>
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </section>
    </main>
  )
}

