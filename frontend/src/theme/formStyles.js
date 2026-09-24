import colors from "./colors";

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: colors.white,
    borderRadius: 1.5,

    "& fieldset": {
      borderColor: colors.border,
      transition: "border-color 0.2s ease",
    },

    "&:hover fieldset": {
      borderColor: colors.steelBlue,
    },

    "&.Mui-focused fieldset": {
      borderColor: colors.primary,
      borderWidth: 2,
    },

    "&.Mui-error fieldset": {
      borderColor: colors.error,
    },
  },

  "& .MuiInputLabel-root": {
    color: colors.secondary,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: colors.primary,
  },

  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    color: colors.secondary,
  },

  "& .MuiFormHelperText-root.Mui-error": {
    color: colors.error,
  },

  "& input::placeholder": {
    color: "#94A3B8",
    opacity: 1,
  },

  "& textarea::placeholder": {
    color: "#94A3B8",
    opacity: 1,
  },
};

export const drawerPaperSx = {
  width: {
    xs: "100vw",
    sm: 450,
  },
  backgroundColor: colors.background,
};

export const drawerHeaderSx = {
  px: 3,
  py: 3,
  background: `linear-gradient(135deg, ${colors.primary}, ${colors.deepBlue})`,
  color: colors.white,
};

export const drawerFooterSx = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 1.5,
  p: 3,
  borderTop: `1px solid ${colors.border}`,
  backgroundColor: colors.white,
};