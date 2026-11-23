import { useState, useEffect } from "react";
import { Box, Grid, Alert, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Groups as GroupsIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { api, endpoints } from "../../services/api";
import PageTitle from "../../components/PageTitle";
import {
  StatCard,
  ChartCard,
  DashboardHeader,
  DashboardLoading,
} from "../../components/DashboardUI";

const COLORS = ["#10cfc9", "#526df5", "#f5a524", "#ef5da8", "#8884d8"];

const readJsonResponse = async (response, fallbackMessage) => {
  if (!response)
    throw new Error("Authentication expired. Please sign in again.");

  const contentType = response.headers?.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      response.ok
        ? "The server returned an unexpected HTML response."
        : fallbackMessage,
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The server returned invalid JSON.");
  }
};

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [subjectStats, setSubjectStats] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dashboardRes = await api.get(endpoints.dashboard.admin);
        const dashboardData = await readJsonResponse(
          dashboardRes,
          "Failed to load dashboard data.",
        );
        if (!dashboardData?.success) {
          throw new Error(dashboardData?.message || "Failed to load dashboard");
        }
        setStats(dashboardData);

        const subjectsRes = await api.get(endpoints.stats.subjectSuccessRate);
        console.log("Subjects response:", subjectsRes);
        const subjectsData = await readJsonResponse(
          subjectsRes,
          "Failed to load subject statistics.",
        );
        setSubjectStats(
          Array.isArray(subjectsData)
            ? subjectsData
            : subjectsData?.results || [],
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <DashboardLoading />;
  if (error) {
    return (
      <Box>
        <PageTitle
          title="Admin Dashboard"
          description="System overview and academic statistics."
        />
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const tooltipStyle = {
    borderRadius: 10,
    border: "1px solid rgba(7,29,53,0.08)",
    boxShadow: "0 8px 24px rgba(7,29,53,0.08)",
  };
  const performanceData = stats?.charts?.performance_distribution || [];
  const attendanceData = stats?.charts?.attendance_trend || [];
  const workloadData = stats?.charts?.teacher_workload || [];

  return (
    <Box>
      <PageTitle
        title="Student Performance Prediction System - Administration"
        description="System overview and academic statistics."
      />
      <DashboardHeader
        eyebrow="Administration overview"
        title="Admin Dashboard"
        description="Monitor academic performance, attendance and institutional activity."
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats?.cards?.total_students ?? 0}
            icon={<GroupsIcon />}
            color={theme.palette.primary.main}
            subtitle="Enrolled this year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Global Average"
            value={
              stats?.cards?.global_avg != null
                ? stats.cards.global_avg.toFixed(2)
                : "N/A"
            }
            icon={<SpeedIcon />}
            color="#526df5"
            subtitle="Across all subjects"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance Rate"
            value={`${stats?.cards?.attendance_rate ?? 0}%`}
            icon={<CheckCircleIcon />}
            color="#10b981"
            subtitle="Overall average"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="At-Risk Students"
            value={stats?.cards?.at_risk_count ?? 0}
            icon={<WarningIcon />}
            color="#ef4444"
            subtitle="Need attention"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="AI Performance Distribution"
            subtitle="Current prediction categories"
          >
            {performanceData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={104}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {performanceData.map((entry, index) => (
                      <Cell
                        key={`performance-${entry.name || index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                No performance data available
              </Box>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard
            title="Monthly Attendance Trend"
            subtitle="Attendance rate over time"
          >
            {attendanceData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient
                      id="attendanceFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#edf1f4" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#attendanceFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                No attendance data available
              </Box>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard
            title="Success Rate by Subject"
            subtitle="Average grade for each subject"
          >
            {subjectStats.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectStats}>
                  <CartesianGrid stroke="#edf1f4" vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 20]} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="success_rate"
                    fill="#10cfc9"
                    radius={[8, 8, 0, 0]}
                    name="Average Grade"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                No subject data available
              </Box>
            )}
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard
            title="Teacher Workload"
            subtitle="Top five teachers by student count"
          >
            {workloadData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={workloadData}>
                  <CartesianGrid stroke="#edf1f4" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="students"
                    fill="#526df5"
                    radius={[0, 8, 8, 0]}
                    name="Students"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "grid",
                  placeItems: "center",
                  color: "text.secondary",
                }}
              >
                No workload data available
              </Box>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
