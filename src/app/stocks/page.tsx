'use client'

import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

// Mock data for stock items
const initialStockItems = [
  { id: 1, name: 'Product A', quantity: 100, price: 10 },
  { id: 2, name: 'Product B', quantity: 50, price: 20 },
  { id: 3, name: 'Product C', quantity: 75, price: 15 },
  // Add more mock stock items here...
]

export default function StockManagement() {
  const [stockItems, setStockItems] = useState(initialStockItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleAddStock = (newItem) => {
    setStockItems([...stockItems, { id: stockItems.length + 1, ...newItem }])
    setIsModalOpen(false)
  }

  const handleEditStock = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleUpdateStock = (updatedItem) => {
    setStockItems(stockItems.map(item => item.id === updatedItem.id ? updatedItem : item))
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleDeleteStock = (id) => {
    setStockItems(stockItems.filter(item => item.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <button
          onClick={() => {
            setEditingItem(null)
            setIsModalOpen(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Stock
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{item.name}</h2>
            <p className="text-gray-600 mb-2">Quantity: {item.quantity}</p>
            <p className="text-gray-600 mb-4">Price: ${item.price}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditStock(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded transition duration-300"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeleteStock(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded transition duration-300"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {editingItem ? 'Edit Stock Item' : 'Add Stock Item'}
                </h3>
                <div className="mt-2">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                        Item Name
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        id="itemName"
                        defaultValue={editingItem?.name}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        defaultValue={editingItem?.quantity}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        defaultValue={editingItem?.price}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    const form = document.querySelector('form')
                    const formData = new FormData(form)
                    const newItem = {
                      name: formData.get('itemName'),
                      quantity: parseInt(formData.get('quantity')),
                      price: parseFloat(formData.get('price'))
                    }
                    if (editingItem){
                      handleUpdateStock({ ...editingItem, ...newItem })
                    } else {
                      handleAddStock(newItem)
                    }
                    setIsModalOpen(false)
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingItem(null)
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

