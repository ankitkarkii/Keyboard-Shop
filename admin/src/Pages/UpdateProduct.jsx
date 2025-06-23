import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar/Sidebar';
import API from '../API';

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    API.get(`/product/${id}`).then(res => {
      const data = res.data;
      setProduct({
        ...data,
        connectivity: Array.isArray(data.connectivity) ? data.connectivity : [data.connectivity].filter(Boolean),
        lighting: Array.isArray(data.lighting) ? data.lighting : [data.lighting].filter(Boolean),
        polling_rate: Array.isArray(data.polling_rate) ? data.polling_rate : [data.polling_rate].filter(Boolean),
        color: Array.isArray(data.color) ? data.color : [data.color].filter(Boolean),
        body_material: Array.isArray(data.body_material) ? data.body_material : [data.body_material].filter(Boolean),
        image: Array.isArray(data.image) ? data.image : [data.image].filter(Boolean),
      });
      setImagePreview(Array.isArray(data.image) ? data.image : []);
    });

    API.get('/category').then(res => setCategories(res.data));
    API.get('/connectivity').then(res => setConnectivityOptions(res.data));
    API.get('/lighting').then(res => setLightingOptions(res.data));
    API.get('/pollingRate').then(res => setPollingRateOptions(res.data));
    API.get('/color').then(res => setColorOptions(res.data));
    API.get('/bodyMaterial').then(res => setBodyMaterialOptions(res.data));
  }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('name', product.name);
        formData.append('categoryId', product.categoryId);
        formData.append('old_price', product.old_price);
        formData.append('new_price', product.new_price);
        formData.append('description', product.description);
        formData.append('quantity', product.quantity);

        product.connectivity.forEach(item => formData.append('connectivity', item._id ? item._id : item));
        product.lighting.forEach(item => formData.append('lighting', item._id ? item._id : item));
        product.polling_rate.forEach(item => formData.append('polling_rate', item._id ? item._id : item));
        product.color.forEach(item => formData.append('color', item._id ? item._id : item));
        product.body_material.forEach(item => formData.append('body_material', item._id ? item._id : item));

        if (product.image && product.image.length > 0) {
          product.image.forEach(img => formData.append('images', img));
        }

        API.put(`/product/${id}`, formData)
          .then(res => {
            if (res.data.success) {
              alert('Product updated successfully!');
              navigate('/list');
            }
          })
          .catch(err => console.error(err));
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
        <h1 className="text-2xl font-bold text-gray-800">Update Product</h1>
        <form onSubmit={handleSubmit} className="bg-white border-4 rounded-lg shadow mt-7 p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name || ''}
                onChange={inputChangeHandler}
                required
                className="input-class"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
              <select
                name="categoryId"
                value={product.categoryId || ''}
                onChange={inputChangeHandler}
                required
                className="input-class"
              >
                {categories.map(cat => (
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
              <label className="block text-sm font-medium text-gray-900 mb-2">Old Price</label>
              <input
                type="number"
                name="old_price"
                min={1}
                value={product.old_price || ''}
                onChange={inputChangeHandler}
                required
                className="input-class"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">New Price</label>
              <input
                type="number"
                name="new_price"
                min={1}
                value={product.new_price || ''}
                onChange={inputChangeHandler}
                required
                className="input-class"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                min={0}
                value={product.quantity || ''}
                onChange={inputChangeHandler}
                required
                className="input-class"
              />
            </div>

            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Images</label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
                className="input-class"
              />
              <div className="flex gap-4 mt-2 flex-wrap">
                {imagePreview.map((img, index) => (
                  <img key={index} src={img} alt="Preview" className="w-24 h-24 object-cover rounded border" />
                ))}
              </div>
            </div>
            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">Product Description</label>
              <textarea
                id="description"
                rows="6"
                onChange={inputChangeHandler}
                value={product.description || ''}
                name="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-700"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
