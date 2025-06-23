import React from 'react'
import {Routes,Route} from 'react-router-dom'
import ProductList from './Pages/ProductList'
import AddProduct from './Pages/AddProduct'
import Orders from './Pages/Orders'
import UpdateProduct from './Pages/UpdateProduct'
import Login from './Pages/Login'
import AddAttribute from './Pages/AddAttribute'
import AddCategory from './Pages/AddCategory'
import ProtectedRoute from './Components/ProtectedRoute'

const RouterComponent = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/list" element={<ProtectedRoute element={<ProductList />} />}></Route>
        <Route path="/addproduct" element={<ProtectedRoute element={<AddProduct />} />}></Route>
        <Route path="/addcategory" element={<ProtectedRoute element={<AddCategory />} />}></Route>
        <Route path="/orders" element={<ProtectedRoute element={<Orders />} />}></Route>
        <Route path="/updateproduct/:id" element={<ProtectedRoute element={<UpdateProduct/>} />}></Route>
        <Route path="/addattribute" element={<ProtectedRoute element={<AddAttribute />} />}></Route>
    </Routes>
  )
}
  
export default RouterComponent
