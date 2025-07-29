import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from "./Pages/Home"
import ShopCategory from "./Pages/ShopCategory"
import Product from "./Pages/Product"
import Cart from "./Pages/Cart"
import LoginSignup from "./Pages/LoginSignup"
import PaymentSuccess from './Pages/PaymentSuccess'
import PaymentFailure from './Pages/PaymentFailure'
import Login from './Pages/Login'
import ProductsList from './Pages/Products'
import Contact from './Pages/Contact'
const RouterComponent = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/decks' element={<ShopCategory category="decks" />} />
        <Route path='/boards' element={<ShopCategory category="boards" />} />
        <Route path='/wheels' element={<ShopCategory category="wheels" />} />
        <Route path='/trucks' element={<ShopCategory category="trucks" />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/failure" element={<PaymentFailure />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default RouterComponent
