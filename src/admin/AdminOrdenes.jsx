import React, { useEffect, useState } from 'react';
import ordersService from '../services/orders';

function AdminOrdenes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las órdenes y filtrar las pendientes
  useEffect(() => {
    setLoading(true);
    ordersService.getAll()
      .then(data => {
        // Filtrar solo las pendientes
        setOrders(data.filter(order => order.status === 'pendiente'));
      })
      .catch(err => setError('Error al cargar órdenes'))
      .finally(() => setLoading(false));
  }, []);

  // Actualizar estado de la orden
  const actualizarEstado = async (id, estado) => {
    setLoading(true);
    try {
      await ordersService.updateStatus(id, estado);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      setError('No se pudo actualizar la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Órdenes/Pagos Pendientes</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Método Pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && !loading ? (
            <tr><td colSpan="6">No hay órdenes pendientes</td></tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.client_name}</td>
                <td>{order.payment_method}</td>
                <td>{ordersService.formatPrice(order.total)}</td>
                <td>{order.status}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => actualizarEstado(order.id, 'enviado')}>Aceptar pago</button>
                  <button className="btn btn-danger btn-sm" onClick={() => actualizarEstado(order.id, 'rechazado')}>Rechazar pago</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdenes;
