import { Box } from "@mui/material";
import colors from "../../theme/colors";

const DashboardSection = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default DashboardSection;