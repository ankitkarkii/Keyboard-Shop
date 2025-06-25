import React, {useState, useEffect} from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Recommendation/Recommendation'
import NewCollection from '../Components/NewCollections/NewCollection'
import Offers from '../Components/Offers/Offers'
import API from '../API';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [product, setProduct] = useState([])
  const [personalized, setPersonalized] = useState(false)
  const [category, setCategory] = useState('')
  const [newProducts, setNewProducts] = useState([])
  const location = useLocation();

  useEffect(()=>{
    const views = JSON.parse(localStorage.getItem('recentKeyboardViews') || '[]');
    if (views.length > 0) {
      const { productId, category: keyboard_category, price: keyboard_price } = views[0]; // most recent
      if (keyboard_category && keyboard_price) {
        setPersonalized(true);
        setCategory(keyboard_category);
        API.get('/product/recommendations', {
          params: {
            category: keyboard_category,
            price: keyboard_price,
            productId: productId,
          }
        }).then(res => setProduct(res.data))
          .catch(() => {
            setPersonalized(false);
            API.get('/product/related').then(res=>{
              setProduct(res.data)
            })
          });
        return;
      }
    }
    setPersonalized(false);
    API.get('/product/related').then(res=>{
      setProduct(res.data)
    })
  },[location])

  useEffect(() => {
    // Fetch newest products for New Collections
    API.get('/product').then(res => {
      // Sort by date descending (newest first)
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNewProducts(sorted.slice(0, 4));
    })
  }, [])

  return (
    <div>
      <Hero />
      <Popular products={product} personalized={personalized} category={category} />
      
      <NewCollection product={newProducts} />
      <Offers />
    </div>
  )
}

export default Home
