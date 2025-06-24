import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../Context/ShopContext'
import {useParams} from 'react-router-dom'
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import API from '../API';

const Product = () => {
  const {productId}=useParams();
  const [product,setProduct]=useState([]);
  const [related, setRelated] = useState([])

  useEffect(()=>{
    API.get(`/product/${productId}`).then(res=>{
      setProduct(res.data);

      // Fetch related products filtered by category
      if (res.data && res.data.categoryId) {
        API.get(`/product/related?categoryId=${res.data.categoryId}&price=${res.data.new_price}&productId=${res.data._id}`).then(relRes => {
          setRelated(relRes.data);
        });
      } else {
        setRelated([]);
      }
    })
  },[productId])

  return (
    <div>
      <Breadcrums product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox product={product} />
      <RelatedProducts product={related}/>
    </div>
  )
}

export default Product
