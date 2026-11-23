import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GetAppIcon from "@mui/icons-material/GetApp";

const AdminNotesControls = ({ matieres, onAdd, onDownloadTemplate, onFileUpload, onMatiereChange, selectedMatiere }) => (
  <Box sx={{ px: 2.5, py: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Grid container spacing={1.5} sx={{ flex: 1, minWidth: 220 }}>
      <Grid item xs={12} sm={7} md={4}>
        <TextField select fullWidth size="small" label="Subject" value={selectedMatiere} onChange={(event) => onMatiereChange(event.target.value)}>
          <MenuItem value="">Select a Subject</MenuItem>
          {matieres.map((matiere) => <MenuItem key={matiere.id} value={matiere.id}>{matiere.nom}</MenuItem>)}
        </TextField>
      </Grid>
    </Grid>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Button variant="outlined" startIcon={<GetAppIcon />} onClick={onDownloadTemplate} disabled={!selectedMatiere} sx={{ borderRadius: '10px', borderColor: 'divider', color: 'text.secondary', fontWeight: 800 }}>
        Template
      </Button>
      <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} disabled={!selectedMatiere} sx={{ borderRadius: '10px', borderColor: 'divider', color: 'text.secondary', fontWeight: 800 }}>
        Import CSV
        <input type="file" hidden accept=".csv" onChange={onFileUpload} />
      </Button>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} disabled={!selectedMatiere} sx={{ borderRadius: '10px', bgcolor: '#071d35', fontWeight: 800, '&:hover': { bgcolor: '#10aaa5' } }}>
        New Grade
      </Button>
    </Box>
  </Box>
);

export default AdminNotesControls;
