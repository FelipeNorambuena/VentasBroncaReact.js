import React from 'react'
import { Link } from 'react-router-dom'
import './blog.css'

export default function BlogCard({ post }) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="blog-card h-100">
        <div className="blog-card-image-wrapper">
          <img 
            src={post.image} 
            alt={post.title}
            className="blog-card-image"
            onError={(e) => {
              e.target.src = '/assets/images/logo.jpg' // Fallback image
            }}
          />
          {post.featured && (
            <span className="badge bg-danger position-absolute top-0 end-0 m-2">
              ⭐ Destacado
            </span>
          )}
        </div>
        
        <div className="blog-card-body">
          <div className="blog-card-meta mb-2">
            <span className="badge bg-primary me-2">{post.category}</span>
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              {post.readTime}
            </small>
            <small className="text-muted ms-2">
              <i className="bi bi-calendar3 me-1"></i>
              {new Date(post.date).toLocaleDateString('es-CL', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </small>
          </div>

          <h3 className="blog-card-title">
            <Link to={`/blog/${post.slug}`} className="text-decoration-none text-dark">
              {post.title}
            </Link>
          </h3>

          <p className="blog-card-excerpt text-muted">
            {post.excerpt}
          </p>

          <div className="blog-card-tags mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-1">
                #{tag}
              </span>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-person me-1"></i>
              {post.author}
            </small>
            <Link 
              to={`/blog/${post.slug}`} 
              className="btn btn-outline-primary btn-sm"
            >
              Leer más <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
