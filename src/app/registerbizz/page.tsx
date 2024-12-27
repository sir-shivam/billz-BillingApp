"use client"

import { useState} from "react";
import { useRouter } from "next/navigation";

const RegisterBusiness = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !address ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/registerbizz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
           // Send the logged-in user's ID
          address,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.status === 200) {
        router.push("/dashboard"); // Redirect to the dashboard after successful registration
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      setError(`${error}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-black">
      <h2 className="text-xl font-semibold mb-4">Register Your Business</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Business Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white ${loading ? "bg-gray-500" : "bg-green-600"} rounded-md`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Register Business"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterBusiness;
