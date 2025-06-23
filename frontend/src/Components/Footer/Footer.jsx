import React from 'react'


const Footer = () => {
    return (
        <div className='pt-10 my-5 flex flex-col items-center gap-5 border-t-2'>
            <div className='h-20 flex items-center gap-5'>
               
                <p className='text-4xl font-bold font-[Poppins]'>Clickify</p>
            </div>
            <ul className='flex justify-evenly w-1/3 hover:cursor-pointer'>
                <li>Company</li>
                <li>Products</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
            
            <div className='mt-5 w-full flex flex-col gap-5 items-center'>
                <hr className='w-[70%] h-[2px] bg-gray-500 rounded-full border-0'/>
                <p>Copyright &copy; 2024 - All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer
