import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import API from '../API';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProduct] = useState([]);

  useEffect(() => {
    fetchOrders();
    API.get('/product').then(res => {
      setProduct(res.data);
    });
  }, []);

  const fetchOrders = () => {
    API.get('/order').then(res => {
      setOrders(res.data);
    });
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Are you sure you want to mark this order as complete?')) return;
    try {
      await API.put(`/order/${id}`, { status: 'complete' });
      alert('Order marked as complete.');
      fetchOrders();
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await API.delete(`/order/${id}`);
      alert('Order deleted successfully.');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order.');
    }
  };

  const getProductName = (proId) => {
    const product = products.find((prod) => prod._id === proId);
    return product ? product.name : "unknown";
  };

  return (
    <div className='flex gap-5 min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='p-6 w-full'>
        <h1 className='text-3xl font-bold font-inter text-gray-900 mb-6'>Orders</h1>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getProductName(order.productId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.orderedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'complete' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    {order.status !== 'complete' && (
                      <button 
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
                        onClick={() => handleComplete(order._id)}
                        title="Mark as Complete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Complete
                      </button>
                    )}
                    <button 
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                      onClick={() => handleDelete(order._id)}
                      title="Delete Order"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
