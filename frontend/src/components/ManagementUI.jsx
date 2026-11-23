import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export const ManagementHeader = ({
  eyebrow = "Administration",
  title,
  description,
  action = null,
}) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "stretch", sm: "center" }}
    spacing={2}
    sx={{
      mb: 3,
      p: { xs: 2.25, md: 3 },
      borderRadius: "18px",
      background: "linear-gradient(135deg, #071d35 0%, #0b3154 100%)",
      color: "white",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Typography
        sx={{
          color: "#56e0da",
          fontWeight: 800,
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          mb: 0.75,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        sx={{
          fontWeight: 850,
          fontSize: { xs: "1.55rem", md: "2rem" },
          letterSpacing: "-0.035em",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.68)", fontSize: "0.88rem" }}>
        {description}
      </Typography>
    </Box>
    {action && (
      <Box sx={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
        {action}
      </Box>
    )}
  </Stack>
);

export const ManagementStat = ({
  title,
  value,
  icon,
  color = "#10cfc9",
  subtitle,
}) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: "16px",
      border: "1px solid rgba(7,29,53,0.08)",
      transition: "transform 180ms ease, box-shadow 180ms ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 14px 34px ${color}18`,
      },
    }}
  >
    <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: 52,
            height: 52,
            borderRadius: "14px",
            bgcolor: `${color}14`,
            color,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              fontSize: "0.68rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: "#071d35",
              fontWeight: 850,
              fontSize: "1.55rem",
              lineHeight: 1.15,
              my: 0.35,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export const ManagementTable = ({ title, subtitle, action = null, children }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: "16px",
      border: "1px solid rgba(7,29,53,0.08)",
      boxShadow: "0 8px 26px rgba(7,29,53,0.035)",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        px: 2.5,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box>
        <Typography
          sx={{ color: "#071d35", fontWeight: 850, fontSize: "1rem" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ color: "text.secondary", fontSize: "0.76rem", mt: 0.25 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    {children}
  </Card>
);

export const DeleteConfirmationDialog = ({
  open,
  title,
  name,
  onClose,
  onConfirm,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { borderRadius: "18px" } }}
  >
    <DialogContent sx={{ px: 3, pt: 3, textAlign: "center" }}>
      <Avatar
        sx={{
          mx: "auto",
          mb: 2,
          width: 64,
          height: 64,
          borderRadius: "18px",
          bgcolor: "rgba(239,68,68,0.10)",
          color: "#ef4444",
        }}
      >
        <WarningAmberRoundedIcon />
      </Avatar>
      <DialogTitle
        sx={{
          p: 0,
          mb: 1,
          color: "#071d35",
          fontWeight: 850,
          fontSize: "1.25rem",
        }}
      >
        {title}
      </DialogTitle>
      <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
        {name
          ? `Are you sure you want to delete “${name}”?`
          : "Are you sure you want to delete this record?"}
      </Typography>
      <Typography
        sx={{
          color: "error.main",
          mt: 1,
          fontSize: "0.78rem",
          fontWeight: 700,
        }}
      >
        This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, py: 2.5, justifyContent: "center", gap: 1 }}>
      <Button
        onClick={onClose}
        sx={{ color: "text.secondary", fontWeight: 750, minWidth: 100 }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        sx={{
          minWidth: 110,
          borderRadius: "10px",
          bgcolor: "#d32f2f",
          fontWeight: 800,
          "&:hover": { bgcolor: "#c62828" },
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export const ManagementPagination = ({ count, page, onPageChange }) => (
  <Stack
    spacing={2}
    sx={{
      py: 2,
      px: 2.5,
      borderTop: "1px solid",
      borderColor: "divider",
      display: "flex",
      justifyContent: "end",
      alignItems: "end",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, count)} of {count}{" "}
      results
    </Typography>
    <Pagination
      count={Math.ceil(count / 10)}
      page={page}
      onChange={(event, value) => onPageChange(value)}
      variant="outlined"
      shape="rounded"
      sx={{
        justifyContent: "center",
        "& .MuiPaginationItem-root": { borderRadius: "10px" },
      }}
    />
  </Stack>
);
