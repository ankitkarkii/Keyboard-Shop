import React, { useState, useEffect } from 'react'
import Sidebar from '../Components/Sidebar/Sidebar'
import API from '../API'

const AddProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [old_price, setOldPrice] = useState("");
  const [new_price, setNewPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // New state variables for options
  const [connectivityOptions, setConnectivityOptions] = useState([]);
  const [connectivityId, setConnectivityId] = useState("");
  const [lightingOptions, setLightingOptions] = useState([]);
  const [lightingId, setLightingId] = useState("");
  const [pollingRateOptions, setPollingRateOptions] = useState([]);
  const [pollingRateId, setPollingRateId] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [colorId, setColorId] = useState("");
  const [bodyMaterialOptions, setBodyMaterialOptions] = useState([]);
  const [bodyMaterialId, setBodyMaterialId] = useState("");

  const getCategory = () => {
    API.get('/category').then(res => {
      setCategory(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  const getConnectivityOptions = () => {
    API.get('/connectivity').then(res => {
      setConnectivityOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  const getLightingOptions = () => {
    API.get('/lighting').then(res => {
      setLightingOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  const getPollingRateOptions = () => {
    API.get('/pollingRate').then(res => {
      setPollingRateOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  const getColorOptions = () => {
    API.get('/color').then(res => {
      setColorOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  const getBodyMaterialOptions = () => {
    API.get('/bodyMaterial').then(res => {
      setBodyMaterialOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  }

  useEffect(() => {
    getCategory();
    getConnectivityOptions();
    getLightingOptions();
    getPollingRateOptions();
    getColorOptions();
    getBodyMaterialOptions();

    // Set default selected values to empty string for blank selection
    setCategoryId("");
    setConnectivityId("");
    setLightingId("");
    setPollingRateId("");
    setColorId("");
    setBodyMaterialId("");
  }, []);

  const insertProduct = (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append('name', name);
    data.append('categoryId', categoryId);
    data.append('old_price', old_price);
    data.append('new_price', new_price);
    data.append('description', description);
    data.append('quantity', quantity);
    data.append('image', image);

    // Append new attribute IDs
    data.append('connectivity', connectivityId);
    data.append('lighting', lightingId);
    data.append('polling_rate', pollingRateId);
    data.append('color', colorId);
    data.append('body_material', bodyMaterialId);

    API.post('/product', data).then(res => {
      if (res.data.success) {
        alert("Product Added Successfully");
        setName('');
        setCategoryId('');
        setOldPrice('');
        setNewPrice('');
        setDescription('');
        setQuantity('');
        setImage(null);
        setImagePreview(null);
        setConnectivityId('');
        setLightingId('');
        setPollingRateId('');
        setColorId('');
        setBodyMaterialId('');
      } else {
        alert("Cannot Add Product");
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(file);
  }

  return (
    <div className='flex gap-5'>
      <Sidebar />
      <div className='p-5'>
        <h1 className='text-2xl font-bold font-inter text-gray-800'>Add New Product</h1>
        <div className='flex gap-10'>
          <div className="bg-white  border-4 rounded-lg shadow  mt-7">
            <div className="p-6">
              <form onSubmit={insertProduct}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="product-name" className="text-sm font-medium text-gray-900 block mb-2">Product Name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name} type='text' name="product-name" id="product-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="category" className="text-sm font-medium text-gray-900 block mb-2">Category</label>
                    <select name="category" onChange={(e) => setCategoryId(e.target.value)} id="category" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required value={categoryId}>
                      <option value="" disabled>Select Category</option>
                      {category && category.map((cat, index) => (
                        <option key={index} value={cat._id}>{cat.cat_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="connectivity" className="text-sm font-medium text-gray-900 block mb-2">Connectivity</label>
                    <select name="connectivity" onChange={(e) => setConnectivityId(e.target.value)} id="connectivity" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required value={connectivityId}>
                      <option value="" disabled>Select Connectivity</option>
                      {connectivityOptions && connectivityOptions.map((option) => (
                        <option key={option._id} value={option._id}>{option.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="lighting" className="text-sm font-medium text-gray-900 block mb-2">Lighting</label>
                    <select name="lighting" onChange={(e) => setLightingId(e.target.value)} id="lighting" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required value={lightingId}>
                      <option value="" disabled>Select Lighting</option>
                      {lightingOptions && lightingOptions.map((option) => (
                        <option key={option._id} value={option._id}>{option.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="pollingRate" className="text-sm font-medium text-gray-900 block mb-2">Polling Rate</label>
                    <select name="pollingRate" onChange={(e) => setPollingRateId(e.target.value)} id="pollingRate" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required value={pollingRateId}>
                      <option value="" disabled>Select Polling Rate</option>
                      {pollingRateOptions && pollingRateOptions.map((option) => (
                        <option key={option._id} value={option._id}>{option.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="color" className="text-sm font-medium text-gray-900 block mb-2">Color</label>
                    <select name="color" onChange={(e) => setColorId(e.target.value)} id="color" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required value={colorId}>
                      <option value="" disabled>Select Color</option>
                      {colorOptions && colorOptions.map((option) => (
                        <option key={option._id} value={option._id}>{option.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="bodyMaterial" className="text-sm font-medium text-gray-900 block mb-2">Body Material</label>
                    <select name="bodyMaterial" onChange={(e) => setBodyMaterialId(e.target.value)} id="bodyMaterial" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required value={bodyMaterialId}>
                      <option value="" disabled>Select Body Material</option>
                      {bodyMaterialOptions && bodyMaterialOptions.map((option) => (
                        <option key={option._id} value={option._id}>{option.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label htmlFor="old_price" className="text-sm font-medium text-gray-900 block mb-2">Old Price</label>
                    <input type="number" onChange={(e) => setOldPrice(e.target.value)} value={old_price} name="old_price" min={1} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                  </div>
                  <div className="col-span-3">
                    <label htmlFor="new_price" className="text-sm font-medium text-gray-900 block mb-2">New Price</label>
                    <input type="number" name="new_price" onChange={(e) => setNewPrice(e.target.value)} value={new_price} min={1} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                  </div>

                  <div className="col-span-3">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-900 block mb-2">Quantity</label>
                    <input type="number" name="quantity" onChange={(e) => setQuantity(e.target.value)} value={quantity} min={1} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                  </div>
                  <div className="col-span-3">
                    <label htmlFor="image" className="text-sm font-medium text-gray-900 block mb-2">Image</label>
                    <div className='flex gap-5'>
                      <input
                        id="imageInput"
                        type="file"
                        name="image"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={handleImageChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label htmlFor="product-details" className="text-sm font-medium text-gray-900 block mb-2">Product Description</label>
                    <textarea id="product-details" rows="6" onChange={(e) => setDescription(e.target.value)} value={description} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4" ></textarea>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 rounded-b">
                  <button className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="submit">Add Product</button>
                </div>
              </form>
            </div>
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mt-7 w-[20%] h-[20%] border-2 p-4 rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;

