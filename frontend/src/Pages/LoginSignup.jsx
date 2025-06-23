import React, { useState } from 'react';
import API from '../API';
import { Link, useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    
    if (!name) validationErrors.name = 'Name is required';
    if (!email) validationErrors.email = 'Email is required';
    if (!password) validationErrors.password = 'Password is required';
    if (!address) validationErrors.address = 'Address is required';
    if (!contact) validationErrors.contact = 'Contact number is required';

    if (password && password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      validationErrors.email = 'Please enter a valid email address';
    } else if (email && !email.endsWith('@gmail.com')) {
      validationErrors.email = 'Email must be a Gmail address';
    }

    if (contact && (contact.length !== 10 || isNaN(contact) || !contact.startsWith('98'))) {
      validationErrors.contact = 'Please enter a valid 10-digit contact number starting with "98"';
    }

    if (!agreed) {
      validationErrors.agreed = 'You must agree to the terms and privacy policy';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const data = {
      name: name,
      email: email,
      password: password,
      address: address,
      contact: contact,
    };

    API.post('/user', data)
      .then((res) => {
        if (res.data.success) {
          alert('User Registered Successfully');
          localStorage.setItem('signupName', name);
          setName('');
          setEmail('');
          setPassword('');
          setAddress('');
          setContact('');
          navigate('/login');
        } else {
          alert('Error Registering User');
        }
      })
      .catch((err) => {
        alert('Error Registering User: ' + err.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className='flex justify-center'>
      <div className='flex flex-col items-center mb-5 mt-16'>
        <h1 className='text-4xl font-bold text-center flex flex-col items-center text-gray-700 uppercase'>
          Sign Up
          <hr className='w-60 mt-2 h-1 bg-gray-700 border-0 rounded-lg' />
        </h1>
        <div className='flex flex-col mt-5 gap-5 w-[350px]'>
          <div className='relative'>
            {errors.name && <label className="text-red-500 text-sm">{errors.name}</label>}
            <input
              type='text'
              value={name}
              placeholder='Your Name'
              onChange={(e) => setName(e.target.value)}
              className={`border-2 rounded-lg p-3 placeholder:text-lg w-full text-lg ${errors.name ? 'border-red-500' : ''}`}
            />
          </div>
          
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
          
          <div className='relative'>
            {errors.address && <label className="text-red-500 text-sm">{errors.address}</label>}
            <input
              type='text'
              value={address}
              placeholder='Your Address'
              onChange={(e) => setAddress(e.target.value)}
              className={`border-2 rounded-lg p-3 placeholder:text-lg w-full text-lg ${errors.address ? 'border-red-500' : ''}`}
            />
          </div>
          
          <div className='relative'>
            {errors.contact && <label className="text-red-500 text-sm">{errors.contact}</label>}
            <input
              type='text'
              value={contact}
              placeholder='Your Contact Number'
              onChange={(e) => setContact(e.target.value)}
              className={`border-2 rounded-lg p-3 placeholder:text-lg w-full text-lg ${errors.contact ? 'border-red-500' : ''}`}
            />
          </div>
        </div>

        <button
          className='mt-5 w-[350px] bg-purple-600 p-3 text-white text-2xl rounded-lg'
          type='submit'
        >
          Continue
        </button>
        
        {errors.agreed && <p className="text-red-500 text-sm mt-3">{errors.agreed}</p>}
        
        <p className='mt-3'>
          Already have an account?{' '}
          <Link to='/login'><span className='text-purple-600 font-semibold'>Login here</span></Link>
        </p>

        <div className='flex gap-2 mt-5'>
          <input
            type='checkbox'
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <p>By continuing, I agree to the terms of use and privacy policy.</p>
        </div>
      </div>
    </form>
  );
};

export default LoginSignup;
