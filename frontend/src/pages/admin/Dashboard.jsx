import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, Alert, useTheme } from "@mui/material";
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

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [subjectStats, setSubjectStats] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const dashboardRes = await api.get(endpoints.dashboard.admin);
        const dashboardData = await dashboardRes.json();
        if (!dashboardData.success)
          throw new Error(dashboardData.message || "Failed to load dashboard");
        setStats(dashboardData);

        const subjectsRes = await api.get(endpoints.stats.subjectSuccessRate);
        setSubjectStats(await subjectsRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) return <DashboardLoading />;
  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const tooltipStyle = {
    borderRadius: 10,
    border: "1px solid rgba(7,29,53,0.08)",
    boxShadow: "0 8px 24px rgba(7,29,53,0.08)",
  };

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

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats?.cards?.total_students || 0}
            icon={<GroupsIcon />}
            color={theme.palette.primary.main}
            subtitle="Enrolled this year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Global Average"
            value={stats?.cards?.global_avg?.toFixed(2) || "N/A"}
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
            value={stats?.cards?.at_risk_count || 0}
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.charts?.performance_distribution || []}
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
                  {(stats?.charts?.performance_distribution || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Monthly Attendance Trend"
            subtitle="Attendance rate over time"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.charts?.attendance_trend || []}>
                <defs>
                  <linearGradient
                    id="attendanceFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
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
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Success Rate by Subject"
            subtitle="Average grade for each subject"
          >
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
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Teacher Workload"
            subtitle="Top five teachers by student count"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={stats?.charts?.teacher_workload || []}
              >
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
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
