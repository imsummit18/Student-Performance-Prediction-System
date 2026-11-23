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
  MenuItem,
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

const AdminEtudiants = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({
    id: null,
    nom: "",
    prénom: "",
    email: "",
    téléphone: "",
    numeroApogee: "",
    classes: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const theme = useTheme();

  // Fetch students and classes from the backend
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsResponse, classesResponse] = await Promise.all([
        api.get(withPagination(endpoints.students.list, page)),
        api.get(withPagination(endpoints.classes.list, 1, 1000)),
      ]);

      const studentsData = await studentsResponse.json();
      const classesData = await classesResponse.json();

      const pagedStudents = unwrapPaginatedList(studentsData);
      setEtudiants(pagedStudents.items);
      setCount(pagedStudents.count);
      setClasses(unwrapPaginatedList(classesData).items);
      setFilteredEtudiants(pagedStudents.items);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Handle filtering students by class
  useEffect(() => {
    if (selectedClass === "All") {
      setFilteredEtudiants(etudiants);
    } else {
      const filtered = etudiants.filter(
        (etudiant) => etudiant.classe && etudiant.classe.nom === selectedClass,
      );
      setFilteredEtudiants(filtered);
    }
  }, [selectedClass, etudiants]);

  // Open dialog for adding/editing a student
  const handleOpenDialog = (etudiant = null) => {
    if (etudiant) {
      setFormData({
        id: etudiant.id,
        nom: etudiant.last_name,
        prénom: etudiant.first_name,
        email: etudiant.email,
        téléphone: etudiant.phone,
        numeroApogee: etudiant.n_appogie,
        classes: etudiant.classe ? [etudiant.classe.nom] : [],
      });
      setEditMode(true);
    } else {
      setFormData({
        id: null,
        nom: "",
        prénom: "",
        email: "",
        téléphone: "",
        numeroApogee: "",
        classes: [],
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
      [name]: name === "classes" ? [value] : value,
    });
  };

  // Submit form (create or update student)
  const handleSubmit = async () => {
    try {
      let response;
      const data = {
        last_name: formData.nom,
        first_name: formData.prénom,
        email: formData.email,
        phone: formData.téléphone,
        n_appogie: formData.numeroApogee,
        classes: formData.classes,
      };

      if (editMode) {
        response = await api.put(endpoints.students.update(formData.id), data);
      } else {
        response = await api.post(endpoints.students.create, data);
      }

      if (response.ok) {
        await fetchStudents();
        setOpenDialog(false);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la sauvegarde");
    }
  };

  // Delete a student
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(endpoints.students.delete(id));

      const data = await response.json();
      if (data.success) {
        await fetchStudents();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError("Failed to delete student");
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
        endpoints.students.import,
        formData,
        true,
      );

      if (response.ok) {
        await fetchStudents();
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
    const headers = [
      "Last Name",
      "First Name",
      "Email",
      "Phone",
      "Apogee Number",
      "Class",
    ];
    let csvContent = headers.join(",") + "\n";

    if (etudiants.length > 0) {
      etudiants.forEach((etudiant) => {
        const row = [
          etudiant.last_name,
          etudiant.first_name,
          etudiant.email,
          etudiant.phone,
          etudiant.n_appogie,
          etudiant.classe ? etudiant.classe.nom : "",
        ];
        csvContent += row.join(",") + "\n";
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_etudiants.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <ManagementHeader
        eyebrow="Student records"
        title="Student Management"
        description="Manage student profiles, Apogee numbers, classes and academic records."
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
              New Student
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
            title="Total Students"
            value={loading ? "—" : count}
            icon={<PersonIcon />}
            color="#10cfc9"
            subtitle="Registered students"
          />
        </Grid>
      </Grid>

      <ManagementTable
        title="All students"
        subtitle={`${filteredEtudiants.length} student${filteredEtudiants.length === 1 ? "" : "s"} displayed`}
        action={
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              maxWidth: 700,
              justifyContent: "flex-end",
            }}
          >
            {["All", ...classes.map((c) => c.nom)].map((classe) => (
              <Button
                key={classe}
                size="small"
                variant={selectedClass === classe ? "contained" : "outlined"}
                onClick={() => setSelectedClass(classe)}
                sx={{
                  borderRadius: "9px",
                  minWidth: 62,
                  px: 1.5,
                  fontWeight: 800,
                  bgcolor: selectedClass === classe ? "#071d35" : "transparent",
                  color: selectedClass === classe ? "white" : "text.secondary",
                  borderColor: "divider",
                  "&:hover": {
                    borderColor: "#10cfc9",
                    bgcolor:
                      selectedClass === classe
                        ? "#0b3154"
                        : "rgba(16,207,201,0.06)",
                  },
                }}
              >
                {classe}
              </Button>
            ))}
          </Box>
        }
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
                    Full Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Apogee Number
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
                    align="center"
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Class
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
                {filteredEtudiants.length > 0 ? (
                  filteredEtudiants.map((etudiant) => (
                    <TableRow
                      key={etudiant.id}
                      hover
                      sx={{
                        "&:last-child td": { border: 0 },
                        "& td": { borderColor: "rgba(7,29,53,0.06)" },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 750 }}>
                        {etudiant.first_name} {etudiant.last_name}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          component="span"
                          sx={{
                            px: 1.25,
                            py: 0.55,
                            borderRadius: "8px",
                            bgcolor: "rgba(82,109,245,0.08)",
                            color: "#526df5",
                            fontWeight: 800,
                            fontSize: "0.82rem",
                          }}
                        >
                          {etudiant.n_appogie}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {etudiant.email}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {etudiant.phone}
                      </TableCell>
                      <TableCell align="center">
                        {etudiant.classe ? (
                          <Typography
                            component="span"
                            sx={{
                              px: 1.25,
                              py: 0.55,
                              borderRadius: "8px",
                              bgcolor: "rgba(16,207,201,0.10)",
                              color: "#087a76",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                            }}
                          >
                            {etudiant.classe.nom}
                          </Typography>
                        ) : (
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: "0.82rem" }}
                          >
                            No class
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpenDialog(etudiant)}
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
                          onClick={() => setDeleteTarget(etudiant)}
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
                      colSpan={6}
                      align="center"
                      sx={{ py: 7, color: "text.secondary" }}
                    >
                      No students available
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
            {editMode ? "Edit Student" : "Create New Student"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Grid container spacing={2} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nom"
                label="Last Name"
                fullWidth
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="prénom"
                label="First Name"
                fullWidth
                value={formData.prénom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="numeroApogee"
                label="Apogee Number"
                fullWidth
                value={formData.numeroApogee}
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
                name="téléphone"
                label="Phone"
                fullWidth
                value={formData.téléphone}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="classes"
                label="Class"
                fullWidth
                value={formData.classes[0] || ""}
                onChange={handleInputChange}
              >
                {classes.map((classe) => (
                  <MenuItem key={classe.nom} value={classe.nom}>
                    {classe.nom}
                  </MenuItem>
                ))}
              </TextField>
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
        title="Delete Student"
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

export default AdminEtudiants;
