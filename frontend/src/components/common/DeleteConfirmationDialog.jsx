import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import colors from "../../theme/colors";

const DeleteConfirmationDialog = ({
  open,
  title,
  itemName,
  loading,
  onCancel,
  onConfirm,
  confirmText,
}) => (
  <Dialog
    open={open}
    onClose={loading ? undefined : onCancel}
    PaperProps={{
      sx: {
        width: "100%",
        maxWidth: 450,
        borderRadius: 3,
      },
    }}
  >
    <DialogTitle
      sx={{
        color: colors.text,
        fontWeight: 800,
      }}
    >
      {title}
    </DialogTitle>

    <DialogContent>
      <DialogContentText
        sx={{
          color: colors.secondary,
          lineHeight: 1.7,
        }}
      >
        Are you sure you want to delete <strong>{itemName}</strong>?
        <br />
        This action cannot be undone.
      </DialogContentText>
    </DialogContent>

    <DialogActions
      sx={{
        px: 3,
        pb: 3,
        gap: 1,
      }}
    >
      <Button
        onClick={onCancel}
        disabled={loading}
        sx={{
          color: "#475569",
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Cancel
      </Button>

      <Button
        onClick={onConfirm}
        variant="contained"
        disabled={loading}
        sx={{
          borderRadius: 2,
          backgroundColor: colors.error,
          textTransform: "none",
          fontWeight: 700,
          "&:hover": {
            backgroundColor: "#B91C1C",
          },
        }}
      >
        {loading ? "Deleting..." : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;