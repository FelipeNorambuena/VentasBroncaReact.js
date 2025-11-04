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
        <div className="row align-items-center mb-5">
          <div className="col-md-6 mb-4 mb-md-0">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Equipo VentasBronca" className="img-fluid rounded shadow" style={{ maxHeight: 320, objectFit: 'cover' }} />
          </div>
          <div className="col-md-6">
            <h2 className="h4 fw-bold mb-3">Nuestra Historia</h2>
            <p className="text-justify" style={{ lineHeight: '1.8' }}>
              VentasBronca nació con un propósito claro: complementar la indumentaria de los funcionarios de las Fuerzas Armadas de Chile con productos de calidad, confiables y accesibles. Lo que comenzó como una iniciativa enfocada en el equipamiento militar, con el tiempo se transformó en algo más grande: una tienda comprometida con quienes viven la vida con audacia y determinación.
            </p>
            <p className="text-justify" style={{ lineHeight: '1.8' }}>
              Hoy, nuestro catálogo abarca las necesidades completas de la vida aventurera: desde indumentaria táctica y militar hasta equipamiento especializado para caza, pesca y supervivencia. Cada producto que ofrecemos ha sido seleccionado pensando en la resistencia, la funcionalidad y el rendimiento en terreno chileno, uno de los más exigentes del mundo.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h2 className="h4 fw-bold mb-3 text-center">Nuestra Misión</h2>
            <p className="lead text-center px-md-5" style={{ lineHeight: '1.8' }}>
              Ofrecer los productos que nuestros clientes necesitan con <strong>rapidez y al mejor precio del mercado</strong>, sin comprometer la calidad ni el servicio. Creemos que cada persona merece acceder a equipamiento de primer nivel, sin importar si es un profesional en servicio activo, un aventurero de fin de semana o alguien que busca prepararse para lo inesperado.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h2 className="h4 fw-bold mb-3 text-center">Nuestra Visión</h2>
            <p className="lead text-center px-md-5" style={{ lineHeight: '1.8' }}>
              Crecer como empresa y convertirnos en el aliado estratégico de organizaciones privadas que buscan equipar a sus fuerzas de seguridad con indumentaria táctica de calidad. Queremos ser reconocidos no solo por la variedad de nuestros productos, sino por la confianza que generamos en cada transacción.
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <h2 className="h4 fw-bold mb-3 text-center">Nuestra Propuesta de Valor</h2>
            <div className="px-md-5">
              <p className="text-center mb-4" style={{ lineHeight: '1.8' }}>
                En VentasBronca encontrarás <strong>todo lo necesario</strong> en indumentaria militar, equipamiento táctico, artículos de caza, pesca y supervivencia. Nos esforzamos por ofrecer:
              </p>
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <div className="p-3">
                    <h5 className="fw-bold">Calidad Superior</h5>
                    <p className="small">Productos probados y confiables para entornos exigentes.</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="p-3">
                    <h5 className="fw-bold">Experiencia Grata</h5>
                    <p className="small">Navegación simple, compra segura y atención cercana.</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="p-3">
                    <h5 className="fw-bold">Rapidez</h5>
                    <p className="small">Envíos a todo Chile con seguimiento en tiempo real.</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="p-3">
                    <h5 className="fw-bold">Mejores Precios</h5>
                    <p className="small">Tarifas competitivas sin sacrificar la calidad.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h2 className="h4 fw-bold mb-3 text-center">Nuestros Valores</h2>
            <div className="row px-md-5">
              <div className="col-md-6 mb-3">
                <p style={{ lineHeight: '1.8' }}>
                  <strong>Compromiso:</strong> Con nuestros clientes, con la calidad de cada producto y con la promesa de entregar lo mejor.
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p style={{ lineHeight: '1.8' }}>
                  <strong>Profesionalismo:</strong> Cada interacción refleja nuestro respeto por quienes confían en nosotros.
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p style={{ lineHeight: '1.8' }}>
                  <strong>Comunidad:</strong> Somos parte de una red de aventureros, profesionales y entusiastas que comparten nuestra pasión.
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <p style={{ lineHeight: '1.8' }}>
                  <strong>Audacia:</strong> Creemos en la innovación constante y en desafiar los límites de lo posible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team mt-5 pt-5 border-top">
        <div className="bg-light rounded p-5">
          <h2 className="h4 fw-bold text-center mb-3 text-dark">El Equipo Humano</h2>
          <p className="text-center mb-5 px-md-5 text-dark">
            Detrás de VentasBronca hay personas comprometidas con hacer realidad esta visión: emprendedores que conocen el mercado y desarrolladores que construyen la plataforma digital que conecta a nuestros clientes con los productos que necesitan.
          </p>
          <div className="row justify-content-center">
            <div className="col-md-4 text-center mb-4">
              <img src={personIcon} alt="Constanza - Fundadora" className="rounded-circle shadow mb-3" style={{ width: 100, height: 100, objectFit: 'cover', background: '#fff', padding: '15px' }} />
              <h5 className="mb-1 fw-bold text-dark">Constanza</h5>
              <small className="d-block mb-2 text-dark">Fundadora y Administradora</small>
              <p className="mt-2 small px-3 text-dark">Emprendedora y creadora de VentasBronca, responsable de la gestión y operaciones de la tienda.</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <img src={devIcon} alt="Felipe Norambuena - Desarrollador" className="rounded-circle shadow mb-3" style={{ width: 100, height: 100, objectFit: 'cover', background: '#fff', padding: '15px' }} />
              <h5 className="mb-1 fw-bold text-dark">Felipe Norambuena</h5>
              <small className="d-block mb-2 text-dark">Desarrollador Full Stack</small>
              <p className="mt-2 small px-3 text-dark">Desarrollador web encargado de la arquitectura y funcionalidades del sitio.</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <img src={webIcon} alt="Juan Pablo González - Frontend" className="rounded-circle shadow mb-3" style={{ width: 100, height: 100, objectFit: 'cover', background: '#fff', padding: '15px' }} />
              <h5 className="mb-1 fw-bold text-dark">Juan Pablo González</h5>
              <small className="d-block mb-2 text-dark">Desarrollador Frontend</small>
              <p className="mt-2 small px-3 text-dark">Especialista en diseño de interfaces y experiencia de usuario del sitio web.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  )
}
