import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPostBySlug, blogPosts } from '../data/blogPosts'
import './blog.css'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = getPostBySlug(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return (
      <main className="container py-5">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle fs-1 text-warning mb-3 d-block"></i>
          <h1 className="h3 mb-3">Artículo no encontrado</h1>
          <p className="text-muted mb-4">
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/blog" className="btn btn-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver al blog
          </Link>
        </div>
      </main>
    )
  }

  // Obtener artículos relacionados (misma categoría, excluyendo el actual)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  // Función para compartir en redes sociales
  const shareArticle = (platform) => {
    const url = window.location.href
    const title = post.title
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <main className="blog-post-page">
      {/* Breadcrumb */}
      <section className="breadcrumb-section bg-light py-3">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
              <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
              <li className="breadcrumb-item active" aria-current="page">
                {post.title.substring(0, 50)}...
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Header del artículo */}
      <article className="blog-post">
        <header className="blog-post-header py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <span className="badge bg-primary mb-3">{post.category}</span>
                <h1 className="display-5 fw-bold mb-3">{post.title}</h1>
                <p className="lead text-muted mb-4">{post.excerpt}</p>
                
                <div className="blog-post-meta d-flex flex-wrap gap-3 align-items-center mb-4 pb-4 border-bottom">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle fs-4 text-primary me-2"></i>
                    <div>
                      <small className="text-muted d-block">Autor</small>
                      <strong>{post.author}</strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-calendar3 fs-4 text-primary me-2"></i>
                    <div>
                      <small className="text-muted d-block">Publicado</small>
                      <strong>
                        {new Date(post.date).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </strong>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-clock fs-4 text-primary me-2"></i>
                    <div>
                      <small className="text-muted d-block">Lectura</small>
                      <strong>{post.readTime}</strong>
                    </div>
                  </div>
                </div>

                {/* Botones de compartir */}
                <div className="d-flex gap-2 flex-wrap">
                  <strong className="me-2">Compartir:</strong>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => shareArticle('facebook')}
                  >
                    <i className="bi bi-facebook me-1"></i> Facebook
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-info"
                    onClick={() => shareArticle('twitter')}
                  >
                    <i className="bi bi-twitter me-1"></i> Twitter
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-success"
                    onClick={() => shareArticle('whatsapp')}
                  >
                    <i className="bi bi-whatsapp me-1"></i> WhatsApp
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => shareArticle('linkedin')}
                  >
                    <i className="bi bi-linkedin me-1"></i> LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido del artículo */}
        <section className="blog-post-content py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                {/* Imagen destacada */}
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="img-fluid rounded shadow-sm mb-5"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}

                {/* Contenido markdown renderizado */}
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content
                      .replace(/\n/g, '<br/>')
                      .replace(/#{6}\s+(.+)/g, '<h6>$1</h6>')
                      .replace(/#{5}\s+(.+)/g, '<h5>$1</h5>')
                      .replace(/#{4}\s+(.+)/g, '<h4>$1</h4>')
                      .replace(/#{3}\s+(.+)/g, '<h3>$1</h3>')
                      .replace(/#{2}\s+(.+)/g, '<h2>$1</h2>')
                      .replace(/#{1}\s+(.+)/g, '<h1>$1</h1>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.+?)\*/g, '<em>$1</em>')
                      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
                      .replace(/---/g, '<hr/>')
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="blog-post-tags py-4 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h5 className="mb-3">Etiquetas:</h5>
                <div className="d-flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary fs-6">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Llamado a la acción */}
        <section className="blog-post-cta py-5 bg-primary text-white">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="h3 mb-3">¿Te gustó este artículo?</h2>
                <p className="lead mb-4">
                  Explora nuestros productos recomendados y equípate como un profesional
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/productos" className="btn btn-light btn-lg">
                    <i className="bi bi-bag-check me-2"></i>
                    Ver Productos
                  </Link>
                  <a 
                    href="https://wa.me/56974161396" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-light btn-lg"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    Asesoría WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Artículos relacionados */}
        {relatedPosts.length > 0 && (
          <section className="related-posts py-5">
            <div className="container">
              <h2 className="h3 mb-4">Artículos Relacionados</h2>
              <div className="row">
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm hover-lift">
                      <img
                        src={relatedPost.image}
                        className="card-img-top"
                        alt={relatedPost.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/assets/images/logo.jpg'
                        }}
                      />
                      <div className="card-body">
                        <span className="badge bg-primary mb-2">
                          {relatedPost.category}
                        </span>
                        <h5 className="card-title">
                          <Link 
                            to={`/blog/${relatedPost.slug}`}
                            className="text-decoration-none text-dark"
                          >
                            {relatedPost.title.substring(0, 60)}...
                          </Link>
                        </h5>
                        <p className="card-text text-muted small">
                          {relatedPost.excerpt.substring(0, 100)}...
                        </p>
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Leer más <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Navegación anterior/siguiente */}
        <section className="blog-navigation py-4 border-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="d-flex justify-content-between">
                  <Link to="/blog" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al blog
                  </Link>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-arrow-up me-2"></i>
                    Volver arriba
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}
