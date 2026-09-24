import { useEffect, useState } from "react";

import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";

import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "../services/api";
import colors from "../theme/colors";
import {
  fieldSx,
  drawerPaperSx,
  drawerHeaderSx,
  drawerFooterSx,
} from "../theme/formStyles";

const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Employee name is required")
    .regex(
      /^[a-zA-Z ]+$/,
      "Name must contain only letters and spaces"
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z.string(),
});

function EmployeeDrawer({
  open,
  employee,
  onClose,
  onSaved,
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(employee);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    reset({
      name: employee?.name || "",
      email: employee?.email || "",
      password: "",
    });

    setError("");
  }, [employee, open, reset]);

  const onSubmit = async (data) => {
    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim();
    const trimmedPassword = data.password.trim();

    if (!isEditing && !trimmedPassword) {
      setError("Password is required.");
      return;
    }

    if (!isEditing && trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEditing) {
        await api.put(`/users/${employee.id}`, {
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        });
      } else {
        await api.post("/users", {
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        });
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error(
        "Error saving employee:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to save employee. Please try again."
      );
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
          sx: {
            ...drawerPaperSx,
            width: {
              xs: "100vw",
              sm: 430,
            },
          },
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
        <Box sx={drawerHeaderSx}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <PersonAddOutlinedIcon />

            <Typography
              variant="h6"
              fontWeight={800}
            >
              {isEditing
                ? "Edit Employee"
                : "Add Employee"}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 0.8,
              color: "#D7E3EA",
            }}
          >
            {isEditing
              ? "Update employee information."
              : "Add a new employee to your team."}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Box
            sx={{
              p: 3,
              flex: 1,
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
              >
                {error}
              </Alert>
            )}

            <Typography
              variant="subtitle2"
              fontWeight={800}
              sx={{
                color: colors.text,
                mb: 1,
              }}
            >
              Employee details
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TextField
              label="Employee name"
              placeholder="Enter employee name"
              fullWidth
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={fieldSx}
              {...register("name")}
            />

            <TextField
              label="Email"
              placeholder="Enter employee email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                ...fieldSx,
                mt: 2.5,
              }}
              {...register("email")}
            />

            <TextField
              label={
                isEditing
                  ? "New Password"
                  : "Password"
              }
              placeholder={
                isEditing
                  ? "Leave empty to keep current password"
                  : "Enter employee password"
              }
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={
                errors.password?.message
              }
              sx={{
                ...fieldSx,
                mt: 2.5,
              }}
              {...register("password")}
            />

            {isEditing && (
              <TextField
                label="Employee ID"
                value={employee.id}
                fullWidth
                disabled
                sx={{
                  ...fieldSx,
                  mt: 2.5,
                }}
              />
            )}

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: colors.secondary,
                mt: 2,
              }}
            >
              {isEditing
                ? "Enter a new password only if you want to reset the employee's password."
                : "The employee role will be assigned automatically."}
            </Typography>
          </Box>

          <Box sx={drawerFooterSx}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={saving || isSubmitting}
              sx={{
                borderColor: colors.border,
                color: colors.secondary,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving || isSubmitting}
              sx={{
                minWidth: 130,
                backgroundColor: colors.primary,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: colors.deepBlue,
                },
              }}
            >
              {saving || isSubmitting ? (
                <CircularProgress
                  size={22}
                  sx={{
                    color: colors.white,
                  }}
                />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Employee"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default EmployeeDrawer;