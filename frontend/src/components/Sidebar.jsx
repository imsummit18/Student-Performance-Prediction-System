import React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Box, Chip, Divider as MuiDivider, styled, useTheme, Typography, Tooltip, Stack } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import RecommendOutlinedIcon from "@mui/icons-material/RecommendOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { useNavigate } from "react-router-dom";
import { grey, blue } from "@mui/material/colors";
import { getCurrentUser, getUserRole } from "../utils/auth"; 

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// @ts-ignore
const Drawer = styled(MuiDrawer)(({ theme, open, variant }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(variant === "permanent" && {
    width: drawerWidth,
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }),
}));

// Menu items for each role
const adminMenuItems = {
  main: [
    {
      text: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      path: "/admin/dashboard"
    },
    {
      text: "AI Hub",
      icon: <PsychologyOutlinedIcon />,
      path: "/admin/ai-hub"
    },
    {
      text: "Classes", 
      icon: <ClassOutlinedIcon />,
      path: "/admin/classes"
    },
    {
      text: "Teachers",
      icon: <PersonOutlineOutlinedIcon />,
      path: "/admin/teachers" 
    },
    {
      text: "Students",
      icon: <SchoolOutlinedIcon />,
      path: "/admin/students"
    },
    {
      text: "Subjects",
      icon: <MenuBookOutlinedIcon />,
      path: "/admin/subjects"
    },
    {
      text: "Grades",
      icon: <GradeOutlinedIcon />,
      path: "/admin/notes"
    }
  ],
};

