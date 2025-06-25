import React, { useContext, useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import Recommendation from '../Components/Recommendation/Recommendation';
import API from '../API';

const Product = () => {
  const {productId}=useParams();
  const [product,setProduct]=useState([]);
  const [related, setRelated] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(()=>{
    API.get(`/product/${productId}`).then(res=>{
      setProduct(res.data);

      // Fetch related products filtered by category
      if (res.data && res.data.categoryId) {
        API.get(`/product/related?categoryId=${res.data.categoryId}&price=${res.data.new_price}&productId=${res.data._id}`).then(relRes => {
          setRelated(relRes.data);
        });
        // Fetch recommendations for this product
        API.get('/product/recommendations', {
          params: {
            category: res.data.categoryId,
            price: res.data.new_price,
            productId: res.data._id
          }
        }).then(recRes => setRecommendations(recRes.data));
      } else {
        setRelated([]);
        setRecommendations([]);
      }
    })
  },[productId])

  return (
    <div>
      <Breadcrums product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox product={product} />
      {recommendations && recommendations.length > 0 && (
        <Recommendation products={recommendations} personalized={true} category={product.categoryId} />
      )}
      <RelatedProducts product={related}/>
    </div>
  )
}

export default Product
