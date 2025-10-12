import React from 'react'
import './App.css'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import FloatingCart from './components/FloatingCart'
import CartModal from './components/CartModal'
import ProductsSection from './components/ProductsSection'
import About from './components/About'
import Contact from './components/Contact'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <CartProvider>
      <Navbar />
      {path.includes('/nosotros') ? (
        <About />
      ) : path === '/blogs' || path.startsWith('/blogs/') ? (
        path === '/blogs' ? <BlogList /> : <BlogPost />
      ) : path.includes('/contacto') ? (
        <Contact />
      ) : (
        <>
          <main style={{ paddingTop: '80px' }}>
            <Hero />
            <ProductsSection />
          </main>
          <Footer />

          <FloatingCart />
          <CartModal />
        </>
      )}
    </CartProvider>
  )
}

export default App
