import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingCart from '../components/FloatingCart'
import CartModal from '../components/CartModal'
import ProductsSection from '../components/ProductsSection'

export default function Productos() {
  return (
    <>
      <Navbar />
      <main className="main-content" tabIndex={-1} style={{ paddingTop: '80px' }}>
        <ProductsSection />
      </main>
      <Footer />
      <FloatingCart />
      <CartModal />
    </>
  )
}
