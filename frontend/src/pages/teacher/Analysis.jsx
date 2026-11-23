import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  useTheme,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { fetchWithTokenRefresh, checkAuthStatus, getUserRole } from '../../utils/auth';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import CategoryIcon from '@mui/icons-material/Category';
import { ManagementHeader, ManagementStat, ManagementTable } from "../../components/ManagementUI";

const TeacherAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classifications, setClassifications] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  // Vérification de l'authentification et du rôle de l'utilisateur
  useEffect(() => {
    const checkAuth = async () => {
      const user = await checkAuthStatus();
      if (!user || getUserRole() !== 'teacher') {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Récupération des matières au chargement du composant
  useEffect(() => {
    const fetchMatieres = async () => {
      setLoading(true);
      try {
        const response = await fetchWithTokenRefresh(`${API_BASE_URL}/teacher/matieres/`);
        const data = await response.json();
        if (data.success) {
          setMatieres(data.matieres);
          if (data.matieres.length > 0) {
            setSelectedMatiere(data.matieres[0].id);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatieres();
  }, []);

  // Récupération des données lorsque selectedMatiere change
  useEffect(() => {
    if (selectedMatiere) {
      fetchClassifications(selectedMatiere);
    }
  }, [selectedMatiere]);

  // Récupération des classifications uniquement
  const fetchClassifications = async (matiereId) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetchWithTokenRefresh(`${API_BASE_URL}/teacher/classifications/?matiere_id=${matiereId}`);
      const data = await response.json();
      if (data.success) {
        setClassifications(data.classifications);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch classifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedMatiere) {
      fetchClassifications(selectedMatiere);
    }
  };

  const getCategoryColor = (category) => {
    if (!category) return theme.palette.grey[500];
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('bon performeur') || categoryLower.includes('excellent')) {
      return theme.palette.success.main;
    } else if (categoryLower.includes('moyenne performance')) {
      return theme.palette.warning.main;
    } else if (categoryLower.includes('à risque')) {
      return theme.palette.error.main;
    } else {
      return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <ManagementHeader
        eyebrow="AI & performance analysis"
        title="Student Classifications"
        description="Review subject performance, AI predictions and global student classifications."
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: 0, sm: 220 },
                flex: { xs: 1, sm: "none" },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.10)",
                  color: "white",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.28)" },
                  "&:hover fieldset": { borderColor: "#56e0da" },
                  "& svg": { color: "white" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.72)" },
              }}
            >
              <InputLabel id="matiere-select-label">Subject</InputLabel>
              <Select
                labelId="matiere-select-label"
                value={selectedMatiere}
                onChange={(event) => setSelectedMatiere(event.target.value)}
                label="Subject"
              >
                {matieres.map((matiere) => (
                  <MenuItem key={matiere.id} value={matiere.id}>{matiere.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Refresh classifications">
              <IconButton
                onClick={handleRefresh}
                disabled={!selectedMatiere || loading}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  bgcolor: "rgba(255,255,255,0.10)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.28)",
                  "&:hover": { bgcolor: "rgba(16,207,201,0.18)", borderColor: "#56e0da" },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%", borderRadius: "10px" }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ManagementStat
            title="Classified Students"
            value={loading ? "—" : classifications.length}
            icon={<CategoryIcon />}
            color="#10cfc9"
            subtitle="Students in the selected subject"
          />
        </Grid>
      </Grid>

      <ManagementTable
        title="Student classifications"
        subtitle={selectedMatiere ? "Subject and global AI performance levels" : "Select a subject to display classifications"}
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
                  <TableCell sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}>Subject Performance</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}>Subject Grade</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 850, color: "#526df5", py: 1.5 }}>AI Prediction</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}>Global AI Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classifications.length > 0 ? classifications.map((classification) => (
                  <TableRow
                    key={classification.student_id}
                    hover
                    sx={{ "&:last-child td": { border: 0 }, "& td": { borderColor: "rgba(7,29,53,0.06)" } }}
                  >
                    <TableCell sx={{ fontWeight: 750 }}>{classification.student_name}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<CategoryIcon />}
                        label={classification.performance_category}
                        size="small"
                        sx={{ bgcolor: getCategoryColor(classification.performance_category), color: "white", fontWeight: 800, "& .MuiChip-icon": { color: "white" } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={classification.average_score}
                        size="small"
                        sx={{ bgcolor: "rgba(82,109,245,0.08)", color: "#526df5", fontWeight: 850 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {classification.ai_prediction !== "-" ? (
                        <Chip label={classification.ai_prediction} variant="outlined" size="small" sx={{ color: "#526df5", borderColor: "rgba(82,109,245,0.35)", fontWeight: 800 }} />
                      ) : (
                        <Typography variant="caption" color="text.disabled">N/A</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {classification.ai_category && classification.ai_category !== "Non Analysé" ? (
                        <Chip
                          label={classification.ai_category}
                          size="small"
                          sx={{ bgcolor: getCategoryColor(classification.ai_category), color: "white", fontWeight: 800 }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled">-</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 7, color: "text.secondary" }}>
                      {selectedMatiere ? "No classification data available" : "Select a subject to display classifications"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ManagementTable>
    </Box>
  );
};

export default TeacherAnalysis;
