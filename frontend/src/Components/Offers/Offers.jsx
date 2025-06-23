import React from 'react'
import { useNavigate } from 'react-router-dom'
import offer_banner from '../Assets/offers_banner.png'

const Offers = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div>
            <div className='relative h-[30rem]'>
                <img src={offer_banner} alt="" className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-r from-black-500 ...'></div>
                <div className='absolute inset-0 ml-20 p-10 w-[40%] flex flex-col justify-center items-start'>
                    <p className='text-5xl text-white font-semibold font-inter'>Type without a voice</p>
                    <p className='text-white text-3xl font-medium mt-6'> Still somehow heard deeply

</p>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Offers
