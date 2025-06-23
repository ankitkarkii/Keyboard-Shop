import React, { useState, useContext } from 'react';
import API from '../API';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = {};
        
        if (!email) validationErrors.email = 'Email is required';
        if (!password) validationErrors.password = 'Password is required';

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email && !emailRegex.test(email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        if (password && password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters long';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            const res = await API.post('/user/search', { email, password });
            console.log('Login response:', res.data);
            if (res.data.status === 'success' && res.data.user) {
                login(res.data.user);
                navigate('/');
            } else if (res.data === 'success') {
                // Backend returns 'success' string without user info
                const signupName = localStorage.getItem('signupName');
                login({ username: signupName || email });
                navigate('/');
            } else {
                setError(res.data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred while logging in.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex justify-center'>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <div className='flex flex-col items-center mb-5 mt-16'>
                    <h1 className='text-4xl font-bold text-center flex flex-col items-center text-gray-700 uppercase'>
                        Login
                        <hr className='w-60 mt-2 h-1 bg-gray-700 border-0 rounded-lg' />
                    </h1>
                    <div className='flex flex-col mt-5 gap-5 w-[350px]'>
                        <div className='relative'>
                            {errors.email && <label className="text-red-500 text-sm">{errors.email}</label>}
                            <input
                                type='email'
                                value={email}
                                placeholder='Your Email Address'
                                onChange={(e) => setEmail(e.target.value)}
                                className={`border-2 rounded-lg p-3 placeholder:text-lg w-full text-lg ${errors.email ? 'border-red-500' : ''}`}
                            />
                        </div>

                        <div className='relative'>
                            {errors.password && <label className="text-red-500 text-sm">{errors.password}</label>}
                            <input
                                type='password'
                                value={password}
                                placeholder='Your Password'
                                onChange={(e) => setPassword(e.target.value)}
                                className={`border-2 rounded-lg p-3 placeholder:text-lg w-full text-lg ${errors.password ? 'border-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    <button
                        className='mt-5 w-[350px] bg-purple-600 p-3 text-white text-2xl rounded-lg'
                        type='submit'
                    >
                        Continue
                    </button>
                    <p className='mt-3'>
                        Don't have an account?{' '}
                        <Link to='/signup'>
                            <span className='text-purple-600 font-semibold'>Signup</span>
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
