import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import API from '../API';

const ShopCategory = (props) => {
  // const {all_product}=useContext(ShopContext);
  const [product,setProduct]= useState([]);
  const [categories,setCategory]=useState([]);

  useEffect(()=>{
    API.get('/product').then(res=>(
      setProduct(res.data)
    ))

    API.get('/category').then(res=>{
      setCategory(res.data)
    })

  },[])

  const getCategoryName = (catId) => {
    const category = categories.find((cat) => cat._id === catId)
    return category ? category.cat_name : "unknown"
  }
  return (
    <div>
      <h1 className='text-4xl font-bold text-center mt-16 flex flex-col items-center text-gray-700 uppercase'>{props.category}<hr className='w-60 mt-2 h-1 bg-gray-700 border-0 rounded-lg' /></h1>

      <div className='grid grid-cols-4 gap-8 my-16 px-7'>
      {product.map((item,i)=>{
          if(props.category===getCategoryName(item.categoryId)){
          return <Item key={i} id={item._id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        }else{
          return null;
        }
        
      })}
      </div>
    </div>
  )
}

export default ShopCategory
