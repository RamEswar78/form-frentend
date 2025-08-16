import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit, Delete, FilterList } from "@mui/icons-material";

type DataRow = { [key: string]: any };

const API_URL = "https://form-backend-2024.onrender.com/fetch";
const UPDATE_URL = "https://form-backend-2024.onrender.com/update";

type Order = "asc" | "desc";

// Convert camelCase to Readable Format
const formatHeader = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1") // insert space before caps
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
};

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  // Filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Edit
  const [editOpen, setEditOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<DataRow | null>(null);

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

  // Sorting handler
  const handleSort = (field: string) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);

    const sorted = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? -1 : 1;
      if (a[field] > b[field]) return isAsc ? 1 : -1;
      return 0;
    });
    setFilteredData(sorted);
  };

  // Apply filters
  const applyFilters = () => {
    let temp = [...data];

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

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      temp = temp.filter((row) => {
        if (!row.healthInsuranceExpiry) return false;
        const expiryDate = new Date(row.healthInsuranceExpiry);
        if (start && expiryDate < start) return false;
        if (end && expiryDate > end) return false;
        return true;
      });
    }

    setFilteredData(temp);
    setFilterOpen(false);
  };

  // Delete row
  const handleDelete = async (phone: string) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`https://form-backend-2024.onrender.com/delete/${phone}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((row) => row.phone !== phone));
      setFilteredData((prev) => prev.filter((row) => row.phone !== phone));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Open edit modal
  const handleEdit = (row: DataRow) => {
    setCurrentRow(row);
    setEditOpen(true);
  };

  // Save updated record
  const handleSaveEdit = async () => {
    if (!currentRow) return;
    try {
      const res = await fetch(`${UPDATE_URL}/${currentRow.phone}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentRow),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedRow = await res.json();

      setData((prev) =>
        prev.map((row) => (row.phone === updatedRow.phone ? updatedRow : row))
      );
      setFilteredData((prev) =>
        prev.map((row) => (row.phone === updatedRow.phone ? updatedRow : row))
      );

      setEditOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading data...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        API Data Table
      </h2>

      {/* Filter Button */}
      <Button
        startIcon={<FilterList />}
        variant="contained"
        onClick={() => setFilterOpen(true)}
        style={{ marginBottom: "16px" }}
      >
        Filters
      </Button>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} fullWidth>
        <DialogTitle>Apply Filters</DialogTitle>
        <DialogContent>
          <TextField
            label="Search by Name"
            fullWidth
            margin="normal"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <TextField
            label="Search by Email"
            fullWidth
            margin="normal"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <TextField
            label="Search by Phone"
            fullWidth
            margin="normal"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />
          <TextField
            type="date"
            fullWidth
            margin="normal"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            type="date"
            fullWidth
            margin="normal"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={applyFilters}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell key={field}>
                  <TableSortLabel
                    active={orderBy === field}
                    direction={orderBy === field ? order : "asc"}
                    onClick={() => handleSort(field)}
                  >
                    {formatHeader(field)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, idx) => (
              <TableRow key={idx} hover>
                {fields.map((field) => (
                  <TableCell key={field}>{row[field]}</TableCell>
                ))}
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(row)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.phone)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={fields.length + 1} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle>Edit Record</DialogTitle>
        <DialogContent>
          {currentRow &&
            fields.map((field) => (
              <TextField
                key={field}
                label={formatHeader(field)}
                fullWidth
                margin="normal"
                value={currentRow[field] || ""}
                onChange={(e) =>
                  setCurrentRow((prev) =>
                    prev ? { ...prev, [field]: e.target.value } : prev
                  )
                }
                disabled={field === "phone"} // lock phone
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataTable;
