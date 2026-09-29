import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

import { Canvas } from "@react-three/fiber";

import { useAuth } from "../context/AuthContext";
import AuthBackgroundScene from "../components/common/AuthBackgroundScene";
import colors from "../theme/colors";
import { fieldSx } from "../theme/formStyles";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");

  const registrationMessage =
    location.state?.message || "";

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    setError("");

    try {
      const user = await login(
        data.email.trim(),
        data.password
      );

      if (user.type === "MANAGER") {
        navigate("/manager");
      } else if (user.type === "EMPLOYEE") {
        navigate(`/employee/${user.id}`);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(
            circle at 15% 20%,
            rgba(47, 93, 124, 0.45),
            transparent 32%
          ),
          radial-gradient(
            circle at 85% 75%,
            rgba(111, 155, 184, 0.18),
            transparent 35%
          ),
          #003153
        `,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 52,
          }}
        >
          <AuthBackgroundScene />
        </Canvas>
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,49,83,0.35), rgba(0,49,83,0.05), rgba(0,49,83,0.4))",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: {
              xs: 3,
              sm: 4,
            },
            borderRadius: 4,
            backgroundColor:
              "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(18px)",
            border:
              "1px solid rgba(255,255,255,0.6)",
            boxShadow:
              "0 30px 80px rgba(0, 0, 0, 0.32)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              borderRadius:
                "16px 16px 0 0",
              background: `
                linear-gradient(
                  90deg,
                  ${colors.primary},
                  ${colors.steelBlue}
                )
              `,
            },
          }}
        >
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 3.5 }}
          >
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.white,
                background: `
                  linear-gradient(
                    135deg,
                    ${colors.primary},
                    ${colors.steelBlue}
                  )
                `,
                boxShadow:
                  "0 12px 28px rgba(0,49,83,0.25)",
              }}
            >
              <BusinessCenterOutlinedIcon
                sx={{
                  fontSize: 34,
                }}
              />
            </Box>

            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                color: colors.text,
                textAlign: "center",
              }}
            >
              Employee Management
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Sign in to access your dashboard
            </Typography>
          </Stack>

          {registrationMessage && (
            <Alert
              severity="success"
              sx={{
                mb: 2.5,
                borderRadius: 2,
              }}
            >
              {registrationMessage}
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(handleLogin)}
            noValidate
          >
            <TextField
              label="Email"
              type="email"
              placeholder="Enter your email"
              fullWidth
              autoFocus
              disabled={isSubmitting}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              sx={{
                ...fieldSx,
                mb: 2.5,
              }}
              {...register("email")}
            />

            <TextField
              label="Password"
              type="password"
              placeholder="Enter your password"
              fullWidth
              disabled={isSubmitting}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              sx={{
                ...fieldSx,
                mb: 3,
              }}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              startIcon={
                !isSubmitting && (
                  <LockOutlinedIcon />
                )
              }
              sx={{
                height: 50,
                borderRadius: 2,
                backgroundColor: colors.primary,
                color: colors.white,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
                boxShadow:
                  "0 8px 22px rgba(0,49,83,0.25)",
                "&:hover": {
                  backgroundColor: colors.deepBlue,
                  boxShadow:
                    "0 12px 28px rgba(0,49,83,0.32)",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress
                  size={23}
                  sx={{
                    color: colors.white,
                  }}
                />
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Button
            variant="text"
            fullWidth
            disabled={isSubmitting}
            onClick={() =>
              navigate("/register-manager")
            }
            sx={{
              mt: 1.5,
              color: colors.primary,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Create Manager Account
          </Button>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              textAlign: "center",
              color: colors.secondary,
            }}
          >
            Secure access for managers and employees.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;