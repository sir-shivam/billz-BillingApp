"use client"
import { useState } from "react";

interface FormData {
  clientName: string;
  contact: string;
  email: string;
  prevBalance: number;
  lastPaidAmount: number;
}

export default function CreateClient() {
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    contact: "",
    email: "",
    prevBalance: 0,
    lastPaidAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "prevBalance" || name === "lastPaidAmount" ? value : value, // Temporarily store as string
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/clients/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Client created successfully!");
        setFormData({
          clientName: "",
          contact: "",
          email: "",
          prevBalance: 0,
          lastPaidAmount:0 ,
        });
      } else {
        setMessage(result.error || "Failed to create client");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while creating the client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create New Client</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 p-2  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 ">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block p-2  w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="prevBalance" className="block text-sm font-medium text-gray-700">
              Previous Balance
            </label>
            <input
              type="number"
              id="prevBalance"
              name="prevBalance"
              value={formData.prevBalance}
              onChange={handleChange}
              className="mt-1 block p-2  w-full rounded-md border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="lastPaidAmount" className="block text-sm font-medium text-gray-700">
              Last Paid Amount
            </label>
            <input
              type="number"
              id="lastPaidAmount"
              name="lastPaidAmount"
              value={formData.lastPaidAmount}
              onChange={handleChange}
              className="mt-1 block p-2  w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Creating..." : "Create Client"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}
