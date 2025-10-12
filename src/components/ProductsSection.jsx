import React, { useState, useContext } from 'react'
import ProductCard from './ProductCard'
import Lightbox from './Lightbox'
import { CartContext } from '../context/CartContext'

import imgA from '../assets/images/productos/tactico/MultiusoGerber.jpg'
import imgB from '../assets/images/productos/tactico/MultiusoGerber2.jpg'
import imgC from '../assets/images/productos/tactico/MultiusoGerber3.jpg'
import imgD from '../assets/images/productos/tactico/Guantesimpermeables1.jpg'
import imgE from '../assets/images/productos/tactico/CuerdaParacord15mts1.jpg'
import imgF from '../assets/images/productos/tactico/ChalecoTactico1.jpg'
import imgG from '../assets/images/productos/otros/SilbatoMulti1.jpg'
import imgH from '../assets/images/productos/camping/PlatoDoble1.jpg'

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Cuchillo multiuso Gerber', price: 19.99, category: 'Táctico', image: imgA },
  { id: 'p2', name: 'Guantes impermeables', price: 14.5, category: 'Táctico', image: imgD },
  { id: 'p3', name: 'Cuerda Paracord 15m', price: 9.99, category: 'Táctico', image: imgE },
  { id: 'p4', name: 'Chaleco táctico', price: 49.99, category: 'Táctico', image: imgF },
  { id: 'p5', name: 'Plato doble camping', price: 7.99, category: 'Camping', image: imgH },
  { id: 'p6', name: 'Silbato multiuso', price: 4.99, category: 'Otros', image: imgG },
  { id: 'p7', name: 'Cuchillo multiuso Gerber (2)', price: 24.99, category: 'Táctico', image: imgB },
  { id: 'p8', name: 'Cuchillo multiuso Gerber (3)', price: 29.99, category: 'Táctico', image: imgC },
]

export default function ProductsSection() {
  const { addItem } = useContext(CartContext)
  const [lightboxImage, setLightboxImage] = useState(null)

  const handleAdd = (product) => addItem(product)
  const handleOpen = (product) => setLightboxImage(product.image)

  return (
    <section className="products-section py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="display-6 fw-bold mb-2">Catálogo de Productos</h1>
            <p className="text-muted">Explora nuestra selección de productos tácticos, militares, camping y más</p>
            <hr className="mx-auto" style={{ width: 100, height: 3 }} />
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4" id="catalog-grid" aria-live="polite">
          {SAMPLE_PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} onOpen={handleOpen} />
          ))}
        </div>
      </div>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  )
}
