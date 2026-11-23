import { useState, useEffect } from "react";
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
  MenuItem,
  IconButton,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import SchoolIcon from "@mui/icons-material/School";

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

const AdminMatieres = () => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({
    id: null,
    nom: "",
    coefficient: "",
    semestre: "",
    classe: null,
    enseignant: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [classes, setClasses] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [filters, setFilters] = useState({
    semestre: "",
    classe: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Fetch matieres, classes, and enseignants from the backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [matieresResponse, classesResponse, enseignantsResponse] =
        await Promise.all([
          api.get(withPagination(endpoints.subjects.list, page)),
          api.get(withPagination(endpoints.classes.list, 1, 1000)),
          api.get(withPagination(endpoints.teachers.list, 1, 1000)),
        ]);

      const matieresData = await matieresResponse.json();
      const classesData = await classesResponse.json();
      const enseignantsData = await enseignantsResponse.json();

      const pagedSubjects = unwrapPaginatedList(matieresData);
      setMatieres(pagedSubjects.items);
      setCount(pagedSubjects.count);
      setClasses(unwrapPaginatedList(classesData).items);
      setEnseignants(unwrapPaginatedList(enseignantsData).items);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [page]);

  // Fetch matieres from the backend
  const fetchMatieres = async () => {
    try {
      const response = await api.get(
        withPagination(endpoints.subjects.list, page),
      );
      const data = await response.json();
      const pagedSubjects = unwrapPaginatedList(data);
      setMatieres(pagedSubjects.items);
      setCount(pagedSubjects.count);
    } catch (error) {
      console.error("Error fetching matieres:", error);
      setSnackbar({
        open: true,
        message: "Failed to load subjects",
        severity: "error",
      });
    }
  };

  // Handle CSV file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await api.post(
        endpoints.subjects.import,
        formDataUpload,
        true,
      );

      if (response.ok) {
        fetchMatieres();
        setSnackbar({
          open: true,
          message: "Subjects imported successfully",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        throw new Error(errorData.error || "Failed to import CSV file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbar({
        open: true,
        message: error.message || "Something went wrong",
        severity: "error",
      });
    }
  };

  // Handle downloading the CSV template
  const downloadTemplate = () => {
    const headers = ["Name", "Coefficient", "Semester", "Class", "Email"];
    let csvContent = headers.join(",") + "\n";

    if (matieres.length > 0) {
      matieres.forEach((matiere) => {
        const row = [
          matiere.nom,
          matiere.coefficient,
          matiere.semestre,
          matiere.classe?.nom || "Unknown",
          matiere.enseignant?.email || "Unknown",
        ];
        csvContent += row.join(",") + "\n";
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_matieres.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Open dialog for adding/editing a matiere
  const handleOpenDialog = (matiere = null) => {
    if (matiere) {
      setFormData({
        id: matiere.id,
        nom: matiere.nom,
        coefficient: matiere.coefficient,
        semestre: matiere.semestre,
        classe: matiere.classe?.id || null,
        enseignant: matiere.enseignant?.id || null,
      });
      setEditMode(true);
    } else {
      setFormData({
        id: null,
        nom: "",
        coefficient: "",
        semestre: "",
        classe: null,
        enseignant: null,
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

  // Filter matieres by semester and class
  const filteredMatieres = matieres.filter(
    (matiere) =>
      (filters.semestre === "" ||
        matiere.semestre === parseInt(filters.semestre)) &&
      (filters.classe === "" ||
        matiere.classe?.id === parseInt(filters.classe)),
  );

  const handleSubmit = async () => {
    try {
      const data = {
        nom: formData.nom,
        coefficient: parseFloat(formData.coefficient),
        semestre: parseInt(formData.semestre),
        classe_id: formData.classe,
        enseignant_id: formData.enseignant,
      };

      const response = editMode
        ? await api.put(endpoints.subjects.update(formData.id), data)
        : await api.post(endpoints.subjects.create, data);

      if (response.ok) {
        await fetchMatieres();
        setSnackbar({
          open: true,
          message: editMode
            ? "Subject updated successfully"
            : "Subject created successfully",
          severity: "success",
        });
        handleCloseDialog();
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const response = await api.delete(endpoints.subjects.delete(id));
      const data = await response.json();
      if (data.success) {
        setMatieres((current) =>
          current.filter((matiere) => matiere.id !== id),
        );
        setSnackbar({
          open: true,
          message: "Subject deleted successfully",
          severity: "success",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete subject",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  return (
    <Box>
      <ManagementHeader
        eyebrow="Academic structure"
        title="Subject Management"
        description="Create and organize subjects, coefficients, semesters and assignments."
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
              New Subject
            </Button>
          </Box>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ManagementStat
            title="Total Subjects"
            value={loading ? "—" : count}
            icon={<SchoolIcon />}
            color="#10cfc9"
            subtitle="Registered subjects"
          />
        </Grid>
      </Grid>

      <ManagementTable
        title="All subjects"
        subtitle={`${filteredMatieres.length} subject${filteredMatieres.length === 1 ? "" : "s"} displayed`}
        action={
          <Grid
            container
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Grid item xs={6} sm="auto">
              <TextField
                select
                size="small"
                label="Semester"
                value={filters.semestre}
                onChange={(e) =>
                  setFilters({ ...filters, semestre: e.target.value })
                }
                sx={{ minWidth: 130 }}
              >
                <MenuItem value="">All</MenuItem>
                {[1, 2, 3, 4].map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    Semester {semester}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm="auto">
              <TextField
                select
                size="small"
                label="Class"
                value={filters.classe}
                onChange={(e) =>
                  setFilters({ ...filters, classe: e.target.value })
                }
                sx={{ minWidth: 130 }}
              >
                <MenuItem value="">All</MenuItem>
                {classes.map((classe) => (
                  <MenuItem key={classe.id} value={classe.id}>
                    {classe.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
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
                    Subject Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Coefficient
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Semester
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Class
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}
                  >
                    Teacher
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
                {filteredMatieres.length > 0 ? (
                  filteredMatieres.map((matiere) => (
                    <TableRow
                      key={matiere.id}
                      hover
                      sx={{
                        "&:last-child td": { border: 0 },
                        "& td": { borderColor: "rgba(7,29,53,0.06)" },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 750 }}>
                        {matiere.nom}
                      </TableCell>
                      <TableCell align="center">
                        {matiere.coefficient}
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
                          Semester {matiere.semestre}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {matiere.classe?.nom || "Unknown"}
                      </TableCell>
                      <TableCell align="center">
                        {matiere.enseignant
                          ? `${matiere.enseignant.first_name} ${matiere.enseignant.last_name}`
                          : "Unknown"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpenDialog(matiere)}
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
                          onClick={() => setDeleteTarget(matiere)}
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
                      No subjects available
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
            {editMode ? "Edit Subject" : "Create New Subject"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Grid container spacing={2} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nom"
                label="Subject Name"
                fullWidth
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="coefficient"
                label="Coefficient"
                fullWidth
                type="number"
                value={formData.coefficient}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="semestre"
                label="Semester"
                fullWidth
                value={formData.semestre}
                onChange={handleInputChange}
                required
              >
                {[1, 2, 3, 4].map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    Semester {semester}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="classe"
                label="Class"
                fullWidth
                value={formData.classe || ""}
                onChange={handleInputChange}
                required
              >
                {classes.map((classe) => (
                  <MenuItem key={classe.id} value={classe.id}>
                    {classe.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                name="enseignant"
                label="Teacher"
                fullWidth
                value={formData.enseignant || ""}
                onChange={handleInputChange}
                required
              >
                {enseignants.map((enseignant) => (
                  <MenuItem key={enseignant.id} value={enseignant.id}>
                    {enseignant.first_name} {enseignant.last_name}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <DeleteConfirmationDialog
        open={!!deleteTarget}
        title="Delete Subject"
        name={deleteTarget?.nom}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          await handleDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Box>
  );
};

export default AdminMatieres;
