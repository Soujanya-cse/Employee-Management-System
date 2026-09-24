import { Box, CircularProgress, Typography } from "@mui/material";
import colors from "../../theme/colors";

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        gap: 1.5,
      }}
    >
      <CircularProgress
        size={32}
        thickness={4}
        sx={{
          color: colors.primary,
        }}
      />

      <Typography
        variant="body2"
        sx={{
          color: colors.secondary,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;