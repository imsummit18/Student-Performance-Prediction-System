import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowForward,
  Insights,
  Person,
  School,
  SupervisorAccount,
  VerifiedUser,
} from "@mui/icons-material";
import PageTitle from "../components/PageTitle";

const roles = [
  {
    id: "admin",
    title: "Administrator",
    description: "Manage students, teachers, classes and academic data.",
    icon: <SupervisorAccount sx={{ fontSize: 34 }} />,
    accent: "#10cfc9",
    button: "Open Admin Portal",
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Monitor classes, manage grades and track student performance.",
    icon: <School sx={{ fontSize: 34 }} />,
    accent: "#526df5",
    button: "Open Teacher Portal",
  },
  {
    id: "student",
    title: "Student",
    description: "View grades, progress, alerts and personalized guidance.",
    icon: <Person sx={{ fontSize: 34 }} />,
    accent: "#f5a524",
    button: "Open Student Portal",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#072038",
      }}
    >
      <PageTitle
        title="Student Performance Prediction System"
        description="Academic monitoring, prediction and student performance analysis platform."
      />

      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          right: { xs: -300, md: -180 },
          top: { xs: -260, md: -220 },
          background:
            "radial-gradient(circle, rgba(16,207,201,0.28) 0%, rgba(16,207,201,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: { xs: 4, md: 5 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  bgcolor: "rgba(16, 207, 201, 0.16)",
                  border: "1px solid rgba(16, 207, 201, 0.38)",
                  color: "#56e0da",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <School />
              </Box>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "1.05rem", sm: "1.25rem" },
                }}
              >
                Academic Portal
              </Typography>
            </Stack>
          </Link>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
          >
            <VerifiedUser sx={{ fontSize: 18, color: "#56e0da" }} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Secure institutional access
            </Typography>
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 5 },
            borderRadius: { xs: "20px", md: "28px" },
            border: "1px solid rgba(255,255,255,0.72)",
            bgcolor: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 24px 70px rgba(3, 19, 38, 0.28)",
          }}
        >
          <Grid
            container
            spacing={{ xs: 3, md: 5 }}
            alignItems="center"
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Grid item xs={12} md={8}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 3,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                  }}
                />
                <Typography
                  sx={{
                    color: "primary.main",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Group 6B · 2026/2027
                </Typography>
              </Stack>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.45rem", md: "3.05rem" },
                  lineHeight: 1.08,
                  letterSpacing: "-0.045em",
                  color: "#071d35",
                  maxWidth: 760,
                  mb: 1.5,
                }}
              >
                Predict performance.{" "}
                <Box
                  component="span"
                  sx={{ color: "primary.main" }}
                >
                  Support success.
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.08rem" },
                  lineHeight: 1.75,
                  maxWidth: 680,
                }}
              >
                A unified academic platform for monitoring progress, analyzing
                results and making informed decisions throughout the student
                journey.
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Paper
                elevation={0}
                sx={{
                  ml: "auto",
                  maxWidth: 270,
                  p: 2.5,
                  borderRadius: "18px",
                  bgcolor: "#071d35",
                  color: "white",
                  transform: "rotate(1deg)",
                  boxShadow: "0 16px 40px rgba(7,29,53,0.18)",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      bgcolor: "rgba(16,207,201,0.16)",
                      color: "#56e0da",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Insights />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.62)",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                      }}
                    >
                      PLATFORM
                    </Typography>
                    <Typography sx={{ fontWeight: 800, mt: 0.25 }}>
                      Data-driven insights
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            {roles.map((role) => (
              <Grid item xs={12} md={4} key={role.id}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    minHeight: { xs: 230, md: 260 },
                    p: { xs: 2.5, md: 3 },
                    borderRadius: "18px",
                    border: "1px solid",
                    borderColor: "rgba(7,29,53,0.09)",
                    bgcolor: "white",
                    display: "flex",
                    flexDirection: "column",
                    transition:
                      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: `${role.accent}70`,
                      boxShadow: `0 18px 38px ${role.accent}1A`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: "16px",
                      bgcolor: `${role.accent}16`,
                      color: role.accent,
                      display: "grid",
                      placeItems: "center",
                      mb: 2,
                    }}
                  >
                    {role.icon}
                  </Box>
                  <Typography
                    component="h2"
                    sx={{
                      fontWeight: 800,
                      color: "#071d35",
                      fontSize: "1.25rem",
                      mb: 0.75,
                    }}
                  >
                    {role.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.65,
                      flexGrow: 1,
                      mb: 2.5,
                      fontSize: "0.93rem",
                    }}
                  >
                    {role.description}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(`/login/${role.id}`)}
                    sx={{
                      minHeight: 48,
                      borderRadius: "10px",
                      bgcolor: "#071d35",
                      color: "white",
                      fontWeight: 800,
                      justifyContent: "space-between",
                      px: 2,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: role.accent,
                        boxShadow: `0 8px 18px ${role.accent}35`,
                      },
                    }}
                  >
                    {role.button}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Alert
            severity="info"
            icon={<VerifiedUser />}
            sx={{
              mt: 3,
              borderRadius: "12px",
              bgcolor: "#eef7f7",
              color: "#36505d",
              border: "1px solid #d7ebea",
              "& .MuiAlert-icon": { color: "#10aaa5" },
              "& .MuiAlert-message": {
                fontWeight: 600,
                fontSize: "0.86rem",
              },
            }}
          >
          Group 6B — Accounts are provided and managed by the administration.
          </Alert>
        </Paper>

        <Typography
          align="center"
          sx={{
            mt: 2.5,
            color: "rgba(255,255,255,0.78)",
            fontWeight: 600,
            fontSize: { xs: "0.75rem", sm: "0.82rem" },
            letterSpacing: "0.01em",
          }}
        >
          Group 6B  · Student Performance Prediction System
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingPage;
