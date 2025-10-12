import React from 'react'

const POSTS_BY_SLUG = {
  'paracord-espacio': {
    title: 'Paracord: De la supervivencia al espacio',
    content: (
      <>
        <p className="lead">El paracord, conocido por su resistencia y versatilidad, ha acompañado a exploradores, militares y hasta astronautas. En misiones espaciales, fue utilizado para reparar equipos y asegurar cargas, demostrando su utilidad más allá de la Tierra.</p>
        <p>En VentasBronca ofrecemos paracord de alta calidad, ideal para actividades outdoor, rescate y uso profesional. Descubre cómo este accesorio puede ser tu mejor aliado en situaciones extremas.</p>
      </>
    )
  },
  'evolucion-chaleco': {
    title: 'Chaleco táctico: De la élite militar al outdoor',
    content: (
      <>
        <p className="lead">El chaleco táctico ha evolucionado desde su uso exclusivo en fuerzas especiales hasta convertirse en un elemento esencial para deportes, seguridad y actividades al aire libre. Su diseño modular y resistente lo hace ideal para múltiples usos.</p>
        <p>En VentasBronca contamos con chalecos tácticos de última generación, pensados para quienes buscan protección, comodidad y funcionalidad en cualquier entorno.</p>
      </>
    )
  }
}

export default function BlogPost() {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const parts = path.split('/')
  const slug = parts[parts.length - 1]
  const post = POSTS_BY_SLUG[slug]

  if (!post) {
    return (
      <main className="container py-5 mt-5">
        <h1 className="display-6 fw-bold">Entrada no encontrada</h1>
        <p>El artículo solicitado no existe.</p>
      </main>
    )
  }

  return (
    <main className="container py-5 mt-5">
      <h1 className="display-5 fw-bold mb-3">{post.title}</h1>
      {post.content}
    </main>
  )
}
