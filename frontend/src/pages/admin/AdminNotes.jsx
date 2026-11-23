import { Alert, Box, CircularProgress, Snackbar, Grid } from "@mui/material";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import {
  ManagementHeader,
  ManagementStat,
  ManagementTable,
  ManagementPagination,
} from "../../components/ManagementUI";

import AdminNoteDialog from "./notes/AdminNoteDialog";
import AdminNotesControls from "./notes/AdminNotesControls";
import AdminNotesTable from "./notes/AdminNotesTable";
import { useAdminNotes } from "./notes/useAdminNotes";

const AdminNotes = () => {
  const {
    closeSnackbar,
    downloadTemplate,
    editMode,
    formData,
    handleCloseDialog,
    handleDelete,
    handleFileUpload,
    handleInputChange,
    handleOpenDialog,
    handleSubmit,
    loading,
    matieres,
    notes,
    openDialog,
    selectedMatiere,
    setSelectedMatiere,
    snackbar,
    students,
    page,
    setPage,
    count,
  } = useAdminNotes();

  return (
    <Box>
      <ManagementHeader
        eyebrow="Academic records"
        title="Grade Management"
        description="Manage student grades, assignments and attendance by subject."
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ManagementStat
            title="Total Grades"
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
        <AdminNotesControls
          matieres={matieres}
          onAdd={() => handleOpenDialog()}
          onDownloadTemplate={downloadTemplate}
          onFileUpload={handleFileUpload}
          onMatiereChange={setSelectedMatiere}
          selectedMatiere={selectedMatiere}
          inTableHeader
        />

        {loading ? (
          <Box sx={{ height: 300, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <AdminNotesTable
            notes={notes}
            onDelete={handleDelete}
            onEdit={handleOpenDialog}
            selectedMatiere={selectedMatiere}
            students={students}
          />
        )}
      </ManagementTable>
      {count > 10 && (
        <ManagementPagination
          count={count}
          page={page}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}

      <AdminNoteDialog
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
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotes;
