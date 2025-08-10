import React, { useState } from "react";
import axios from "axios";

type DropdownOption = "Yes" | "No" | "Maybe" | "Don't know";

interface FormData {
  name: string;
  email: string;
  phone: string;
  sipLumpsum: DropdownOption;
  healthInsurance: DropdownOption;
  termInsurance: DropdownOption;
  twoWheeler: DropdownOption;
  fourWheeler: DropdownOption;
  healthInsuranceExpiry: string;
  termInsuranceExpiry: string;
  twoWInsuranceExpiry: string;
  fourWInsuranceExpiry: string;
  referredBy: string;
}

const dropdownOptions: DropdownOption[] = ["Yes", "No", "Maybe", "Don't know"];

const Form: React.FC = () => {
  const initialFormState: FormData = {
    name: "",
    email: "",
    phone: "",
    sipLumpsum: "No",
    healthInsurance: "No",
    termInsurance: "No",
    twoWheeler: "No",
    fourWheeler: "No",
    healthInsuranceExpiry: "",
    termInsuranceExpiry: "",
    twoWInsuranceExpiry: "",
    fourWInsuranceExpiry: "",
    referredBy: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // Prevent double submit

    setLoading(true);
    try {
      const response = await axios.post(
        "https://form-backend-2024.onrender.com/upload",
        formData
      );
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      setFormData(initialFormState); // Reset form
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6 md:col-span-2">
          Insurance & Investment Form
        </h2>

        {/* Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          />
        </div>

        {/* SIP / Lumpsum */}
        <div>
          <label className="block mb-1">SIP / Lumpsum</label>
          <select
            name="sipLumpsum"
            value={formData.sipLumpsum}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          >
            {dropdownOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Health Insurance */}
        <div>
          <label className="block mb-1">Health Insurance</label>
          <select
            name="healthInsurance"
            value={formData.healthInsurance}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          >
            {dropdownOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {formData.healthInsurance === "Yes" && (
          <div>
            <label className="block mb-1">Health Insurance Expiry</label>
            <input
              type="date"
              name="healthInsuranceExpiry"
              value={formData.healthInsuranceExpiry}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
            />
          </div>
        )}

        {/* Term Insurance */}
        <div>
          <label className="block mb-1">Term Insurance</label>
          <select
            name="termInsurance"
            value={formData.termInsurance}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          >
            {dropdownOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {formData.termInsurance === "Yes" && (
          <div>
            <label className="block mb-1">Term Insurance Expiry</label>
            <input
              type="date"
              name="termInsuranceExpiry"
              value={formData.termInsuranceExpiry}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
            />
          </div>
        )}

        {/* 2-Wheeler */}
        <div>
          <label className="block mb-1">2-Wheeler Insurance</label>
          <select
            name="twoWheeler"
            value={formData.twoWheeler}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          >
            {dropdownOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {formData.twoWheeler === "Yes" && (
          <div>
            <label className="block mb-1">2-Wheeler Insurance Expiry</label>
            <input
              type="date"
              name="twoWInsuranceExpiry"
              value={formData.twoWInsuranceExpiry}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
            />
          </div>
        )}

        {/* 4-Wheeler */}
        <div>
          <label className="block mb-1">4-Wheeler Insurance</label>
          <select
            name="fourWheeler"
            value={formData.fourWheeler}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          >
            {dropdownOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {formData.fourWheeler === "Yes" && (
          <div>
            <label className="block mb-1">4-Wheeler Insurance Expiry</label>
            <input
              type="date"
              name="fourWInsuranceExpiry"
              value={formData.fourWInsuranceExpiry}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
            />
          </div>
        )}

        {/* Referred By */}
        <div className="md:col-span-2">
          <label className="block mb-1">Referred By</label>
          <input
            type="text"
            name="referredBy"
            value={formData.referredBy}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
