import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { blogPosts, getFeaturedPosts } from '../data/blogPosts'
import './blog.css'

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = [...new Set(blogPosts.map(post => post.category))]
    return ['all', ...cats]
  }, [])

  // Filtrar posts
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    return filtered
  }, [selectedCategory, searchTerm])

  const featuredPosts = getFeaturedPosts()

  return (
    <main className="blog-page">
      {/* Hero del Blog */}
      <section className="blog-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-3">Blog Ventas Bronca</h1>
              <p className="lead text-muted mb-4">
                Guías, consejos y novedades sobre equipamiento táctico, caza, pesca y aventuras outdoor en Chile
              </p>
              <div className="blog-stats d-flex justify-content-center gap-4 mb-4">
                <div>
                  <strong className="fs-4 text-primary">{blogPosts.length}</strong>
                  <p className="mb-0 text-muted small">Artículos</p>
                </div>
                <div>
                  <strong className="fs-4 text-primary">{categories.length - 1}</strong>
                  <p className="mb-0 text-muted small">Categorías</p>
                </div>
                <div>
                  <strong className="fs-4 text-primary">{featuredPosts.length}</strong>
                  <p className="mb-0 text-muted small">Destacados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="blog-filters bg-light py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar artículos por título, contenido o tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`btn btn-sm ${
                      selectedCategory === category
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'Todos' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artículos Destacados */}
      {selectedCategory === 'all' && !searchTerm && featuredPosts.length > 0 && (
        <section className="featured-posts py-5">
          <div className="container">
            <h2 className="h3 mb-4 d-flex align-items-center">
              <i className="bi bi-star-fill text-warning me-2"></i>
              Artículos Destacados
            </h2>
            <div className="row">
              {featuredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lista de Artículos */}
      <section className="blog-list py-5">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">
                  {selectedCategory === 'all' && !searchTerm && 'Todos los Artículos'}
                  {selectedCategory !== 'all' && `Categoría: ${selectedCategory}`}
                  {searchTerm && `Resultados para: "${searchTerm}"`}
                </h2>
                <span className="badge bg-secondary">
                  {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="row">
                {filteredPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
              <h3 className="h5 text-muted">No se encontraron artículos</h3>
              <p className="text-muted">
                Intenta cambiar los filtros o el término de búsqueda
              </p>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchTerm('')
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Mostrar todos los artículos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Newsletter */}
      <section className="blog-newsletter bg-primary text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="h3 mb-3">📧 Suscríbete a Nuestro Newsletter</h2>
              <p className="mb-4">
                Recibe guías exclusivas, ofertas especiales y novedades de productos directamente en tu email
              </p>
              <form className="row g-3 justify-content-center">
                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Tu email"
                    required
                  />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-light btn-lg">
                    Suscribirme
                  </button>
                </div>
              </form>
              <small className="d-block mt-3 opacity-75">
                Sin spam. Puedes cancelar en cualquier momento.
              </small>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
