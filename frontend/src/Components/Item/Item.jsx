import React from 'react'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <Link to={`/product/${props.id}`}>
      <div onClick={window.scrollTo(0, 0)} className='w-[350px] h-[500px] hover:scale-105 transition-all hover:cursor-pointer border hover:shadow-lg rounded-md'>
        <div className='p-5'><img src={props.image} alt="" /></div>
        <p className='mx-4 mt-5 font-medium '>{props.name}</p>
        <div className='flex gap-5 mx-4 mt-2 items-end'>
          <div className='text-green-600 text-lg font-medium'>
            Rs.{props.new_price}
          </div>
          <div className='text-red-500 line-through text-lg font-medium'>
            Rs.{props.old_price}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1 mx-4">
          {props.quantity > 0 ? "In Stock" : "Out of Stock"}
        </p>
      </div>
    </Link>
  )
}

export default Item
