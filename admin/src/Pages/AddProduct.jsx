import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import API from '../API';

const AddProduct = () => {
  const initialProductState = {
    name: "",
    categoryId: "",
    old_price: "",
    new_price: "",
    description: "",
    quantity: "",
    image: [],
    connectivity: [],
    lighting: [],
    polling_rate: [],
    color: [],
    body_material: []
  };

  const [product, setProduct] = useState(initialProductState);
  const [category, setCategory] = useState([]);
  const [connectivityOptions, setConnectivityOptions] = useState([]);
  const [lightingOptions, setLightingOptions] = useState([]);
  const [pollingRateOptions, setPollingRateOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [bodyMaterialOptions, setBodyMaterialOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = (id, selectedIds, name) => {
    let updated = selectedIds.includes(id)
      ? selectedIds.filter(item => item !== id)
      : [...selectedIds, id];

    setProduct({ ...product, [name]: updated });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, image: files });

    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => setImagePreview(results));
  };

  const getCategory = () => {
    API.get('/category').then(res => {
      setCategory(res.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const getConnectivityOptions = () => {
    API.get('/connectivity').then(res => {
      setConnectivityOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const getLightingOptions = () => {
    API.get('/lighting').then(res => {
      setLightingOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const getPollingRateOptions = () => {
    API.get('/pollingRate').then(res => {
      setPollingRateOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const getColorOptions = () => {
    API.get('/color').then(res => {
      setColorOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  };

  const getBodyMaterialOptions = () => {
    API.get('/bodyMaterial').then(res => {
      setBodyMaterialOptions(res.data);
    }).catch(err => {
      console.error(err);
    });
  };

  useEffect(() => {
    getCategory();
    getConnectivityOptions();
    getLightingOptions();
    getPollingRateOptions();
    getColorOptions();
    getBodyMaterialOptions();
  }, []);

  const insertProduct = (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append('name', product.name);
    data.append('categoryId', product.categoryId);
    data.append('old_price', product.old_price);
    data.append('new_price', product.new_price);
    data.append('description', product.description);
    data.append('quantity', product.quantity);

    product.image.forEach(image => {
      data.append('images', image);
    });

    product.connectivity.forEach(id => data.append('connectivity', id));
    product.lighting.forEach(id => data.append('lighting', id));
    product.polling_rate.forEach(id => data.append('polling_rate', id));
    product.color.forEach(id => data.append('color', id));
    product.body_material.forEach(id => data.append('body_material', id));

    API.post('/product', data).then(res => {
      if (res.data.success) {
        alert("Product Added Successfully");
        setProduct(initialProductState);
        setImagePreview([]);
      } else {
        alert("Cannot Add Product");
      }
    }).catch(err => {
      console.log(err);
    });
  };

  const renderCheckboxGroup = (label, options, selected, key) => (
    <div className="col-span-6 sm:col-span-3">
      <label className="text-sm font-medium text-gray-900 block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded p-2 bg-gray-50">
        {options.map(opt => (
          <label key={opt._id} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              value={opt._id}
              checked={selected.includes(opt._id)}
              onChange={() => handleCheckboxChange(opt._id, selected, key)}
              className="form-checkbox h-4 w-4 text-cyan-600"
            />
            <span className="ml-2 text-gray-700">{opt.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex gap-5">
      <Sidebar />
      <div className="p-5 w-full">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <form onSubmit={insertProduct} className="bg-white border-4 rounded-lg shadow mt-7 p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Product Name</label>
              <input
                onChange={inputChangeHandler}
                value={product.name}
                type="text"
                name="name"
                id="name"
                className="input-class"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-900 mb-2">Category</label>
              <select
                name="categoryId"
                onChange={inputChangeHandler}
                id="categoryId"
                className="input-class"
                required
                value={product.categoryId}
              >
                <option value="" disabled>Select Category</option>
                {category && category.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.cat_name}</option>
                ))}
              </select>
            </div>
            {renderCheckboxGroup("Connectivity", connectivityOptions, product.connectivity, 'connectivity')}
            {renderCheckboxGroup("Lighting", lightingOptions, product.lighting, 'lighting')}
            {renderCheckboxGroup("Polling Rate", pollingRateOptions, product.polling_rate, 'polling_rate')}
            {renderCheckboxGroup("Color", colorOptions, product.color, 'color')}
            {renderCheckboxGroup("Body Material", bodyMaterialOptions, product.body_material, 'body_material')}
            <div className="col-span-3">
              <label htmlFor="old_price" className="block text-sm font-medium text-gray-900 mb-2">Old Price</label>
              <input
                type="number"
                name="old_price"
                id="old_price"
                min={1}
                onChange={inputChangeHandler}
                value={product.old_price}
                className="input-class"
                required
              />
            </div>
            <div className="col-span-3">
              <label htmlFor="new_price" className="block text-sm font-medium text-gray-900 mb-2">New Price</label>
              <input
                type="number"
                name="new_price"
                id="new_price"
                min={1}
                onChange={inputChangeHandler}
                value={product.new_price}
                className="input-class"
                required
              />
            </div>
            <div className="col-span-3">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                min={1}
                onChange={inputChangeHandler}
                value={product.quantity}
                className="input-class"
                required
              />
            </div>
            <div className="col-span-6">
              <label htmlFor="images" className="block text-sm font-medium text-gray-900 mb-2">Images</label>
              <input
                id="images"
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
                className="input-class"
                required
              />
              <div className="flex gap-4 mt-2 flex-wrap">
                {imagePreview.length > 0 && imagePreview.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Image Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">Product Description</label>
              <textarea
                id="description"
                rows="6"
                onChange={inputChangeHandler}
                value={product.description}
                name="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
