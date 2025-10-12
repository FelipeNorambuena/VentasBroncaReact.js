import React from 'react'
import { Link } from 'react-router-dom'

const POSTS = [
  {
    slug: 'paracord-espacio',
    title: 'Paracord: De la supervivencia al espacio',
    excerpt: 'El paracord ha sido usado incluso en misiones espaciales. Descubre su historia y usos.'
  },
  {
    slug: 'evolucion-chaleco',
    title: 'Chaleco táctico: De la élite militar al outdoor',
    excerpt: 'Repasamos la evolución del chaleco táctico y sus ventajas actuales.'
  }
]

export default function BlogList() {
  return (
    <main className="container py-5 mt-5">
      <h1 className="display-5 fw-bold text-center mb-4">Blog</h1>
      <div className="row g-4">
        {POSTS.map((p) => (
          <div key={p.slug} className="col-md-6">
            <div className="card p-3 h-100">
              <h3 className="h5">{p.title}</h3>
              <p className="text-muted">{p.excerpt}</p>
              <Link className="btn btn-outline-primary" to={`/blogs/${p.slug}`}>Leer</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
