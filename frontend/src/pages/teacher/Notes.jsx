import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  useTheme,
} from "@mui/material";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";

import TeacherNoteDialog from "./notes/TeacherNoteDialog";
import TeacherNotesTable from "./notes/TeacherNotesTable";
import TeacherNotesToolbar from "./notes/TeacherNotesToolbar";
import { useTeacherNotes } from "./notes/useTeacherNotes";
import {
  ManagementHeader,
  ManagementStat,
  ManagementTable,
} from "../../components/ManagementUI";

const TeacherNotes = () => {
  const theme = useTheme();
  const {
    closeSnackbar,
    downloadTemplate,
    editMode,
    formData,
    handleCloseDialog,
    handleDelete,
    handleFileUpload,
    handleInputChange,
    handleMatiereFilterChange,
    handleOpenDialog,
    handleSubmit,
    loading,
    matieres,
    notes,
    openDialog,
    selectedMatiere,
    snackbar,
    students,
  } = useTeacherNotes();

  const getScoreColor = (score) => {
    if (!score && score !== 0) return theme.palette.text.secondary;
    if (score >= 16) return theme.palette.success.main;
    if (score >= 12) return theme.palette.primary.main;
    if (score >= 8) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box>
      <ManagementHeader
        eyebrow="Academic records"
        title="Grade Management"
        description="Assign, edit and monitor student grades by subject."
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ManagementStat
            title="Grade Records"
            value={loading ? "—" : notes.length}
            icon={<GradeOutlinedIcon />}
            color="#10cfc9"
            subtitle="Registered grade records"
          />
        </Grid>
      </Grid>

      <ManagementTable
        title="Grade records"
        subtitle={
          selectedMatiere
            ? "Selected subject grades"
            : "Select a subject to display grades"
        }
      >
        <TeacherNotesToolbar
          matieres={matieres}
          onDownloadTemplate={downloadTemplate}
          onFileUpload={handleFileUpload}
          onMatiereChange={handleMatiereFilterChange}
          selectedMatiere={selectedMatiere}
          inTableHeader
        />

        {loading ? (
          <Box sx={{ height: 300, display: "grid", placeItems: "center" }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TeacherNotesTable
            getScoreColor={getScoreColor}
            notes={notes}
            onDelete={handleDelete}
            onEdit={handleOpenDialog}
            selectedMatiere={selectedMatiere}
            students={students}
          />
        )}
      </ManagementTable>

      <TeacherNoteDialog
        editMode={editMode}
        formData={formData}
        onChange={handleInputChange}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        open={openDialog}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherNotes;
