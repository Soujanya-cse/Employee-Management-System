import colors from "./colors";

export const cardBaseSx = {
  height: "100%",
  p: 2.5,
  borderRadius: 3,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.white,
  position: "relative",
  overflow: "hidden",
  transition:
    "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "#B8CBD8",
    boxShadow: "0 16px 35px rgba(15,23,42,0.08)",
  },
};

export const iconBoxSx = {
  width: 42,
  height: 42,
  borderRadius: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  backgroundColor: colors.lightBlue,
  color: colors.primary,
};

export const actionButtonSx = {
  width: 34,
  height: 34,
  borderRadius: 1.5,
};

export const sectionLabelSx = {
  color: colors.secondary,
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: 0.5,
  textTransform: "uppercase",
};

export const infoBoxSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.2,
  p: 1.4,
  borderRadius: 2,
  backgroundColor: colors.background,
};