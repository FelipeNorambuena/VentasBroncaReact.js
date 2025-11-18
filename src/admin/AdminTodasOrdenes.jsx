import React, { useEffect, useState } from 'react';
import ordersService from '../services/orders';

function AdminTodasOrdenes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    ordersService.getAll()
      .then(data => setOrders(data))
      .catch(err => setError('Error al cargar órdenes'))
      .finally(() => setLoading(false));
  }, []);

  const actualizarEstado = async (id, estado) => {
    setLoading(true);
    setSuccess(null);
    try {
      await ordersService.updateStatus(id, estado);
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status: estado } : order));
      setSuccess(`Orden ${id} marcada como '${estado}'.`);
    } catch (err) {
      setError('No se pudo actualizar la orden');
    } finally {
      setLoading(false);
    }
  };

  const eliminarOrden = async (id) => {
    setLoading(true);
    setSuccess(null);
    try {
      await ordersService.delete(id);
      setOrders(prev => prev.filter(order => order.id !== id));
      setSuccess(`Orden ${id} eliminada correctamente.`);
    } catch (err) {
      setError('No se pudo eliminar la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión Total de Órdenes</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
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
            <tr><td colSpan="6">No hay órdenes registradas</td></tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.client_name}</td>
                <td>{order.payment_method}</td>
                <td>{ordersService.formatPrice(order.total)}</td>
                <td>{order.status}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => actualizarEstado(order.id, 'enviado')}>Marcar como enviado</button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => actualizarEstado(order.id, 'rechazado')}>Marcar como rechazado</button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => actualizarEstado(order.id, 'pendiente')}>Marcar como pendiente</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarOrden(order.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTodasOrdenes;
