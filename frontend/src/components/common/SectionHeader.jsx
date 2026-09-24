import { Box, Typography } from "@mui/material";
import { sectionLabelSx } from "../../theme/cardStyles";

const SectionHeader = ({ title, subtitle, action }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography sx={sectionLabelSx}>{title}</Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default SectionHeader;