const teacherMenuItems = {
  main: [
    { text: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/teacher/dashboard" },
    { text: "Grades", icon: <AssessmentOutlinedIcon />, path: "/teacher/notes" },
    { text: "Analysis", icon: <BarChartOutlinedIcon />, path: "/teacher/analysis" },
    { text: "Profile", icon: <PeopleOutlineOutlinedIcon />, path: "/teacher/profile" },
  ],
};

const studentMenuItems = {
  main: [
    { text: "Dashboard", icon: <DashboardOutlinedIcon />, path: "/student/dashboard" },
    { text: "Grades", icon: <AssessmentOutlinedIcon />, path: "/student/notes" },
    { text: "Guidance", icon: <EmojiObjectsOutlinedIcon />, path: "/student/guidance" },
  
    { text: "Profile", icon: <PeopleOutlineOutlinedIcon />, path: "/student/profile" },
  ],
};

// Helper function to generate initials from a name (keeping this for reference)
const getInitials = (name) => {
  if (!name) return "U";
  const nameParts = name.split(" ");
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
};

const getRoleDetails = (role) => {
  switch (role) {
    case "admin":
      return {
        name: "Admin User",
        role: "Administrator",
        menuItems: adminMenuItems,
      };
    case "teacher":
      return {
        name: "Teacher Name",
        role: "Teacher",
        menuItems: teacherMenuItems,
      };
    case "student":
      return {
        name: "Student Name",
        role: "Student",
        menuItems: studentMenuItems,
      };
    default:
      return {
        name: "User",
        role: "Guest",
        menuItems: studentMenuItems,
      };
  }
};

const Sidebar = ({ open, handleDrawerClose, pathname, variant = "permanent" }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Récupérer les informations de l'utilisateur connecté
  const currentUser = getCurrentUser();
  const userRole = getUserRole();

  const roleInfo = getRoleDetails(userRole);
  const { menuItems } = roleInfo;

  // Utiliser les informations de l'utilisateur pour afficher le nom et le rôle
  const name = currentUser ? currentUser.full_name : roleInfo.name;
  const roleName = currentUser ? currentUser.role : roleInfo.role;

  // Generate initials for the avatar (keeping this for reference)
  const initials = getInitials(name);

  const handleItemClick = (path) => {
    navigate(path);
    if (variant === "temporary") {
      handleDrawerClose();
    }
  };

  const renderMenuItems = (items) => {
    return items.map((item) => {
      const active = pathname === item.path;
      return (
        <ListItem key={item.path} disablePadding sx={{ display: "block", mb: 0.35, px: 1.25 }}>
          <Tooltip title={open ? null : item.text} placement="right">
            <ListItemButton
              onClick={() => handleItemClick(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: open ? 1.5 : 1,
                borderRadius: "12px",
                position: "relative",
                color: active ? "#071d35" : "text.secondary",
                bgcolor: active ? "rgba(16,207,201,0.14)" : "transparent",
                transition: "all 180ms ease",
                "&:before": active
                  ? {
                      content: '""',
                      position: "absolute",
                      left: -10,
                      width: 4,
                      height: 28,
                      borderRadius: 3,
                      bgcolor: theme.palette.primary.main,
                    }
                  : {},
                "&:hover": {
                  bgcolor: active ? "rgba(16,207,201,0.20)" : "rgba(7,29,53,0.055)",
                  color: active ? "#071d35" : "text.primary",
                  transform: "translateX(2px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                  color: active ? theme.palette.primary.main : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.88rem",
                  fontWeight: active ? 800 : 650,
                  noWrap: true,
                }}
                sx={{ opacity: open ? 1 : 0, m: 0 }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      );
    });
  };

  return (
    <Drawer 
      // @ts-ignore
      variant={variant} 
      open={open}
      onClose={handleDrawerClose}
      PaperProps={{ component: 'nav' }}
      sx={{
        display: { xs: 'block', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <DrawerHeader
        sx={{
          justifyContent: open ? "space-between" : "center",
          px: open ? 2 : 1,
          height: 72,
          minHeight: "72px !important",
        }}
      >
        {open && (
          <Stack direction="row" alignItems="center" spacing={1.15}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "11px",
                bgcolor: "rgba(16,207,201,0.14)",
                color: theme.palette.primary.main,
                display: "grid",
                placeItems: "center",
              }}
            >
              <SchoolOutlinedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ color: "text.primary", fontWeight: 850, fontSize: "0.82rem", lineHeight: 1.1 }}>
                Academic
              </Typography>
              <Typography sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.68rem", mt: 0.25 }}>
                Portal
              </Typography>
            </Box>
          </Stack>
        )}
        <IconButton
          onClick={handleDrawerClose}
          size="small"
          sx={{
            width: 34,
            height: 34,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <Box sx={{ px: open ? 2 : 1.25, py: 2 }}>
        <Box
          sx={{
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "rgba(7,29,53,0.07)",
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.025)" : "rgba(7,29,53,0.018)",
            p: open ? 1.25 : 0.75,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            gap: open ? 1.25 : 0,
          }}
        >
          <Avatar
            sx={{
              width: open ? 44 : 36,
              height: open ? 44 : 36,
              borderRadius: "12px",
              bgcolor: theme.palette.primary.main,
              color: "white",
              fontSize: open ? 15 : 12,
              fontWeight: 850,
              boxShadow: `0 8px 18px ${theme.palette.primary.main}30`,
              flexShrink: 0,
            }}
            alt={name}
          >
            {initials}
          </Avatar>
          {open && (
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ color: "text.primary", fontWeight: 800, fontSize: "0.84rem" }}>
                {name}
              </Typography>
              <Chip
                label={roleName}
                size="small"
                sx={{
                  height: 20,
                  mt: 0.35,
                  bgcolor: "rgba(16,207,201,0.12)",
                  color: theme.palette.primary.main,
                  fontWeight: 800,
                  fontSize: "0.65rem",
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Divider />

      <List>{renderMenuItems(menuItems.main)}</List>

      {menuItems.tools && (
        <>
          <Divider />
          <List>{renderMenuItems(menuItems.tools)}</List>
        </>
      )}

      {menuItems.analytics && (
        <>
          <Divider />
          <List>{renderMenuItems(menuItems.analytics)}</List>
        </>
      )}
    </Drawer>
  );
};

export default Sidebar;
