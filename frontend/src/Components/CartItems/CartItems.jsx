import React, { useContext, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import API from '../../API';

const CartItems = () => {
    const { allProducts, cartItems, removeFromCart, getTotalAmount } = useContext(ShopContext);
    

    const uid = uuidv4();
    const amount = getTotalAmount();
    const tax = Math.round((amount * 0.1) * 100) / 100;
    const totalamount = Math.round((amount + tax) * 100) / 100;
    const userId = "USER_ID";  

    const message = `total_amount=${totalamount},transaction_uuid=${uid},product_code=EPAYTEST`;
    const esewasecret = import.meta.env.VITE_ESEWASECRET;
    const hash = CryptoJS.HmacSHA256(message, esewasecret);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    const handleOrder = async (event) => {
        event.preventDefault();  
        
        const orders = allProducts
            .filter(e => cartItems[e._id] > 0)
            .map(e => ({
                orderedBy: userId || "guest",
                productId: e._id,
                quantity: cartItems[e._id],
                price: e.new_price * cartItems[e._id],
            }));
    
        for (const ord of orders) {
            const order = {
                orderedBy: ord.orderedBy,
                productId: ord.productId,
                quantity: ord.quantity,
                price: ord.price
            };
            console.log(order.productId);
            try {
                const res = await API.post('/order', order);
                if (res.data.success) {
                    const prodId = order.productId;
                    const quantity = order.quantity;
                    
                    // Ensure quantity update is awaited
                    await API.put(`/product/${prodId}/decrease`, { quantity });
                    
                    // Submit the form after successful order and quantity update
                    event.target.submit();
                }
            } catch (error) {
                console.error('Error placing order:', error);
                alert("Failed to place order. Please try again.");
            }  
        }
    };
    ;
    
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
                    if (cartItems[e._id] > 0) {
                        return (
                            <tbody key={i}>
                                <tr className='border-b-2'>
                                    <td className='p-5'>
                                        <img src={e.image} alt={e.name} className='w-10 h-10' />
                                    </td>
                                    <td className='p-5'>{e.name}</td>
                                    <td className='p-5'>Rs.{e.new_price}</td>
                                    <td className='p-5 text-center'>{cartItems[e._id]}</td>
                                    <td className='p-5'>Rs.{e.new_price * cartItems[e._id]}</td>
                                    <td className='p-5 text-center text-2xl text-red-600'>
                                        <i onClick={() => { removeFromCart(e._id) }} className='fa-solid fa-trash cursor-pointer'></i>
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

                <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" onSubmit={handleOrder}>
                    <input type="hidden" id="amount" name="amount" value={amount} required />
                    <input type="hidden" id="tax_amount" name="tax_amount" value={tax} required />
                    <input type="hidden" id="total_amount" name="total_amount" value={totalamount} required />
                    <input type="hidden" id="transaction_uuid" name="transaction_uuid" value={uid} required />
                    <input type="hidden" id="product_code" name="product_code" value="EPAYTEST" required />
                    <input type="hidden" id="product_service_charge" name="product_service_charge" value="0" required />
                    <input type="hidden" id="product_delivery_charge" name="product_delivery_charge" value="0" required />
                    <input type="hidden" id="success_url" name="success_url" value="http://localhost:5173/success" required />
                    <input type="hidden" id="failure_url" name="failure_url" value="http://localhost:5173/failure" required />
                    <input type="hidden" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required />
                    <input type="hidden" id="signature" name="signature" value={signature} required />

                    <button className='bg-purple-700 px-5 py-3 text-xl mt-10 text-white font-medium rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-purple-500 transition-all'>
                        Proceed To Checkout
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CartItems;
