import React, { useEffect, useState } from 'react';
import API from '../API';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/order/user');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Product ID</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  <Link to={`/products/${order.productId}`}>
                    {order.productId}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">{order.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">${order.price}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
