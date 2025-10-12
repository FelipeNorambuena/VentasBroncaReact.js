import React from 'react'

export default function ProductCard({ product, onAdd, onOpen }) {
  return (
    <div className="col">
      <div className="card h-100">
        <img src={product.image} className="card-img-top" alt={product.name} style={{ objectFit: 'cover', height: 200 }} />
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">{product.name}</h6>
          <p className="card-text text-muted small mb-2">{product.category}</p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className="fw-bold">${product.price.toFixed(2)}</div>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onOpen(product)}>Ver</button>
              <button className="btn btn-sm btn-success" onClick={() => onAdd(product)}>Agregar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
