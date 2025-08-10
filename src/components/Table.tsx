import React, { useEffect, useState } from "react";

type DataRow = { [key: string]: any };

const API_URL = " https://form-backend-2024.onrender.com/fetch"; // Change to your backend endpoint

const Table: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [fields, setFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const jsonData = await res.json();
        setData(jsonData);
        setFilteredData(jsonData);
        if (jsonData.length > 0) {
          setFields(Object.keys(jsonData[0]));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let temp = [...data];

    if (search) {
      temp = temp.filter((row) =>
        fields.some((field) =>
          String(row[field] || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        temp = temp.filter((row) => String(row[field]) === value);
      }
    });

    setFilteredData(temp);
  }, [search, filters, data, fields]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <p className="text-gray-400 text-center py-4">Loading data...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center">API Data Table</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filters */}
      {fields.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {fields.map((field) => (
            <select
              key={field}
              value={filters[field] || ""}
              onChange={(e) => handleFilterChange(field, e.target.value)}
              className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All {field}</option>
              {[...new Set(data.map((row) => row[field]))].map((val, idx) => (
                <option key={idx} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      {/* Table */}
      {fields.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                {fields.map((field) => (
                  <th
                    key={field}
                    className="px-4 py-2 border-b border-gray-700 text-left text-gray-300"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800 transition-colors">
                  {fields.map((field) => (
                    <td
                      key={field}
                      className="px-4 py-2 border-b border-gray-700"
                    >
                      {String(row[field] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-center">No data available</p>
      )}
    </div>
  );
};

export default Table;
