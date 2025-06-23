import React, { useState } from 'react'

const DescriptionBox = (props) => {
  const { product } = props
  const [activeTab, setActiveTab] = useState('description')

  const renderTableRow = (label, items) => {
    if (!items || items.length === 0) return null;
    const values = items.map(item => item.name || item).join(', ')
    return (
      <tr key={label} className="border-b">
        <td className="py-2 px-4 font-semibold text-gray-700">{label}</td>
        <td className="py-2 px-4 text-gray-600">{values}</td>
      </tr>
    )
  }

  return (
    <div className='px-20 mt-10'>
      <div className='flex border-b border-gray-300 mb-4'>
        <button
          className={`mr-6 pb-2 text-lg font-medium ${activeTab === 'description' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`pb-2 text-lg font-medium ${activeTab === 'additional' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('additional')}
        >
          Specification
        </button>
      </div>

      {activeTab === 'description' && (
        <div className='w-2/3 p-5 border'>
          <p className='text-justify'>
            {product.description}
          </p>
        </div>
      )}

      {activeTab === 'additional' && (
        <div className='w-2/3 p-5 border'>
          <table className="w-full border-collapse">
            <tbody>
              {renderTableRow('Connectivity', product.connectivity)}
              {renderTableRow('Body Materials', product.body_material)}
              {renderTableRow('Colors', product.color)}
              {renderTableRow('Lightings', product.lighting)}
              {renderTableRow('Polling Rates', product.polling_rate)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DescriptionBox
