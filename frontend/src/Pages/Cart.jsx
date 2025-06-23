import React from 'react'
import CartItems from '../Components/CartItems/CartItems'

const Cart = () => {
  return (
    <div>
      <h1 className='text-4xl font-bold text-center mt-16 flex flex-col items-center text-gray-700'>YOUR CART<hr className='w-60 mt-2 h-1 bg-gray-700 border-0 rounded-lg' /></h1>
      <CartItems />
    </div>
  )
}

export default Cart
