"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddStock = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newStock = { name, quantity, price };

    try {
      const response = await axios.post("/api/stock/create", newStock);
      console.log("Stock added:", response.data);
    } catch (error) {
      console.error("Error adding stock:", error);
      setError(`${error}` || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-black">
      <div className="h-full   rounded  justify-around flex w-full mb-2  ">  
            <button 
                onClick={() => router.push('/invoicing')}
                className="px-4 py-2 h-full  text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-purple-800 hover:bg-green-300 transition-colors">
                  Crete Bill ➕
                </button>
                <button 
                onClick={() => router.push('/stocks/new')}
                className="px-4 py-2 h-full  text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-purple-800 hover:bg-green-300 transition-colors">
                  🍒 ➕
                </button>

                <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 h-full  text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:text-purple-800 hover:bg-green-300 transition-colors">
                  DashBoard
                </button>

              </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Add Stock
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium"
            >
              Stock Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-gray-700 font-medium"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-medium rounded-md transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Adding..." : "Add Stock"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStock;
