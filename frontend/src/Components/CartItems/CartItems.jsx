import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { AuthContext } from '../../Context/AuthContext';
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';

const CartItems = () => {
    const { allProducts, cartItems, removeFromCart, getTotalAmount } = useContext(ShopContext);
    const { user } = useContext(AuthContext);

    const uid = uuidv4();
    const amount = getTotalAmount();
    const tax = Math.round((amount * 0.1) * 100) / 100;
    const totalamount = Math.round((amount + tax) * 100) / 100;

    const message = `total_amount=${totalamount},transaction_uuid=${uid},product_code=EPAYTEST`;
    const esewasecret = import.meta.env.VITE_ESEWASECRET;
    const hash = CryptoJS.HmacSHA256(message, esewasecret);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    useEffect(() => {
        const handleGlobalError = (event) => {
            console.error('Global error caught:', event.error || event.reason || event);
        };

        window.addEventListener('error', handleGlobalError);
        window.addEventListener('unhandledrejection', handleGlobalError);

        return () => {
            window.removeEventListener('error', handleGlobalError);
            window.removeEventListener('unhandledrejection', handleGlobalError);
        };
    }, []);

    return (
        <div className='p-5 flex flex-col items-center'>
            <table className='w-3/4'>
                <thead>
                    <tr className='border-b-2 font-[Poppins]'>
                        <th className='p-5 text-left'>Products</th>
                        <th className='p-5 text-left'>Title</th>
                        <th className='p-5 text-left'>Price</th>
                        <th className='p-5 text-left'>Quantity</th>
                        <th className='p-5 text-left'>Total</th>
                        <th className='p-5 text-left'>Remove</th>
                    </tr>
                </thead>
                {allProducts.map((e, i) => {
                    if (cartItems[e._id]?.quantity > 0) {
                        return (
                            <tbody key={i}>
                                <tr className='border-b-2'>
                                    <td className='p-5'>
                                        <img src={e.image} alt={e.name} className='w-10 h-10' />
                                    </td>
                                    <td className='p-5'>{e.name}</td>
                                    <td className='p-5'>Rs.{e.new_price}</td>
                                    <td className='p-5 text-center'>{cartItems[e._id].quantity}</td>
                                    <td className='p-5'>Rs.{e.new_price * cartItems[e._id].quantity}</td>
                                    <td className='p-5 text-center text-2xl text-red-600'>
                                        <i onClick={() => removeFromCart(e._id)} className='fa-solid fa-trash cursor-pointer'></i>
                                    </td>
                                </tr>
                            </tbody>
                        );
                    }
                    return null;
                })}
            </table>

            {/* Cart Total Section */}
            <div className='w-3/4 mt-10'>
                <h1 className='text-xl font-bold font-[Poppins]'>Cart Total</h1>
                <table className='w-1/2'>
                    <tbody>
                        <tr>
                            <td className='p-3 pl-0 text-left'>Subtotal</td>
                            <td className='p-3 pl-20 text-right'>Rs.{amount}</td>
                        </tr>
                        <tr>
                            <td className='p-3 pl-0 text-left'>Tax</td>
                            <td className='p-3 pl-20 text-right'>Rs.{tax}</td>
                        </tr>
                        <tr className='border-b-4'>
                            <td className='p-3 pl-0 text-left'>Shipping Fee</td>
                            <td className='p-3 pl-20 text-right'>Free</td>
                        </tr>
                        <tr>
                            <th className='p-3 pl-0 text-left'>Total</th>
                            <td className='p-3 pl-20 text-right'>Rs.{totalamount}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Checkout Button / Logic */}
                {user ? (
                    amount === 0 || totalamount === 0 ? (
                        <div className='mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800'>
                            <p className='text-lg font-semibold'>Your cart is empty. Add items to proceed to checkout.</p>
                        </div>
                    ) : (
                        <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
                            <input type="hidden" name="amount" value={amount} />
                            <input type="hidden" name="tax_amount" value={tax} />
                            <input type="hidden" name="total_amount" value={totalamount} />
                            <input type="hidden" name="transaction_uuid" value={uid} />
                            <input type="hidden" name="product_code" value="EPAYTEST" />
                            <input type="hidden" name="product_service_charge" value="0" />
                            <input type="hidden" name="product_delivery_charge" value="0" />
                            <input type="hidden" name="success_url" value="http://localhost:5173/success" />
                            <input type="hidden" name="failure_url" value="http://localhost:5173/cart" />
                            <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
                            <input type="hidden" name="signature" value={signature} />

                            <button className='bg-purple-700 px-5 py-3 text-xl mt-10 text-white font-medium rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-purple-500 transition-all'>
                                Proceed To Checkout
                            </button>
                        </form>
                    )
                ) : (
                    <div className='mt-10 p-6 bg-red-50 border border-red-200 rounded-lg'>
                        <h3 className='text-lg font-semibold text-red-800 mb-2'>Login Required</h3>
                        <p className='text-red-600 mb-4'>Please login to proceed with your purchase.</p>
                        <div className='flex gap-4'>
                            <a href="/login" className='bg-purple-700 px-5 py-3 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors'>
                                Login
                            </a>
                            <a href="/register" className='bg-gray-600 px-5 py-3 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors'>
                                Register
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartItems;