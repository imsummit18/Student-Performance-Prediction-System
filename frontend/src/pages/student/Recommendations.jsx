import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Divider,
  // @ts-ignore
  Chip,
  useTheme,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Link,
  Alert as MuiAlert,
  alpha,
} from "@mui/material";
import {
  Lightbulb,
  School,
  // @ts-ignore
  CalendarToday,
  Warning,
  ExpandMore,
  ExpandLess,
  Notifications,
  Link as LinkIcon,
} from "@mui/icons-material";
import { fetchWithTokenRefresh } from "../../utils/auth";
import { API_BASE_URL } from "../../config";
import { ManagementHeader } from "../../components/ManagementUI";

const StudentRecommendations = () => {
  const [recommendations, setRecommendations] = useState({
    academic_orientation: null,
    performance_recommendations: [],
    subject_recommendations: [],
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [expandedItems, setExpandedItems] = useState({
    alerts: {},
    subjectRecs: {},
  });
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const errorColor = theme.palette.error.main;

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? "Date inconnue"
      : date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetchWithTokenRefresh(
        `${API_BASE_URL}/student/recommendations/`,
      );
      if (!response) return;
      const data = await response.json();
      if (data.success) setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetchWithTokenRefresh(
        `${API_BASE_URL}/student/alerts/`,
      );
      if (!response) return;
      const data = await response.json();
      if (data.success) setAlerts(data.alerts || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchRecommendations(), fetchAlerts()]);
  }, []);

  const toggleExpand = (type, id) => {
    setExpandedItems((current) => ({
      ...current,
      [type]: { ...current[type], [id]: !current[type][id] },
    }));
  };

  if (loading) {
    return (
      <Box sx={{ height: 420, display: "grid", placeItems: "center" }}>
        <LinearProgress
          sx={{
            width: "60%",
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(16,207,201,0.12)",
            "& .MuiLinearProgress-bar": { bgcolor: primaryColor },
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <ManagementHeader
        eyebrow="Personal guidance"
        title="Recommendations & Alerts"
        description="View your academic orientation, personalized actions and important alerts."
      />

      <Tabs
        value={tabValue}
        onChange={(event, value) => setTabValue(value)}
        variant="fullWidth"
        sx={{
          mb: 3,
          border: "1px solid rgba(7,29,53,0.08)",
          borderRadius: "14px",
          bgcolor: "white",
          overflow: "hidden",
          "& .MuiTab-root": {
            minHeight: 56,
            textTransform: "none",
            fontWeight: 800,
            color: "text.secondary",
          },
          "& .Mui-selected": { color: "#071d35" },
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 3,
            bgcolor: tabValue === 0 ? primaryColor : errorColor,
          },
        }}
      >
        <Tab
          icon={<Lightbulb />}
          iconPosition="start"
          label="Recommendations"
        />
        <Tab
          icon={<Warning />}
          iconPosition="start"
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Alerts
              {alerts.length > 0 && (
                <Chip
                  label={alerts.length}
                  size="small"
                  sx={{
                    height: 22,
                    minWidth: 22,
                    bgcolor: "rgba(239,68,68,0.12)",
                    color: "#ef4444",
                    fontWeight: 850,
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
              )}
            </Box>
          }
        />
      </Tabs>

      {tabValue === 0 ? (
        <Box>
          {recommendations.academic_orientation && (
            <Card
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: "18px",
                border: "1px solid rgba(7,29,53,0.08)",
                overflow: "hidden",
                boxShadow: "0 8px 26px rgba(7,29,53,0.035)",
              }}
            >
              <Box sx={{ height: 6, bgcolor: primaryColor }} />
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontWeight: 800,
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Recommended academic orientation
                </Typography>
                <Typography
                  sx={{
                    color: "#071d35",
                    fontWeight: 850,
                    fontSize: "1.35rem",
                    mb: 0.75,
                  }}
                >
                  {recommendations.academic_orientation.orientation}
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>
                  {recommendations.academic_orientation.description}
                </Typography>
              </CardContent>
            </Card>
          )}

          {recommendations.performance_recommendations.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  color: "#071d35",
                  fontWeight: 850,
                  fontSize: "1.05rem",
                  mb: 1.5,
                }}
              >
                General Recommendations
              </Typography>
              <Grid container spacing={2}>
                {recommendations.performance_recommendations.map(
                  (rec, index) => (
                    <Grid item xs={12} sm={6} key={`perf-${index}`}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          borderRadius: "16px",
                          border: "1px solid rgba(245,165,36,0.18)",
                          bgcolor: "rgba(245,165,36,0.035)",
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.25,
                              mb: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "10px",
                                bgcolor: "rgba(245,165,36,0.12)",
                                color: "#f5a524",
                                display: "grid",
                                placeItems: "center",
                              }}
                            >
                              <Lightbulb sx={{ fontSize: 20 }} />
                            </Box>
                            <Typography
                              sx={{ color: "#071d35", fontWeight: 850 }}
                            >
                              Recommendation
                            </Typography>
                          </Box>
                          <Typography sx={{ lineHeight: 1.7, mb: 1.5 }}>
                            {rec.message}
                          </Typography>
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {formatDate(rec.date)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ),
                )}
              </Grid>
            </Box>
          )}

          {recommendations.subject_recommendations.length > 0 && (
            <Box>
              <Typography
                sx={{
                  color: "#071d35",
                  fontWeight: 850,
                  fontSize: "1.05rem",
                  mb: 1.5,
                }}
              >
                Recommendations by Subject
              </Typography>
              <Box
                sx={{
                  borderRadius: "16px",
                  border: "1px solid rgba(7,29,53,0.08)",
                  overflow: "hidden",
                  bgcolor: "white",
                }}
              >
                {recommendations.subject_recommendations.map((rec, index) => (
                  <React.Fragment key={`subj-${index}`}>
                    <ListItem
                      onClick={() => toggleExpand("subjectRecs", index)}
                      sx={{
                        cursor: "pointer",
                        px: 2.5,
                        py: 2,
                        borderBottom:
                          index <
                          recommendations.subject_recommendations.length - 1
                            ? "1px solid rgba(7,29,53,0.06)"
                            : "none",
                        "&:hover": { bgcolor: "rgba(16,207,201,0.035)" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            bgcolor: "rgba(16,207,201,0.10)",
                            color: "#10aaa5",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <School sx={{ fontSize: 20 }} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{ color: "#071d35", fontWeight: 850 }}
                          >
                            {rec.subject}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.78rem",
                              mt: 0.25,
                            }}
                          >
                            Generated on {formatDate(rec.date)}
                          </Typography>
                        }
                      />
                      <IconButton>
                        {expandedItems.subjectRecs[index] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </ListItem>
                    <Collapse
                      in={expandedItems.subjectRecs[index]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box
                        sx={{
                          px: 2.5,
                          pb: 2.5,
                          bgcolor: "rgba(7,29,53,0.018)",
                        }}
                      >
                        <Typography sx={{ lineHeight: 1.7, mb: 1.5 }}>
                          {rec.message}
                        </Typography>
                        {rec.resources?.length > 0 && (
                          <>
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontWeight: 800,
                                fontSize: "0.78rem",
                                mb: 0.75,
                              }}
                            >
                              Recommended resources
                            </Typography>
                            <List dense disablePadding>
                              {rec.resources.map((resource, i) => (
                                <ListItem key={i} sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 34 }}>
                                    <LinkIcon
                                      sx={{ color: "#526df5", fontSize: 18 }}
                                    />
                                  </ListItemIcon>
                                  <Link
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener"
                                    underline="hover"
                                    sx={{ color: "#526df5", fontWeight: 700 }}
                                  >
                                    {resource.name}
                                  </Link>
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}
                      </Box>
                    </Collapse>
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          )}

          {!recommendations.academic_orientation &&
            recommendations.performance_recommendations.length === 0 &&
            recommendations.subject_recommendations.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: "18px",
                  border: "1px dashed rgba(7,29,53,0.16)",
                  bgcolor: "rgba(7,29,53,0.018)",
                }}
              >
                <Lightbulb
                  sx={{ fontSize: 58, color: "rgba(16,207,201,0.55)", mb: 1.5 }}
                />
                <Typography
                  sx={{
                    color: "#071d35",
                    fontWeight: 850,
                    fontSize: "1.15rem",
                    mb: 0.75,
                  }}
                >
                  No recommendations available
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Your recommendations will appear here once they are generated.
                </Typography>
              </Paper>
            )}
        </Box>
      ) : (
        <Box>
          {alerts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: "18px",
                border: "1px dashed rgba(7,29,53,0.16)",
                bgcolor: "rgba(7,29,53,0.018)",
              }}
            >
              <Notifications
                sx={{ fontSize: 58, color: "rgba(16,185,129,0.65)", mb: 1.5 }}
              />
              <Typography
                sx={{
                  color: "#071d35",
                  fontWeight: 850,
                  fontSize: "1.15rem",
                  mb: 0.75,
                }}
              >
                No active alerts
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                You do not have any alerts right now.
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                borderRadius: "16px",
                border: "1px solid rgba(239,68,68,0.12)",
                overflow: "hidden",
                bgcolor: "white",
              }}
            >
              {alerts.map((alert, index) => (
                <React.Fragment key={`alert-${index}`}>
                  <ListItem
                    onClick={() => toggleExpand("alerts", index)}
                    sx={{
                      cursor: "pointer",
                      px: 2.5,
                      py: 2,
                      borderBottom:
                        index < alerts.length - 1
                          ? "1px solid rgba(7,29,53,0.06)"
                          : "none",
                      "&:hover": { bgcolor: "rgba(239,68,68,0.025)" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: "10px",
                          bgcolor: "rgba(239,68,68,0.10)",
                          color: "#ef4444",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Warning sx={{ fontSize: 20 }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "#071d35", fontWeight: 850 }}>
                          {alert.message}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.78rem",
                            mt: 0.25,
                          }}
                        >
                          Generated on {formatDate(alert.date_creation)}
                        </Typography>
                      }
                    />
                    <IconButton>
                      {expandedItems.alerts[index] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </ListItem>
                  <Collapse
                    in={expandedItems.alerts[index]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box
                      sx={{
                        px: 2.5,
                        pb: 2.5,
                        bgcolor: "rgba(239,68,68,0.018)",
                      }}
                    >
                      <MuiAlert
                        severity="warning"
                        sx={{ mb: 2, borderRadius: "10px" }}
                      >
                        This alert indicates that you may need additional
                        support.
                      </MuiAlert>
                      {alert.course_recommendations?.length > 0 &&
                        alert.course_recommendations.map((course, i) => (
                          <Box
                            key={i}
                            sx={{
                              mb:
                                i < alert.course_recommendations.length - 1
                                  ? 2
                                  : 0,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#071d35",
                                fontWeight: 850,
                                mb: 0.75,
                              }}
                            >
                              {course.subject}
                            </Typography>
                            <List dense disablePadding>
                              {course.resources.map((resource, j) => (
                                <ListItem key={j} sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 34 }}>
                                    <LinkIcon
                                      sx={{ color: "#526df5", fontSize: 18 }}
                                    />
                                  </ListItemIcon>
                                  <Link
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener"
                                    underline="hover"
                                    sx={{ color: "#526df5", fontWeight: 700 }}
                                  >
                                    {resource.name}
                                  </Link>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        ))}
                    </Box>
                  </Collapse>
                </React.Fragment>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StudentRecommendations;
