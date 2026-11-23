import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Card,
  CardContent,
  Divider,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  Fade,
} from "@mui/material";
import {
  Psychology as BrainIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AutoAwesome as SparklesIcon,
  Timeline as TimelineIcon,
  Recommend as RecommendIcon,
  Speed as SpeedIcon,
  Science as ScienceIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
  api,
  endpoints,
  unwrapPaginatedList,
  withPagination,
} from "../../services/api";
import { ManagementHeader } from "../../components/ManagementUI";

// --- STYLED COMPONENTS & CONSTANTS ---

const STATUS_CONFIG = {
  "À risque": { color: "error", icon: <ErrorIcon fontSize="small" /> },
  "Moyenne performance": {
    color: "warning",
    icon: <WarningIcon fontSize="small" />,
  },
  "Bon performeur": {
    color: "success",
    icon: <CheckCircleIcon fontSize="small" />,
  },
};

const TAB_STYLES = {
  root: {
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "1rem",
    minHeight: 48,
  },
};

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={2}
      sx={{
        height: 140,
        borderLeft: `5px solid ${color}`,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight="bold"
          >
            {title}
          </Typography>
          <Box sx={{ color: color }}>{icon}</Box>
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}
          >
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const GlobalAIHub = () => {
  const theme = useTheme();

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    classification: [],
    statistics: null,
    alerts: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState({ classes: false, data: false });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [predictData, setPredictData] = useState(null);

  // Initial Load
  useEffect(() => {
    fetchClasses();
  }, []);

  // Reset analysis when class changes
  useEffect(() => {
    setAnalysisDone(false);
    setDashboardData({
      classification: [],
      statistics: null,
      alerts: [],
      recommendations: [],
    });
    setPredictData(null);
  }, [selectedClass]);

  // --- API CALLS ---

  const fetchClasses = async () => {
    setLoading((prev) => ({ ...prev, classes: true }));
    try {
      const response = await api.get(
        withPagination(endpoints.classes.list, 1, 1000),
      );
      const data = await response.json();
      setClasses(unwrapPaginatedList(data).items);
    } catch (error) {
      showNotification("Failed to load classes", "error");
    } finally {
      setLoading((prev) => ({ ...prev, classes: false }));
    }
  };

  const runAnalysis = async () => {
    if (!selectedClass) {
      showNotification("Select a class", "warning");
      return;
    }

    setLoading((prev) => ({ ...prev, data: true }));
    try {
      // 1. Trigger Classification (Uses .pkl models)
      const classifyResponse = await api.post(endpoints.ml.classifyClass, {
        class_id: selectedClass,
      });
      const classifyData = await classifyResponse.json();

      if (!classifyData.success && !classifyData.classification) {
        // Continue relying on dashboard data
      }

      // 2. Fetch Detailed Predictions (S3/S4)
      const predictResponse = await api.post(endpoints.ml.predictGrades, {
        class_id: selectedClass,
      });
      const predictions = await predictResponse.json();

      // 3. Fetch Recommendations (Now generated)
      const recResponse = await api.post(endpoints.ml.classRecommendations, {
        class_id: selectedClass,
      });
      const recData = await recResponse.json();

      // Combine Data (using logic from class_dashboard view or classify result)
      const dashResponse = await api.post(endpoints.ml.classDashboard, {
        class_id: selectedClass,
      });
      const dashData = await dashResponse.json();

      setDashboardData({
        ...dashData,
        recommendations: recData.recommendations || [],
      });
      setPredictData(predictions);
      setAnalysisDone(true);
      showNotification("AI analysis completed successfully", "success");
    } catch (error) {
      console.error(error);
      showNotification("AI analysis failed", "error");
    } finally {
      setLoading((prev) => ({ ...prev, data: false }));
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // --- RENDERERS ---

  const renderOverviewValues = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Class Average"
          value={dashboardData.statistics?.average_score?.toFixed(2) || "-"}
          icon={<SpeedIcon />}
          color={theme.palette.primary.main}
          subtitle="Global average score"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="At Risk"
          value={dashboardData.statistics?.at_risk_count || 0}
          icon={<ErrorIcon />}
          color={theme.palette.error.main}
          subtitle="Generated alerts"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Performants"
          value={dashboardData.statistics?.good_performers || 0}
          icon={<SparklesIcon />}
          color={theme.palette.success.main}
          subtitle="Top students"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Students"
          value={dashboardData.statistics?.total_students || 0}
          icon={<SchoolIcon />}
          color={theme.palette.info.main}
          subtitle="Analyzed group"
        />
      </Grid>
    </Grid>
  );

  const renderPredictionsTable = () => (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Student</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Avg. S1 (Real)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Avg. S2 (Real)
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
              >
                Pred. S3/S4
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictData?.students?.map((student) => (
              <TableRow key={student.student_id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">
                    {student.student_name}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={student.s1_avg}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={student.s2_avg}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={student.predicted_avg?.note?.toFixed(2) || "?"}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {(!predictData?.students || predictData.students.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  const renderInsightsList = () => (
    <Grid container spacing={3}>
      {dashboardData.recommendations.map((rec) => (
        <Grid item xs={12} key={rec.student_id}>
          <Card elevation={1}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                flexWrap="wrap"
                gap={1}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <AvatarIcon name={rec.student_name} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {rec.student_name}
                    </Typography>
                    <Chip
                      label={rec.performance_category}
                      size="small"
                      // @ts-ignore
                      color={
                        STATUS_CONFIG[rec.performance_category]?.color ||
                        "default"
                      }
                      variant="outlined"
                      icon={STATUS_CONFIG[rec.performance_category]?.icon}
                    />
                  </Box>
                </Box>
                {rec.academic_orientation && (
                  <Box textAlign="right">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Suggested Orientation
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="primary"
                    >
                      {rec.academic_orientation.orientation}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <RecommendIcon fontSize="small" color="action" />{" "}
                  Recommendations
                </Typography>
                <List dense disablePadding>
                  {rec.recommendations.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <PlayArrowIcon fontSize="small" sx={{ fontSize: 16 }} />
                      </ListItemIcon>
                      <Typography variant="body2">{item.message}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {dashboardData.recommendations.length === 0 && (
        <Grid item xs={12}>
          <Alert severity="info" variant="outlined">
            No recommendations generated for this class.
          </Alert>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box>
      <ManagementHeader
        eyebrow="AI & predictive analytics"
        title="AI Hub"
        description="Run class-level predictions and turn academic data into clear recommendations."
        action={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: { xs: "100%", sm: "auto" },
            }}
          >
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
              <InputLabel>Choose a Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(event) => setSelectedClass(event.target.value)}
                label="Choose a Class"
                disabled={loading.classes}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {classes.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              disabled={!selectedClass || loading.data}
              onClick={runAnalysis}
              startIcon={
                loading.data ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SparklesIcon />
                )
              }
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
              {loading.data ? "Analyzing..." : "Run AI"}
            </Button>
          </Box>
        }
      />

      <Fade in={true}>
        <Box>
          {!analysisDone ? (
            <Paper
              elevation={0}
              sx={{
                minHeight: 420,
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                borderRadius: "18px",
                border: "1px dashed rgba(7,29,53,0.16)",
                bgcolor: "rgba(7,29,53,0.018)",
                p: { xs: 3, md: 6 },
              }}
            >
              <Box>
                <Avatar
                  sx={{
                    width: 88,
                    height: 88,
                    mx: "auto",
                    mb: 2.5,
                    borderRadius: "24px",
                    bgcolor: "rgba(82,109,245,0.10)",
                    color: "#526df5",
                  }}
                >
                  <ScienceIcon sx={{ fontSize: 46 }} />
                </Avatar>
                <Typography
                  sx={{
                    color: "#071d35",
                    fontWeight: 850,
                    fontSize: "1.45rem",
                    mb: 1,
                  }}
                >
                  Ready to analyze
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    maxWidth: 460,
                    mx: "auto",
                    lineHeight: 1.75,
                  }}
                >
                  Select a class, then run the AI models to view
                  classifications, future predictions and personalized
                  recommendations.
                </Typography>
              </Box>
            </Paper>
          ) : (
            <>
              {renderOverviewValues()}

              <Paper
                elevation={0}
                sx={{
                  borderRadius: "18px",
                  border: "1px solid rgba(7,29,53,0.08)",
                  overflow: "hidden",
                  boxShadow: "0 8px 26px rgba(7,29,53,0.035)",
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  allowScrollButtonsMobile
                  sx={{
                    px: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "& .MuiTab-root": {
                      textTransform: "none",
                      minHeight: 58,
                      fontWeight: 800,
                      color: "text.secondary",
                    },
                    "& .Mui-selected": { color: "#071d35" },
                    "& .MuiTabs-indicator": {
                      height: 3,
                      borderRadius: 3,
                      bgcolor: "primary.main",
                    },
                  }}
                >
                  <Tab
                    label="Classification"
                    icon={<TimelineIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Future Predictions"
                    icon={<TrendingUpIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Recommendations"
                    icon={<BrainIcon />}
                    iconPosition="start"
                  />
                </Tabs>

                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  {activeTab === 0 && (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "rgba(7,29,53,0.025)" }}>
                            <TableCell
                              sx={{ fontWeight: 850, color: "#071d35" }}
                            >
                              Student
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: 850, color: "#071d35" }}
                            >
                              General Average
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: 850, color: "#071d35" }}
                            >
                              AI Status
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontWeight: 850, color: "#071d35" }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboardData.classification.map((row) => (
                            <TableRow key={row.student_id} hover>
                              <TableCell sx={{ fontWeight: 750 }}>
                                {row.student_name}
                              </TableCell>
                              <TableCell align="center">
                                {row.average_score?.toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={row.performance_category}
                                  size="small"
                                  color={
                                    STATUS_CONFIG[row.performance_category]
                                      ?.color || "default"
                                  }
                                  sx={{ fontWeight: 800 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  size="small"
                                  onClick={() => setActiveTab(2)}
                                  sx={{ fontWeight: 800 }}
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {dashboardData.classification.length === 0 && (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                align="center"
                                sx={{ py: 7, color: "text.secondary" }}
                              >
                                No classification data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  {activeTab === 1 && renderPredictionsTable()}
                  {activeTab === 2 && renderInsightsList()}
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Fade>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() =>
          setNotification((current) => ({ ...current, open: false }))
        }
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

const AvatarIcon = ({ name }) => (
  <Box
    sx={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      bgcolor: "primary.main",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.8rem",
      fontWeight: "bold",
    }}
  >
    {name ? name.charAt(0) : "?"}
  </Box>
);

export default GlobalAIHub;
