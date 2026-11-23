import { useEffect, useState } from "react";
import { Alert, Box, Chip, CircularProgress, Grid, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import { fetchWithTokenRefresh } from "../../utils/auth";
import { API_BASE_URL } from "../../config";
import { ManagementHeader, ManagementStat, ManagementTable } from "../../components/ManagementUI";

const StudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchData = async () => {
    try {
      const response = await fetchWithTokenRefresh(`${API_BASE_URL}/student/notes/`);
      const data = await response.json();


      if (data.success && Array.isArray(data.notes)) {
        const filteredNotes = data.notes.filter(note => note.date_ajout);

        setNotes(filteredNotes);
      } else {
        console.error("Invalid API response format:", data);
        setNotes([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Function to determine color based on score
  const getScoreColor = (score) => {
    if (!score && score !== 0) return theme.palette.text.secondary;
    if (score >= 16) return theme.palette.success.main;
    if (score >= 12) return theme.palette.primary.main;
    if (score >= 8) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Function to format date in a more readable way
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const averageScore = notes.length
    ? (notes.reduce((sum, note) => sum + (Number(note.note_module) || 0), 0) / notes.length).toFixed(2)
    : "—";

  return (
    <Box>
      <ManagementHeader
        eyebrow="Academic records"
        title="My Grades"
        description="Review your grades, assignments, attendance and presence by subject."
      />

      {loading ? (
        <Box sx={{ height: 420, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ManagementStat
                title="Grade Records"
                value={notes.length}
                icon={<GradeOutlinedIcon />}
                color="#10cfc9"
                subtitle="Subjects with available grades"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ManagementStat
                title="Average Module"
                value={averageScore}
                icon={<GradeOutlinedIcon />}
                color="#526df5"
                subtitle="Based on recorded module grades"
              />
            </Grid>
          </Grid>

          <ManagementTable
            title="My grade records"
            subtitle={`${notes.length} record${notes.length === 1 ? "" : "s"} available`}
          >
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(7,29,53,0.025)" }}>
                    {[
                      ["Subject", "left"],
                      ["Module Grade", "center"],
                      ["Assignment / Project", "center"],
                      ["Attendance", "center"],
                      ["Presence", "center"],
                      ["Date", "right"],
                    ].map(([header, align]) => (
                      <TableCell key={header} align={align} sx={{ fontWeight: 850, color: "#071d35", py: 1.5 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notes.length > 0 ? notes.map((note) => (
                    <TableRow
                      key={note.id}
                      hover
                      sx={{ "&:last-child td": { border: 0 }, "& td": { borderColor: "rgba(7,29,53,0.06)" } }}
                    >
                      <TableCell sx={{ fontWeight: 750 }}>
                        {typeof note.matiere === "object" ? note.matiere.nom : `Subject ID: ${note.matiere}`}
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={note.note_module ?? "N/A"} size="small" sx={{ minWidth: 58, fontWeight: 850, color: "white", bgcolor: getScoreColor(note.note_module) }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={note.note_devoir_projet ?? "N/A"} size="small" sx={{ minWidth: 58, fontWeight: 850, color: "white", bgcolor: getScoreColor(note.note_devoir_projet) }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={note.assiduite ?? "N/A"} size="small" sx={{ minWidth: 58, fontWeight: 850, color: "white", bgcolor: getScoreColor(note.assiduite) }} />
                      </TableCell>
                      <TableCell align="center">
                        {note.presence !== undefined && note.presence !== null ? (
                          <Chip
                            label={`${note.presence}%`}
                            size="small"
                            sx={{
                              minWidth: 58,
                              fontWeight: 850,
                              color: "white",
                              bgcolor: note.presence >= 90 ? theme.palette.success.main : note.presence >= 75 ? theme.palette.primary.main : note.presence >= 50 ? theme.palette.warning.main : theme.palette.error.main,
                            }}
                          />
                        ) : (
                          <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>N/A</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ color: "text.secondary", fontSize: "0.82rem", fontWeight: 650 }}>
                          {formatDate(note.date_ajout)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 7, color: "text.secondary" }}>
                        No grades available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </ManagementTable>
        </>
      )}
    </Box>
  );
};

export default StudentNotes;
