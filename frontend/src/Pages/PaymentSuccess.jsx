import React from 'react';
import { Link } from 'react-router-dom'; // Corrected import

const PaymentSuccess = () => {
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
}

export default PaymentSuccess;
