import React from 'react'
import logo from '../assets/images/logo.jpg'
import devIcon from '../assets/icons/icons8-old-computer-96.png'
import webIcon from '../assets/icons/icons8-web-100.png'
import personIcon from '../assets/icons/icons8-person-100.png'
import Footer from './Footer'

export default function About() {
  return (
    <>
    <main className="container py-5 mt-5">
      <section className="mb-5 about-section">
        <h1 className="display-5 fw-bold text-center mb-4">Sobre VentasBronca</h1>
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Equipo VentasBronca" className="img-fluid rounded shadow" style={{ maxHeight: 320, objectFit: 'cover' }} />
          </div>
          <div className="col-md-6">
            <p className="lead">VentasBronca es una tienda especializada en productos tácticos, militares y de outdoor, comprometida con la calidad, la innovación y la satisfacción de nuestros clientes. Nos dedicamos a ofrecer equipamiento confiable para profesionales, aventureros y entusiastas de la vida al aire libre.</p>
            <ul>
              <li>Productos de alta resistencia y durabilidad.</li>
              <li>Atención personalizada y asesoría experta.</li>
              <li>Envíos a todo Chile y soporte postventa.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2 className="h4 fw-bold text-center mb-4">Nuestro equipo</h2>
        <div className="row justify-content-center">
          <div className="col-md-4 text-center mb-4">
            <img src={devIcon} alt="Felipe Norambuena - Desarrollador" className="rounded-circle shadow mb-2" style={{ width: 120, height: 120, objectFit: 'cover', background: '#fff' }} />
            <h5 className="mb-0">Felipe Norambuena</h5>
            <small className="text-muted">Desarrollador web</small>
            <p className="mt-2 small">Desarrollador fullstack con experiencia en diversas tecnologías y un enfoque en la creación de soluciones eficientes y escalables.</p>
          </div>
          <div className="col-md-4 text-center mb-4">
            <img src={webIcon} alt="Juan Pablo Gonzalez - Frontend" className="rounded-circle shadow mb-2" style={{ width: 120, height: 120, objectFit: 'cover', background: '#fff' }} />
            <h5 className="mb-0">Juan Pablo Gonzalez</h5>
            <small className="text-muted">Desarrollador web</small>
            <p className="mt-2 small">Especialista en desarrollo front-end y diseño de interfaces, enfocado en crear experiencias de usuario atractivas y funcionales.</p>
          </div>
          <div className="col-md-4 text-center mb-4">
            <img src={personIcon} alt="Constanza - Emprendedora" className="rounded-circle shadow mb-2" style={{ width: 120, height: 120, objectFit: 'cover', background: '#fff' }} />
            <h5 className="mb-0">Constanza</h5>
            <small className="text-muted">Emprendedora</small>
            <p className="mt-2 small">Emprendedora encargada de administración y gestión de tienda VentasBronca.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  )
}
