import { Box, Typography } from "@mui/material";
import colors from "../../theme/colors";

const StatCard = ({
  title,
  value,
  icon,
  description,
  accentColor = colors.primary,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: 3,
        p: 2.5,
        minHeight: 145,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0, 36, 61, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: colors.secondary,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        {icon && (
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              color: accentColor,
              backgroundColor: colors.lightBlue,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography
        variant="h4"
        sx={{
          mt: 2,
          color: colors.text,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      {description && (
        <Typography
          variant="caption"
          sx={{
            color: colors.secondary,
            mt: 1,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default StatCard;