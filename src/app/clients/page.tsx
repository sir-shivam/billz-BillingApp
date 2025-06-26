"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
  clientName: string;
  contact: string;
  prevBalance: any;
  lastPaidAmount: any;
}

export default function CreateClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    contact: "",
    prevBalance: "",
    lastPaidAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "prevBalance" || name === "lastPaidAmount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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
        setSuccess("✅ Client created successfully!");
        setFormData({
          clientName: "",
          contact: "",
          prevBalance: 0,
          lastPaidAmount: 0,
        });
      } else {
        setError(result.error || "❌ Failed to create client.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("❌ An error occurred while creating the client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
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
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        
        <h1 className="text-2xl font-bold text-center mb-6">Create New Client</h1>

        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            disabled={loading}
          />

          <InputField
            label="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            disabled={loading}
          />

          

          <InputField
            label="Previous Balance"
            name="prevBalance"
            type="number"
            value={formData.prevBalance}
            onChange={handleChange}
            disabled={loading}
          />

          <InputField
            label="Last Paid Amount"
            name="lastPaidAmount"
            type="number"
            value={formData.lastPaidAmount}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Creating...</span>
              </span>
            ) : (
              "Create Client"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Reusable input component
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        className="mt-1 block p-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
}
