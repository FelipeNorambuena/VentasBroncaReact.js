import React from 'react'
import './App.css'
import { CartProvider, CartContext } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
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
import AdminInstructions from './components/AdminInstructions'
import Notification from './components/Notification'
import ConfirmModal from './components/ConfirmModal'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Productos from './pages/Productos'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminUsuarios from './admin/AdminUsuarios'
import AdminProductos from './admin/AdminProductos'
import AdminCrearUsuario from './admin/AdminCrearUsuario'
import AdminConfiguracion from './admin/AdminConfiguracion'
import AdminPerfil from './admin/AdminPerfil'

function AppContent() {
  const { confirm } = React.useContext(CartContext)
  const { loading } = useAuth()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  
  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {!isAdminRoute && <Navbar />}
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
        <Route path="/admin-help" element={<AdminInstructions />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogPost />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="crear-usuario" element={<AdminCrearUsuario />} />
          <Route path="configuracion" element={<AdminConfiguracion />} />
          <Route path="perfil" element={<AdminPerfil />} />
        </Route>
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
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
