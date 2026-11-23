import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import PersonIcon from "@mui/icons-material/Person";

import {
  api,
  endpoints,
  withPagination,
  unwrapPaginatedList,
} from "../../services/api";
import {
  DeleteConfirmationDialog,
  ManagementHeader,
  ManagementStat,
  ManagementTable,
  ManagementPagination,
} from "../../components/ManagementUI";

const AdminEnseignants = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const theme = useTheme();

  // Fetch enseignants from the backend
  const fetchEnseignants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        withPagination(endpoints.teachers.list, page),
      );
      const data = await response.json();
      const paged = unwrapPaginatedList(data);
      setEnseignants(paged.items);
      setCount(paged.count);
    } catch (error) {
      console.error("Error fetching enseignants:", error);
      setError("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchEnseignants();
  }, [page]);

  // Open dialog for adding/editing an enseignant
  const handleOpenDialog = (enseignant = null) => {
    if (enseignant) {
      setFormData({
        id: enseignant.id,
        first_name: enseignant.first_name,
        last_name: enseignant.last_name,
        email: enseignant.email,
        phone: enseignant.phone,
      });
      setEditMode(true);
    } else {
      setFormData({
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit form (create or update enseignant)
  const handleSubmit = async () => {
    try {
      let response;
      const data = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
      };

      if (editMode) {
        response = await api.put(endpoints.teachers.update(formData.id), data);
      } else {
        response = await api.post(endpoints.teachers.create, data);
      }

      if (response.ok) {
        await fetchEnseignants();
        setOpenDialog(false);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la sauvegarde");
    }
  };

  // Delete an enseignant
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(endpoints.teachers.delete(id));

      const data = await response.json();
      if (data.success) {
        await fetchEnseignants();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError("Failed to delete teacher");
    }
  };

  // Handle CSV file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        endpoints.teachers.import,
        formData,
        true,
      );

      if (response.ok) {
        await fetchEnseignants();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import CSV file");
      }
    } catch (error) {
      setError(error.message || "Une erreur est survenue");
    }
  };

  // Handle downloading the CSV template
  const downloadTemplate = () => {
    const headers = ["Last Name", "First Name", "Email", "Phone"];
    let csvContent = headers.join(",") + "\n";

    if (enseignants.length > 0) {
      enseignants.forEach((enseignant) => {
        const row = [
          enseignant.last_name,
          enseignant.first_name,
          enseignant.email,
          enseignant.phone,
        ];
        csvContent += row.join(",") + "\n";
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_enseignants.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <ManagementHeader
        eyebrow="Human resources"
        title="Teacher Management"
        description="Manage teacher accounts, contact information and academic assignments."
        action={
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={downloadTemplate}
              sx={{
                minHeight: 48,
                px: 2,
                borderRadius: "12px",
                borderColor: "rgba(255,255,255,0.35)",
                color: "white",
                fontWeight: 800,
                "&:hover": {
                  borderColor: "#56e0da",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Template
            </Button>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                minHeight: 48,
                px: 2,
                borderRadius: "12px",
                borderColor: "rgba(255,255,255,0.35)",
                color: "white",
                fontWeight: 800,
                "&:hover": {
                  borderColor: "#56e0da",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Import CSV
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                minHeight: 48,
                px: 2.5,
                borderRadius: "12px",
                bgcolor: "primary.main",
                color: "#071d35",
                fontWeight: 850,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#56e0da",
                  boxShadow: "0 10px 24px rgba(16,207,201,0.22)",
                },
              }}
            >
              New Teacher
            </Button>
          </Box>
        }
      />

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ManagementStat
            title="Total Teachers"
            value={loading ? "—" : count}
            icon={<PersonIcon />}
            color="#10cfc9"
            subtitle="Registered teachers"
          />
        </Grid>
      </Grid>

      <ManagementTable
        title="All teachers"
        subtitle={`${enseignants.length} teacher${enseignants.length === 1 ? "" : "s"} in the institution`}
      >
        {loading ? (
          <Box sx={{ height: 300, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(7,29,53,0.025)" }}>
                  <TableCell
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Last Name
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    First Name
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enseignants.length > 0 ? (
                  enseignants.map((enseignant) => (
                    <TableRow
                      key={enseignant.id}
                      hover
                      sx={{
                        "&:last-child td": { border: 0 },
                        "& td": { borderColor: "rgba(7,29,53,0.06)" },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 750 }}>
                        {enseignant.last_name}
                      </TableCell>
                      <TableCell>{enseignant.first_name}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {enseignant.email}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {enseignant.phone}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpenDialog(enseignant)}
                          sx={{
                            mr: 0.5,
                            bgcolor: "rgba(82,109,245,0.08)",
                            color: "#526df5",
                            "&:hover": { bgcolor: "rgba(82,109,245,0.16)" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteTarget(enseignant)}
                          sx={{
                            bgcolor: "rgba(239,68,68,0.08)",
                            color: "#ef4444",
                            "&:hover": { bgcolor: "rgba(239,68,68,0.16)" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 7, color: "text.secondary" }}
                    >
                      No teachers available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ManagementTable>
      {count > 10 && (
        <ManagementPagination
          count={count}
          page={page}
          onPageChange={setPage}
        />
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "18px" } }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
          <Typography
            sx={{ color: "#071d35", fontWeight: 850, fontSize: "1.25rem" }}
          >
            {editMode ? "Edit Teacher" : "Create New Teacher"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Grid container spacing={2} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="last_name"
                label="Last Name"
                fullWidth
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="first_name"
                label="First Name"
                fullWidth
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ fontWeight: 750, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              minWidth: 110,
              borderRadius: "10px",
              bgcolor: "#071d35",
              fontWeight: 800,
              "&:hover": { bgcolor: "#10aaa5" },
            }}
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationDialog
        open={!!deleteTarget}
        title="Delete Teacher"
        name={
          deleteTarget
            ? `${deleteTarget.first_name} ${deleteTarget.last_name}`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await handleDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
};

export default AdminEnseignants;
