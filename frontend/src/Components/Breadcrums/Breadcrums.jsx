import React, { useEffect, useState } from 'react'
import API from '../../API';

const Breadcrums = (props) => {
    const {product}=props;
    const [category,setCategory]=useState([])

    useEffect(()=>{
      API.get('/category').then(res=>{
        setCategory(res.data)
      })
    },[])

    const getCategoryName=(e)=>{
      const cat=category.find((c)=>c._id===e)
      return cat ? cat.cat_name :"unknown"
    }
  return (
    <div className='flex gap-1 p-8 font-semibold text-lg text-gray-600'>
      <p>HOME</p> &#62; <p>SHOP</p> &#62;<p className='uppercase'>{getCategoryName(product.categoryId)}</p>&#62;<p className='capitalize'>{product.name}</p>
    </div>
  )
}

export default Breadcrums
