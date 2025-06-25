import React, { useEffect, useState } from 'react'
import Item from '../Item/Item'
import axios from 'axios'

function Recommendation(props) {
  const { products, personalized, category } = props
  const [recommendedProducts, setRecommendedProducts] = useState([])

  // Helper function to get viewed products from localStorage
  const getViewedProducts = () => {
    const viewed = localStorage.getItem('viewedProducts')
    return viewed ? JSON.parse(viewed) : []
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      const viewedProducts = getViewedProducts()
      try {
        // Call backend API with viewed product IDs as query param
        const response = await axios.get('http://localhost:3000/product/recommendations', {
          params: { viewed: viewedProducts.join(',') }
        })
        setRecommendedProducts(response.data)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        // Fallback to first 8 products if API call fails
        setRecommendedProducts(products.slice(0, 8))
      }
    }
    // Only fetch if not personalized (personalized handled by Home)
    if (!personalized) fetchRecommendations()
    else setRecommendedProducts(products)
  }, [products, personalized])

  if (!recommendedProducts || recommendedProducts.length === 0) return null;

  return (
    <div id="recommended-products">
      <h1 className='text-4xl font-bold text-center mt-16 flex flex-col items-center text-gray-700'>
        {personalized ? 'Recommended for You' : 'Recommended Products'}
        <hr className='w-60 mt-2 h-1 bg-gray-700 border-0 rounded-lg' />
      </h1>
     
      <div className='grid grid-cols-4 gap-8 my-16 px-7'>
        {recommendedProducts.map((item, i) => {
          const truncatedImage = Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : '';
          return <Item key={i} id={item._id} name={item.name} image={truncatedImage} new_price={item.new_price} old_price={item.old_price} quantity={item.quantity} />
        })}
      </div>
    </div>
  )
}

export default Recommendation

