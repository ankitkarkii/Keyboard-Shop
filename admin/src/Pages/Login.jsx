import React, { useState, useContext } from 'react';
import logo from '../Components/Assets/logo_white.png';
import API from '../API';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      
      const res = await API.post('/admin/search', { email, password });
      
      if (res.data.status === 'success') {
        login(res.data.user);
        navigate('/list');
      } else {
        setError(res.data.message || 'Login failed'); 
      }
    } catch (err) {
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div>
      <main className="mx-auto flex flex-col gap-20 min-h-screen w-full items-center bg-gray-900 text-white">
        <div className="m-20 h-10 flex items-center gap-3">
          <img src={logo} alt="" className="h-full" />
          <p className="text-white font-semibold text-2xl font-[Poppins]">C L I C K I F Y</p>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex w-[30rem] flex-col space-y-10">
          <div className="text-center text-4xl font-medium">Admin Login</div>

          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            />
          </div>

          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
            />
          </div>

          <button type="submit" className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400">
            LOG IN
          </button>

          

          <a href="#" className="transform text-center font-semibold text-gray-500 duration-300 hover:text-gray-300">
            FORGOT PASSWORD?
          </a>
        </form>
      </main>
    </div>
  );
};

export default Login;
