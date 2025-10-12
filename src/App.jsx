import React from 'react'
import './App.css'
import { CartProvider, CartContext } from './context/CartContext'
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
import Login from './components/Login'
import Register from './components/Register'
import Notification from './components/Notification'
import ConfirmModal from './components/ConfirmModal'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Productos from './pages/Productos'

function AppContent() {
  const { confirm } = React.useContext(CartContext)
  return (
    <>
      <Navbar />
      <Notification />
      {confirm && (
        <ConfirmModal
          show={true}
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogPost />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/" element={
          <>
            <main style={{ paddingTop: '80px' }}>
              <Hero />
              <ProductsSection />
            </main>
            <Footer />
            <FloatingCart />
            <CartModal />
          </>
        } />
        {/* Fallback: redirigir a home si no existe la ruta */}
        <Route path="*" element={<>
          <main style={{ paddingTop: '80px' }}>
            <Hero />
            <ProductsSection />
          </main>
          <Footer />
          <FloatingCart />
          <CartModal />
        </>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
