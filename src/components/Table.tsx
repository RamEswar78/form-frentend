import { useEffect, useState } from "react";

// type DataRow = { [key: string]: any };

const API_URL = "https://form-backend-2024.onrender.com/fetch";

const Table: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [dateFields, setDateFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<DataRow | null>(null);
  const [editValues, setEditValues] = useState<DataRow>({});

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const jsonData = await res.json();
        setData(jsonData);
        setFilteredData(jsonData);

        if (jsonData.length > 0) {
          const allFields = Object.keys(jsonData[0]);
          setFields(allFields);

          // Detect date fields by checking if the first row's value parses as a valid date
          const detectedDates = allFields.filter((field) => {
            const val = jsonData[0][field];
            return val && !isNaN(new Date(val).getTime());
          });
          setDateFields(detectedDates);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let temp = [...data];

    // Text search filters
    if (searchName) {
      temp = temp.filter((row) =>
        String(row.name || "")
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }
    if (searchEmail) {
      temp = temp.filter((row) =>
        String(row.email || "")
          .toLowerCase()
          .includes(searchEmail.toLowerCase())
      );
    }
    if (searchPhone) {
      temp = temp.filter((row) =>
        String(row.phone || "")
          .toLowerCase()
          .includes(searchPhone.toLowerCase())
      );
    }

    // Date filtering — only for healthInsuranceExpiry
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate + "T00:00:00") : null;
      const end = endDate ? new Date(endDate + "T23:59:59") : null;

      temp = temp.filter((row) => {
        if (!row.healthInsuranceExpiry) return false;
        const expiryDate = new Date(row.healthInsuranceExpiry);
        if (isNaN(expiryDate.getTime())) return false;
        if (start && expiryDate < start) return false;
        if (end && expiryDate > end) return false;
        return true;
      });
    }

    setFilteredData(temp);
  }, [searchName, searchEmail, searchPhone, startDate, endDate, data]);

  // Delete row
  const handleDelete = async (phone: string) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`https://form-backend-2024.onrender.com/delete/${phone}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((row) => row.phone !== phone));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Start editing
  const handleEdit = (row: DataRow) => {
    setEditRow(row);
    setEditValues(row);
  };

  // Save changes
  const handleSave = async () => {
    if (!editRow) return;
    try {
      await fetch(
        `https://form-backend-2024.onrender.com/update/${editRow.phone}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editValues),
        }
      );
      setData((prev) =>
        prev.map((r) => (r.phone === editRow.phone ? editValues : r))
      );
      setEditRow(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditRow(null);
    setEditValues({});
  };

  if (loading) {
    return <p className="text-gray-400 text-center py-4">Loading data...</p>;
  }

  return (
    <div className="p-6 bg-gray-900  w-full text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center">API Data Table</h2>

      {/* Search Fields */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
        />
        <input
          type="text"
          placeholder="Search by Email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
        />
        <input
          type="text"
          placeholder="Search by Phone..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
        />
      </div>

      {/* Date Range */}
      <div className="flex gap-4 mb-4">
        <div></div>
        <div>
          <label className="block text-sm mb-1">
            healthInsuranceExpiry Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      {fields.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full w-full border border-gray-700 rounded-lg overflow-hidden">
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
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300">
                  Actions
                </th>
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
                      {editRow?.phone === row.phone ? (
                        <input
                          type="text"
                          value={editValues[field] ?? ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [field]: e.target.value,
                            })
                          }
                          className="p-1 rounded bg-gray-700 border border-gray-600 text-gray-200 w-full"
                        />
                      ) : (
                        String(row[field] ?? "")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2 border-b border-gray-700 space-x-2">
                    {editRow?.phone === row.phone ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(row)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row.phone)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="text-center text-gray-400 py-4"
                  >
                    No matching records found
                  </td>
                </tr>
              )}
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

