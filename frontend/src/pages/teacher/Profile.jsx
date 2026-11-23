import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Divider,
  alpha,
  useTheme,
  InputAdornment,
  IconButton,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  Save,
} from "@mui/icons-material";
import { fetchWithTokenRefresh, logout } from "../../utils/auth";
import { API_BASE_URL } from "../../config";
import { ManagementHeader } from "../../components/ManagementUI";

const Profile = () => {
  const [teacher, setTeacher] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  // Couleur de thème pour l'enseignant
  const teacherColor = theme.palette.primary.main;

  // Récupérer les données de l'enseignant au montage du composant
  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const response = await fetchWithTokenRefresh(
        `${API_BASE_URL}/teacher/profile/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        setTeacher(data.data);
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to fetch profile data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match",
        severity: "error",
      });
      return;
    }

    if (password.length < 8) {
      setSnackbar({
        open: true,
        message: "Password must be at least 8 characters",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await fetchWithTokenRefresh(
        `${API_BASE_URL}/teacher/update-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ password }),
        },
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Password updated successfully",
          severity: "success",
        });
        setPassword("");
        setConfirmPassword("");
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        <LinearProgress
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(16,207,201,0.12)",
            "& .MuiLinearProgress-bar": { bgcolor: teacherColor },
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <ManagementHeader
        eyebrow="Personal settings"
        title="Teacher Profile"
        description="Review your account information and keep your password secure."
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          gap: 2.5,
        }}
      >
        <Card
          elevation={0}
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 calc(41.6667% - 7px)" },
            minWidth: 0,
            minHeight: 430,
            borderRadius: "18px",
            border: "1px solid rgba(7,29,53,0.08)",
            overflow: "hidden",
            boxShadow: "0 8px 26px rgba(7,29,53,0.035)",
          }}
        >
          {/* <Box
            sx={{
              p: 3,
              minHeight: 170,
              color: "white",
              background: "linear-gradient(135deg, #071d35 0%, #0b3154 100%)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: "22px",
                bgcolor: "rgba(16,207,201,0.16)",
                border: "1px solid rgba(86,224,218,0.35)",
                color: "#56e0da",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Person sx={{ fontSize: 42 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: "#56e0da",
                  fontWeight: 800,
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  mb: 0.5,
                }}
              >
                Teacher account
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontWeight: 850,
                  fontSize: { xs: "1.25rem", md: "1.55rem" },
                  letterSpacing: "-0.03em",
                }}
              >
                {teacher.first_name} {teacher.last_name}
              </Typography>
              <Typography
                noWrap
                sx={{
                  color: "rgba(255,255,255,0.68)",
                  fontSize: "0.84rem",
                  mt: 0.5,
                }}
              >
                {teacher.email || "No email available"}
              </Typography>
            </Box>
          </Box> */}

          <CardContent sx={{ p: 3 }}>
            <Typography
              sx={{
                color: "#071d35",
                fontWeight: 850,
                fontSize: "1rem",
                mb: 2.5,
              }}
            >
              Personal information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={teacher.first_name}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "text.disabled" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={teacher.last_name}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "text.disabled" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={teacher.email}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "text.disabled" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  value={teacher.phone}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: "text.disabled" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 calc(58.3333% - 7px)" },
            minWidth: 0,
            minHeight: 430,
            borderRadius: "18px",
            border: "1px solid rgba(7,29,53,0.08)",
            boxShadow: "0 8px 26px rgba(7,29,53,0.035)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  bgcolor: "rgba(82,109,245,0.10)",
                  color: "#526df5",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Lock />
              </Box>
              <Box>
                <Typography
                  sx={{ color: "#071d35", fontWeight: 850, fontSize: "1rem" }}
                >
                  Change Password
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.78rem",
                    mt: 0.25,
                  }}
                >
                  Protect your account with a strong password
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle confirm password visibility"
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {password && (
                <Box sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.75,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      Password strength
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {password.length < 6
                        ? "Weak"
                        : password.length < 8
                          ? "Medium"
                          : !/[A-Z]/.test(password)
                            ? "Good"
                            : "Excellent"}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      password.length < 6
                        ? 25
                        : password.length < 8
                          ? 50
                          : !/[A-Z]/.test(password)
                            ? 75
                            : 100
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(7,29,53,0.08)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        bgcolor:
                          password.length < 6
                            ? theme.palette.error.main
                            : password.length < 8
                              ? theme.palette.warning.main
                              : !/[A-Z]/.test(password)
                                ? theme.palette.info.main
                                : theme.palette.success.main,
                      },
                    }}
                  />
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handlePasswordChange}
                disabled={!password || !confirmPassword}
                startIcon={<Save />}
                sx={{
                  minHeight: 48,
                  px: 3,
                  borderRadius: "12px",
                  bgcolor: "#071d35",
                  fontWeight: 850,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#10aaa5",
                    boxShadow: "0 10px 24px rgba(16,207,201,0.20)",
                  },
                }}
              >
                Update Password
              </Button>

              <Typography
                sx={{
                  mt: 2.5,
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  lineHeight: 1.6,
                }}
              >
                For best security, use at least 8 characters with uppercase
                letters, lowercase letters and numbers.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
