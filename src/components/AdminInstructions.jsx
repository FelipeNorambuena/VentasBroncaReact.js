import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function AdminInstructions() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">
                <i className="bi bi-shield-check text-primary me-2"></i>
                Acceso de Administrador
              </h2>
              
              {isAuthenticated && isAdmin() ? (
                <div className="alert alert-success">
                  <h5>¡Ya eres administrador!</h5>
                  <p>Puedes acceder al panel de administración desde el menú de usuario en el navbar.</p>
                  <Link to="/admin" className="btn btn-success">
                    Ir al Panel Admin
                  </Link>
                </div>
              ) : (
                <div>
                  <h4>Para iniciar sesión como administrador:</h4>
                  <div className="mt-4">
                    <h5>Opción 1: Configurar en Xano</h5>
                    <ol>
                      <li>Ve a tu tabla de usuarios en Xano</li>
                      <li>Agrega un campo <code>role</code> (texto) o <code>is_admin</code> (booleano)</li>
                      <li>Para un usuario específico, establece:
                        <ul className="mt-2">
                          <li><code>role = "admin"</code> O</li>
                          <li><code>is_admin = true</code></li>
                        </ul>
                      </li>
                      <li>Asegúrate de que esta información se devuelva en el endpoint de login</li>
                    </ol>
                  </div>

                  <div className="mt-4">
                    <h5>Opción 2: Usar email especial (temporal)</h5>
                    <p>El sistema también detecta automáticamente como admin si el email contiene:</p>
                    <ul>
                      <li><code>@admin.</code> (ej: usuario@admin.ventasbronca.com)</li>
                      <li>Termina en <code>.admin</code> (ej: usuario@ventasbronca.admin)</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h5>Ejemplo de respuesta esperada de Xano:</h5>
                    <pre className="bg-light p-3 rounded">
{`{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@ventasbronca.com",
    "name": "Admin User",
    "role": "admin"  // ← Campo importante
    // o "is_admin": true
  }
}`}
                    </pre>
                  </div>

                  <div className="text-center mt-4">
                    <Link to="/login" className="btn btn-primary me-2">
                      Ir a Login
                    </Link>
                    <Link to="/" className="btn btn-outline-secondary">
                      Volver al Inicio
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}