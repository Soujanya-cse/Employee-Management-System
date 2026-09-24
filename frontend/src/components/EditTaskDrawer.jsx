import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

import api from "../services/api";
import colors from "../theme/colors";
import {
  fieldSx,
  drawerPaperSx,
  drawerHeaderSx,
} from "../theme/formStyles";
import { taskSchema } from "../validation/taskSchema";

function EditTaskDrawer({
  open,
  task,
  employees,
  onClose,
  onUpdated,
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] =
    useState("success");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      assignedTo: "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "",
        assignedTo: task.assignedTo || "",
      });

      setMessage("");
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    if (!task) return;

    setSaving(true);
    setMessage("");

    try {
      await api.put(`/tasks/${task.id}`, data);

      setMessage("Task changes saved successfully.");
      setMessageSeverity("success");

      onUpdated();
    } catch (error) {
      console.error("Error updating task:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save task changes. Please try again.",
      );

      setMessageSeverity("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: drawerPaperSx,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}

        <Box
          sx={{
            ...drawerHeaderSx,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <EditNoteOutlinedIcon />

            <Typography variant="h5" fontWeight={800}>
              Edit Task
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 0.6,
              color: "#B8CBD8",
            }}
          >
            Update the task details below.
          </Typography>
        </Box>

        {/* Content */}

        <Box
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
          }}
        >
          {message && (
            <Alert
              severity={messageSeverity}
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "grid",
              gap: 2.2,
            }}
          >
            <TextField
              label="Title"
              placeholder="Example: Complete frontend"
              fullWidth
              {...register("title")}
              error={Boolean(errors.title)}
              helperText={
                errors.title?.message ||
                "Use letters and spaces only"
              }
              sx={fieldSx}
            />

            <TextField
              label="Description"
              placeholder="Example: complete the frontend task"
              fullWidth
              multiline
              rows={4}
              {...register("description")}
              error={Boolean(errors.description)}
              helperText={
                errors.description?.message ||
                "Use lowercase letters and spaces only"
              }
              sx={fieldSx}
            />

            <TextField
              select
              label="Priority"
              fullWidth
              defaultValue=""
              {...register("priority")}
              error={Boolean(errors.priority)}
              helperText={
                errors.priority?.message ||
                "Select a priority"
              }
              sx={fieldSx}
            >
              <MenuItem value="">Select priority</MenuItem>
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
            </TextField>

            <TextField
              select
              label="Assign employee"
              fullWidth
              {...register("assignedTo")}
              error={Boolean(errors.assignedTo)}
              helperText={
                errors.assignedTo?.message ||
                "Select an employee"
              }
              sx={fieldSx}
            >
              <MenuItem value="">Select an employee</MenuItem>

              {employees.map((employee) => (
                <MenuItem
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name} ({employee.id})
                </MenuItem>
              ))}
            </TextField>

            <Divider sx={{ my: 0.5 }} />

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={saving}
                sx={{
                  py: 1.2,
                  backgroundColor: colors.primary,
                  color: colors.white,
                  borderRadius: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: colors.deepBlue,
                  },
                }}
              >
                {saving ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: colors.white }}
                  />
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={onClose}
                disabled={saving}
                sx={{
                  py: 1.2,
                  color: colors.primary,
                  borderColor: colors.primary,
                  borderRadius: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: colors.deepBlue,
                    backgroundColor: colors.lightBlue,
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default EditTaskDrawer;