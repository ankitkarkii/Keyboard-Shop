import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import API from '../API';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');

  const addCategory = () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    API.post('/category', { cat_name: categoryName.trim() })
      .then(() => {
        alert('Category added successfully');
        setCategoryName('');
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to add category');
      });
  };

  return (
    <div className="flex gap-5">
      <Sidebar />
      <div className="p-5 w-full">
        <h1 className="text-2xl font-bold font-inter text-gray-800 mb-6">Add Category</h1>
        <div className="bg-white border-4 rounded-lg shadow p-6 max-w-md">
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            onClick={addCategory}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
