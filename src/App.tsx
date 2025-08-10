import React, { useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";

export default function App() {
  const [view, setView] = useState<"form" | "table">("form");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setView("form")}
          className={`px-6 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400
            ${
              view === "form"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
        >
          Form
        </button>
        <button
          onClick={() => setView("table")}
          className={`px-6 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-400
            ${
              view === "table"
                ? "bg-green-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
        >
          Table
        </button>
      </div>

      {/* Component View */}
      <div className="max-w-5xl mx-auto">
        {view === "form" && <Form />}
        {view === "table" && <Table />}
      </div>
    </div>
  );
}
