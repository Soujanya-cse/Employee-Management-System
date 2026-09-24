import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import colors from "../../theme/colors";

const EmptyState = ({
  title = "No data available",
  message = "There is nothing to display here.",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 6,
        px: 2,
        border: `1px dashed ${colors.border}`,
        borderRadius: 3,
        backgroundColor: colors.white,
      }}
    >
      <InboxOutlinedIcon
        sx={{
          fontSize: 48,
          color: colors.secondary,
          mb: 1.5,
        }}
      />

      <Typography
        variant="h6"
        sx={{
          color: colors.text,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: colors.secondary,
          mt: 0.5,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;