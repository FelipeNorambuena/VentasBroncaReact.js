import React from 'react'
import logo from '../assets/images/logo.jpg'
import instagramIcon from '../assets/icons/instagram.svg'
import whatsappIcon from '../assets/icons/whatsapp.svg'

export default function Footer() {
  return (
    <footer className="footer bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <img src={logo} alt="Logo VentasBronca" className="footer-logo me-2" style={{ height: 32, width: 'auto' }} />
              VentasBronca
            </h5>
            <p className="text-light">Especialistas en productos tácticos, militares y equipamiento para actividades al aire libre. Calidad y resistencia garantizada.</p>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Enlaces</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Inicio</a></li>
              <li><a href="/productos" className="text-light text-decoration-none">Productos</a></li>
              <li><a href="/categorias" className="text-light text-decoration-none">Categorías</a></li>
              <li><a href="/contacto" className="text-light text-decoration-none">Contacto</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Categorías</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Militares</a></li>
              <li><a href="#" className="text-light text-decoration-none">Camping</a></li>
              <li><a href="#" className="text-light text-decoration-none">Tácticos</a></li>
              <li><a href="#" className="text-light text-decoration-none">Accesorios</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4" id="contacto">
            <h6 className="fw-bold mb-3">Síguenos</h6>
            <div className="social-links mb-3 d-flex align-items-center">
              <a href="https://www.instagram.com/ventas_bronca/" target="_blank" rel="noreferrer" aria-label="Síguenos en Instagram" className="text-light me-3">
                <img src={instagramIcon} alt="Instagram" style={{ height: 32, width: 32 }} />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=56974161396&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer" aria-label="Contáctanos por WhatsApp" className="text-light">
                <img src={whatsappIcon} alt="WhatsApp" style={{ height: 32, width: 32 }} />
              </a>
            </div>
            <p className="text-light mb-0">+56 9 7416 1396</p>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center">
            <div className="col-md-6">
            <p className="text-light mb-0">&copy; 2025 VentasBronca. Todos los derechos reservados.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-light mb-0">Desarrollado con <i className="fas fa-heart text-danger"></i> para profesionales</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
