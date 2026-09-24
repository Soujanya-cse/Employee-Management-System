import { Box, Paper, Typography } from "@mui/material";

const colors = {
  primary: "#003153",
  white: "#FFFFFF",
  text: "#172033",
  secondary: "#64748B",
  border: "#E2E8F0",
  lightBlue: "#E8F0F5",
};

function SummaryCard({ icon, label, value, iconColor }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 180,
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.white,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0, 49, 83, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2.5,
          backgroundColor: colors.lightBlue,
          color: iconColor || colors.primary,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{
            color: colors.secondary,
            mb: 0.5,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            color: colors.text,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

export default SummaryCard;