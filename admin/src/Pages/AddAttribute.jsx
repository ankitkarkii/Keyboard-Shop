import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import API from '../API';

const AddAttribute = () => {
  // State for new attribute inputs
  const [newConnectivity, setNewConnectivity] = useState('');
  const [newLighting, setNewLighting] = useState('');
  const [newPollingRate, setNewPollingRate] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newBodyMaterial, setNewBodyMaterial] = useState('');

  // Handlers to add new attribute options
  const addConnectivity = () => {
    if (!newConnectivity.trim()) return alert('Please enter a connectivity value');
    API.post('/connectivity', { name: newConnectivity.trim() })
      .then(() => {
        setNewConnectivity('');
        alert('Connectivity option added');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to add connectivity option');
      });
  };

  const addLighting = () => {
    if (!newLighting.trim()) return alert('Please enter a lighting value');
    API.post('/lighting', { name: newLighting.trim() })
      .then(() => {
        setNewLighting('');
        alert('Lighting option added');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to add lighting option');
      });
  };

  const addPollingRate = () => {
    if (!newPollingRate.trim()) return alert('Please enter a polling rate value');
    API.post('/pollingRate', { name: newPollingRate.trim() })
      .then(() => {
        setNewPollingRate('');
        alert('Polling rate option added');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to add polling rate option');
      });
  };

  const addColor = () => {
    if (!newColor.trim()) return alert('Please enter a color value');
    API.post('/color', { name: newColor.trim() })
      .then(() => {
        setNewColor('');
        alert('Color option added');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to add color option');
      });
  };

  const addBodyMaterial = () => {
    if (!newBodyMaterial.trim()) return alert('Please enter a body material value');
    API.post('/bodyMaterial', { name: newBodyMaterial.trim() })
      .then(() => {
        setNewBodyMaterial('');
        alert('Body material option added');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to add body material option');
      });
  };

  return (
    <div className="flex gap-5 bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="p-6 w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-8">Add Attributes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connectivity */}
          <div className="bg-white rounded-md shadow-sm p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Connectivity</h2>
            <input
              type="text"
              placeholder="Add new connectivity"
              value={newConnectivity}
              onChange={e => setNewConnectivity(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <button
              onClick={addConnectivity}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Add Connectivity
            </button>
          </div>

          {/* Lighting */}
          <div className="bg-white rounded-md shadow-sm p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Lighting</h2>
            <input
              type="text"
              placeholder="Add new lighting"
              value={newLighting}
              onChange={e => setNewLighting(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <button
              onClick={addLighting}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Add Lighting
            </button>
          </div>

          {/* Polling Rate */}
          <div className="bg-white rounded-md shadow-sm p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Polling Rate</h2>
            <input
              type="text"
              placeholder="Add new polling rate"
              value={newPollingRate}
              onChange={e => setNewPollingRate(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <button
              onClick={addPollingRate}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Add Polling Rate
            </button>
          </div>

          {/* Color */}
          <div className="bg-white rounded-md shadow-sm p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Color</h2>
            <input
              type="text"
              placeholder="Add new color"
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <button
              onClick={addColor}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Add Color
            </button>
          </div>

          {/* Body Material */}
          <div className="bg-white rounded-md shadow-sm p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Body Material</h2>
            <input
              type="text"
              placeholder="Add new body material"
              value={newBodyMaterial}
              onChange={e => setNewBodyMaterial(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <button
              onClick={addBodyMaterial}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Add Body Material
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAttribute;
