import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Divider, CircularProgress, 
  Alert, useTheme, Avatar
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Groups as GroupsIcon,
  Class as ClassIcon,
  FactCheck as FactCheckIcon
} from '@mui/icons-material';

import { api, endpoints } from '../../services/api';
import PageTitle from '../../components/PageTitle';
import { StatCard, ChartCard, DashboardHeader, DashboardLoading } from '../../components/DashboardUI';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TeacherDashboard = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await api.get(endpoints.dashboard.teacher);
                const data = await response.json();

                if (data.success) {
                    setStats(data);
                } else {
                    throw new Error(data.message || "Unable to load statistics.");
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <DashboardLoading />;
    if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box>
            <PageTitle
                title="Student Performance Prediction System - Teacher Portal"
                description="Teacher dashboard: classes, students and performance."
            />
            <DashboardHeader
                eyebrow="Teacher workspace"
                title="Teacher Portal"
                description="Class, performance and engagement monitoring."
            />

            {/* --- 4 CARDS --- */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="My Classes"
                        value={stats?.cards?.total_classes || 0}
                        icon={<ClassIcon />}
                        color={theme.palette.primary.main}
                        subtitle="Active classes"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="Total Students"
                        value={stats?.cards?.total_students || 0}
                        icon={<GroupsIcon />}
                        color={theme.palette.secondary.main}
                        subtitle="Under your responsibility"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="General Average"
                        value={stats?.cards?.my_avg || "N/A"}
                        icon={<TrendingUpIcon />}
                        color={theme.palette.success.main}
                        subtitle="Average across your subjects"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                        title="At-Risk Students"
                        value={stats?.cards?.at_risk_count || 0}
                        icon={<WarningIcon />}
                        color={theme.palette.error.main}
                        subtitle="Need support"
                    />
                </Grid>
            </Grid>

            {/* --- 4 CHARTS (GRID 2x2) --- */}
            <Grid container spacing={3}>
                
                {/* Chart 1: Class Comparison (Bar) */}
                <Grid item xs={12} md={6}>
                    <ChartCard 
                        title="Class Comparison (Average)"
                        subtitle="Average performance by class"
                        chartType="bar"
                        data={stats?.charts?.class_comparison}
                        dataKeys={['avg']}
                        colors={[theme.palette.primary.main]}
                        xAxisDataKey="name"
                        yAxisDomain={[0, 20]}
                        loading={loading}
                        error={error}
                    />
                </Grid>

                {/* Chart 2: Grade Distribution (Bar) */}
                <Grid item xs={12} md={6}>
                    <ChartCard 
                        title="Grade Distribution"
                        subtitle="How students are performing across grades"
                        chartType="bar"
                        data={stats?.charts?.grade_distribution}
                        dataKeys={['count']}
                        colors={[theme.palette.secondary.main]}
                        xAxisDataKey="range"
                        yAxisAllowDecimals={false}
                        loading={loading}
                        error={error}
                    />
                </Grid>

                {/* Chart 3: Pass/Fail Rate (Donut) */}
                <Grid item xs={12} md={6}>
                    <ChartCard 
                        title="Global Success Rate"
                        subtitle="Overall pass/fail rate"
                        chartType="pie"
                        data={stats?.charts?.pass_fail}
                        dataKeys={['value']}
                        colors={[theme.palette.success.main, theme.palette.error.main]}
                        innerRadius={60}
                        outerRadius={100}
                        label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
                        loading={loading}
                        error={error}
                    />
                </Grid>

                 {/* Chart 4: Activity Trend (Line) */}
                 <Grid item xs={12} md={6}>
                    <ChartCard 
                        title="Activity and Participation Trend"
                        subtitle="Engagement over time"
                        chartType="line"
                        data={stats?.charts?.activity_trend}
                        dataKeys={['msgs', 'files']}
                        colors={[theme.palette.primary.main, theme.palette.secondary.main]}
                        xAxisDataKey="month"
                        loading={loading}
                        error={error}
                    />
                </Grid>

            </Grid>
        </Box>
    );
};

export default TeacherDashboard;
