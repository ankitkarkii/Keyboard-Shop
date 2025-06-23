import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../Assets/logo_white.png'
import { AuthContext } from '../../Context/AuthContext'

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setShowNavbar(false)
      } else {
        // Scrolling up
        setShowNavbar(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const handleLogout = () => {
    logout()
  }

  return (
    <div
      className={`flex items-center p-5 bg-black justify-between font-inter font-normal text-lg sticky top-0 z-10 shadow-md border-b border-red-700 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='ml-10 h-10 flex items-center gap-3'>
        <img src={logo} alt='' className='h-full' />
        <p className='text-white font-semibold text-2xl tracking-wide'>C L I C K I F Y</p>
      </div>
      <ul className='ml-10 h-10 flex items-center gap-5'>
        <li>
          <button
            onClick={handleLogout}
            className='border border-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 active:bg-red-900 transition-colors duration-300'
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
