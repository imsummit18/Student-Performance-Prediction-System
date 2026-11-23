import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";

import {
  api,
  endpoints,
  withPagination,
  unwrapPaginatedList,
} from "../../services/api";
import {
  ManagementHeader,
  ManagementStat,
  ManagementTable,
  ManagementPagination,
} from "../../components/ManagementUI";

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nom: "",
    enseignant_responsable: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [enseignants, setEnseignants] = useState([]);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const theme = useTheme();

  // Fetch classes and enseignants from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [classesResponse, enseignantsResponse] = await Promise.all([
          api.get(withPagination(endpoints.classes.list, page)),
          api.get(withPagination(endpoints.teachers.list, 1, 1000)),
        ]);

        const classesData = await classesResponse.json();
        const enseignantsData = await enseignantsResponse.json();
        const pagedClasses = unwrapPaginatedList(classesData);
        const teacherData = unwrapPaginatedList(enseignantsData);

        setClasses(pagedClasses.items);
        setCount(pagedClasses.count);
        setEnseignants(teacherData.items);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleOpenDialog = (classe = null) => {
    if (classe) {
      setFormData({
        id: classe.id,
        nom: classe.nom,
        enseignant_responsable: classe.enseignant_responsable?.id || null,
      });
      setEditMode(true);
    } else {
      setFormData({
        id: null,
        nom: "",
        enseignant_responsable: null,
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      let response;
      const data = {
        nom: formData.nom,
        enseignant_responsable_id: formData.enseignant_responsable,
      };

      if (editMode) {
        response = await api.put(endpoints.classes.update(formData.id), data);
      } else {
        response = await api.post(endpoints.classes.create, data);
      }

      if (response.ok) {
        // Refresh data
        const updatedClassesResponse = await api.get(endpoints.classes.list);
        const updatedClassesData = await updatedClassesResponse.json();
        const pagedClasses = unwrapPaginatedList(updatedClassesData);
        setClasses(pagedClasses.items);
        setCount(pagedClasses.count);

        setOpenDialog(false);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(endpoints.classes.delete(id));

      const data = await response.json();
      if (data.success) {
        // Refresh data
        const updatedClassesResponse = await api.get(endpoints.classes.list);
        const updatedClassesData = await updatedClassesResponse.json();
        const pagedClasses = unwrapPaginatedList(updatedClassesData);
        setClasses(pagedClasses.items);
        setCount(pagedClasses.count);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError("Failed to delete class");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <Box>
      <ManagementHeader
        eyebrow="Academic structure"
        title="Class Management"
        description="Create and organize classes, and assign responsible teachers."
        action={
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
            New Class
          </Button>
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
            title="Total Classes"
            value={loading ? "—" : classes.length}
            icon={<SchoolIcon />}
            color="#10cfc9"
            subtitle="Existing academic classes"
          />
        </Grid>
      </Grid>

      <ManagementTable
        title="All classes"
        subtitle={`${classes.length} class${
          classes.length === 1 ? "" : "es"
        } in the institution`}
      >
        {loading ? (
          <Box
            sx={{
              height: 300,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(7,29,53,0.025)" }}>
                  <TableCell
                    sx={{
                      fontWeight: 850,
                      color: "#071d35",
                      py: 1.5,
                    }}
                  >
                    Class Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 850,
                      color: "#071d35",
                      py: 1.5,
                    }}
                  >
                    Responsible Teacher
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 850,
                      color: "#071d35",
                      py: 1.5,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.length > 0 ? (
                  classes.map((classe) => (
                    <TableRow
                      key={classe.id}
                      hover
                      sx={{
                        "&:last-child td": { border: 0 },
                        "& td": { borderColor: "rgba(7,29,53,0.06)" },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 750 }}>
                        {classe.nom}
                      </TableCell>
                      <TableCell align="center">
                        {classe.enseignant_responsable ? (
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
                            {classe.enseignant_responsable.first_name}{" "}
                            {classe.enseignant_responsable.last_name}
                          </Typography>
                        ) : (
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: "0.82rem" }}
                          >
                            Not assigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpenDialog(classe)}
                          sx={{
                            mr: 0.5,
                            bgcolor: "rgba(82,109,245,0.08)",
                            color: "#526df5",
                            "&:hover": {
                              bgcolor: "rgba(82,109,245,0.16)",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteTarget(classe)}
                          sx={{
                            bgcolor: "rgba(239,68,68,0.08)",
                            color: "#ef4444",
                            "&:hover": {
                              bgcolor: "rgba(239,68,68,0.16)",
                            },
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
                      colSpan={3}
                      align="center"
                      sx={{ py: 7, color: "text.secondary" }}
                    >
                      No classes available
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
            sx={{
              color: "#071d35",
              fontWeight: 850,
              fontSize: "1.25rem",
            }}
          >
            {editMode ? "Edit Class" : "Create New Class"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Grid container spacing={2} sx={{ mt: 0.25 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nom"
                label="Class Name"
                fullWidth
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="enseignant-label">
                  Responsible Teacher
                </InputLabel>
                <Select
                  labelId="enseignant-label"
                  name="enseignant_responsable"
                  label="Responsible Teacher"
                  value={formData.enseignant_responsable || ""}
                  onChange={handleInputChange}
                >
                  {enseignants.map((enseignant) => (
                    <MenuItem key={enseignant.id} value={enseignant.id}>
                      {enseignant.first_name} {enseignant.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

          {/* <Button
            variant="contained"
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
            New Class
          </Button> */}
          <Button
            onClick={handleSubmit}
            variant="contained"
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
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "18px" } }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
          <Typography
            sx={{
              color: "#071d35",
              fontWeight: 850,
              fontSize: "1.25rem",
            }}
          >
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Typography
            sx={{ color: "text.secondary", mb: 2 }}
          >{`Are you sure you want to delete the class "${deleteTarget?.nom}"? This action cannot be undone.`}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            sx={{ fontWeight: 750, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              minWidth: 110,
              borderRadius: "10px",
              bgcolor: "#d32f2f",
              fontWeight: 800,
              "&:hover": { bgcolor: "#c62828" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminClasses;
