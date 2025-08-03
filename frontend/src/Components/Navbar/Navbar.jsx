import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { AuthContext } from '../../Context/AuthContext';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const { getTotalCartItems } = useContext(ShopContext);
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const userMenuRef = React.useRef(null);

  const toggleUserMenu = (e) => {
    e.preventDefault();
    setUserMenuOpen((prev) => !prev);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY < lastScrollY) {
        setNavbarVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setNavbarVisible(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-white shadow-sm sticky top-0 z-10 transition-transform duration-300 ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-black font-semibold text-2xl tracking-wide">
              C L I C K I F Y
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
              <ul className="flex space-x-8">
                <li onClick={() => setMenu("home")}>
                  <Link to="/" className={`hover:text-red-600 ${menu === "home" ? "text-red-600" : ""}`}>
                    Home
                  </Link>
                </li>
                <li onClick={() => setMenu("products")}>
                  <Link to="/products" className={`hover:text-red-600 ${menu === "products" ? "text-red-600" : ""}`}>
                    Products
                  </Link>
                </li>
                
              </ul>
            </div>

            <div className="flex items-center space-x-6">
              <div 
                className="relative"
                ref={userMenuRef}
              >
                {user ? (
                  <>
                    <span 
                      className="cursor-pointer text-gray-700 hover:text-red-600 font-semibold"
                      onClick={toggleUserMenu}
                    >
                      {user.username}
                    </span>
                    <button
                      className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => {
                        logout();
                        setMenu("");
                        setUserMenuOpen(false);
                        navigate("/");
                      }}
                    >
                      Logout
                    </button>
                    {isUserMenuOpen && (
                      <div 
                        className="absolute top-10 right-0 bg-white text-black p-2 rounded shadow-lg"
                      >
                        <button
                          className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                          onClick={() => {
                            logout();
                            setMenu("");
                            setUserMenuOpen(false);
                            navigate("/");
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/" onClick={toggleUserMenu} className="text-gray-700 hover:text-red-600">
                      <i className="fa-solid fa-user text-xl"></i>
                    </Link>
                    {isUserMenuOpen && (
                      <div 
                        className="absolute top-10 right-0 bg-white text-black p-2 rounded shadow-lg"
                      >
                        <Link 
                          to="/login" 
                          className="block px-4 py-2 hover:bg-gray-200"
                          onClick={() => { setMenu(""); setUserMenuOpen(false); }}
                        >
                          Login
                        </Link>
                        <Link 
                          to="/signup" 
                          className="block px-4 py-2 hover:bg-gray-200"
                          onClick={() => { setMenu(""); setUserMenuOpen(false); }}
                        >
                          Signup
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
              <Link to="/cart" onClick={() => setMenu("")} className="text-gray-700 hover:text-red-600 relative">
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">{getTotalCartItems()}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
