import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { AuthContext } from '../Context/AuthContext';
import API from '../API';

const PaymentSuccess = () => {
  const { allProducts, cartItems, clearCart } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get('transaction_uuid'); // Optional use

  useEffect(() => {
    const placeOrder = async () => {
      const userId = user?.id || 'guest';

      const amount = allProducts.reduce((acc, product) => {
        const quantity = cartItems[product._id]?.quantity || 0;
        return acc + product.new_price * quantity;
      }, 0);

      const tax = Math.round((amount * 0.1) * 100) / 100;
      const totalAmount = Math.round((amount + tax) * 100) / 100;

      const orders = allProducts
        .filter(product => cartItems[product._id]?.quantity > 0)
        .map(product => ({
          orderedBy: userId,
          productId: product._id,
          quantity: cartItems[product._id].quantity,
          price: product.new_price * cartItems[product._id].quantity,
          totalAmount,
        }));

      try {
        for (const order of orders) {
          const res = await API.post('/order', order);
          if (res.data.success) {
            await API.put(`/product/${order.productId}/decrease`, {
              quantity: order.quantity,
            });
          } else {
            console.error('Order failed:', res);
          }
        }

        clearCart();
        setSuccess(true);
      } catch (error) {
        console.error('Error placing orders:', error);
      } finally {
        setLoading(false);
      }
    };

    placeOrder();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-lg font-semibold">
        Processing your order...
      </div>
    );
  }

  if (!success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-lg font-semibold text-red-600">
        Failed to place your order. Please contact support.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Order Placement Successful</h1>
        <p className="text-gray-600 mt-2">Your order has been successfully placed. Thank you for shopping with us!</p>
        <div className="mt-6">
          <Link to='/'>
            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-green-600 focus:outline-none">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
