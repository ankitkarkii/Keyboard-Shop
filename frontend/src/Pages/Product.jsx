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
    })

    API.get('/product/related').then(res=>{
      setRelated(res.data)
    })
  },[])

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
