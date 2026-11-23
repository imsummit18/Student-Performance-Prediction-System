import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Divider, CircularProgress, 
  Alert, useTheme, Avatar
} from "@mui/material";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { 
  School, TrendingUp, Warning, CheckCircle, SentimentSatisfiedAlt, 
  NotificationsActive
} from "@mui/icons-material";
import { api, endpoints } from "../../services/api";
import PageTitle from '../../components/PageTitle';
import { StatCard, ChartCard, DashboardHeader, DashboardLoading } from '../../components/DashboardUI';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StudentDashboard = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [legacyData, setLegacyData] = useState(null);
    const [newData, setNewData] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
             setLoading(true);
             try {
                 // 1. Fetch Legacy Data (Perf Trends, Subject Pie)
                 const legacyRes = await api.get(endpoints.studentDashboard.dashboard);
                 const legData = await legacyRes.json();
                 
                 // 2. Fetch New Stats (Radar, Attendance Bar, Cards)
                 const newRes = await api.get(endpoints.dashboard.student);
                 const nData = await newRes.json();

                 if (legData.success && nData.success) {
                     setLegacyData(legData);
                     setNewData(nData);
                 } else {
                     throw new Error("Failed to load data");
                 }

             } catch (err) {
                 console.error(err);
                 setError("Impossible de charger le tableau de bord.");
             } finally {
                 setLoading(false);
             }
        };

        fetchAllData();
    }, []);

    if (loading) return <DashboardLoading />;
    if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box>
            <PageTitle
                title="Student Performance Prediction System - Student Dashboard"
                description="Track your performance, attendance and recommendations."
            />
             <DashboardHeader
                eyebrow="Student workspace"
                title={`Welcome, ${legacyData?.name || 'Student'}`}
                description="Your personal academic monitoring space."
            />

            <Grid container spacing={2.5} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="My Average" value={newData?.cards?.my_avg?.toFixed(2) || 'N/A'} icon={<School />} color={theme.palette.primary.main} subtitle="Current average" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="AI Status" value={newData?.cards?.status_label || '-'} icon={<SentimentSatisfiedAlt />} color={theme.palette.secondary.main} subtitle="Overall performance" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Attendance" value={`${newData?.cards?.attendance_rate ?? 0}%`} icon={<CheckCircle />} color="#10b981" subtitle="Attendance rate" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Warnings" value={newData?.cards?.alert_count || 0} icon={<NotificationsActive />} color="#f5a524" subtitle="Active alerts" />
                </Grid>
            </Grid>

            {/* --- 4 CHARTS --- */}
            <Grid container spacing={3}>
                
                {/* Chart 1: Performance Trend (Line - Legacy) */}
                <Grid item xs={12} md={6}>
                    <ChartCard elevation={2} sx={{ height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Grade Trend
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={legacyData?.monthlyPerformance || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[0, 20]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="average" stroke={theme.palette.primary.main} strokeWidth={3} dot={{r:4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Chart 2: Skills Radar (Radar - New) */}
                <Grid item xs={12} md={6}>
                    <ChartCard elevation={2} sx={{ height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Me vs Class Average
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={newData?.charts?.radar_data || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" tick={{ fontSize: 12 }} interval={0} />
                                <YAxis domain={[0, 20]} />
                                <Tooltip 
                                    formatter={(value, name) => [value, name === 'Me' ? 'My Grade' : 'Class Average']}
                                    contentStyle={{ borderRadius: 8 }}
                                />
                                <Legend formatter={(value) => value === 'Me' ? 'My Grade' : 'Class Average'} />
                                <Bar dataKey="Me" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Class" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Chart 3: Subject Breakdown (Pie - Legacy) */}
                <Grid item xs={12} md={6}>
                    <ChartCard elevation={2} sx={{ height: 400 }}>
                         <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Performance by Subject
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={legacyData?.subjectPerformance || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({name, value}) => `${name}: ${value}`}
                                >
                                    {legacyData?.subjectPerformance?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Chart 4: Monthly Attendance (Bar - New) */}
                <Grid item xs={12} md={6}>
                    <ChartCard elevation={2} sx={{ height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Attendance History
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={newData?.charts?.monthly_attendance || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="present" stackId="a" fill={theme.palette.success.main} name="Present" />
                                <Bar dataKey="absent" stackId="a" fill={theme.palette.error.main} name="Absent" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

            </Grid>
        </Box>
    );
};

export default StudentDashboard;
