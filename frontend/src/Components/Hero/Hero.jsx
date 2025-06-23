import React from 'react'
import { useNavigate } from 'react-router-dom'
import offer_banner from '../Assets/landing.png.png'

const Offers = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div>
            <div className='relative h-[60rem]'>
                <img src={offer_banner} alt="" className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-r from-black-500 ...'></div>
                <div className='absolute inset-y-0 right-20 top-1/2 transform -translate-y-1/2 p-50 w-[35%] flex flex-col justify-center items-end text-right'>
                    <p className='text-white text-4xl font-bold mb-2'>Shop Keyboards</p>
                    <p className='text-white text-5xl font-bold font-inter leading-tight mb-5'>That Click with You</p>
                    <button
                        onClick={() => {
                            navigate('/products')
                        }}
                        className='text-white font-medium mt-2 px-6 py-2 border border-white rounded-lg tracking-widest uppercase hover:bg-white hover:text-black transition-all'
                    >
                        SHOP NOW
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Offers
