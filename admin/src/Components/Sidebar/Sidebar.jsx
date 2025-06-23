import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: '/list', label: 'Product List', icon: 'fa-solid fa-list' },
    { to: '/addproduct', label: 'Add Product', icon: 'fa-solid fa-cart-shopping' },
    { to: '/addcategory', label: 'Add Category', icon: 'fa-solid fa-tags' },
    { to: '/addattribute', label: 'Add Attribute', icon: 'fa-solid fa-plus' },
    { to: '/orders', label: 'Orders', icon: 'fa-solid fa-clipboard' },
  ];

  return (
    <div className='h-screen flex sticky top-0'>
      <div className="hidden md:flex flex-col w-64 bg-black shadow-lg ">
        <div className="flex items-center justify-center h-20 border-b border-red-700 px-6">
          <span className="text-white text-2xl font-semibold ml-4 font-inter tracking-wide">Admin Panel</span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-black space-y-2">
            {links.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-white text-base font-medium transition-all duration-300
                    ${isActive ? 'bg-red-600 shadow-lg' : 'hover:bg-red-700 hover:shadow-md'}`}
                >
                  <i className={`${icon} w-6 text-lg`}></i>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
