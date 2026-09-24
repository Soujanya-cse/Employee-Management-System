import { useRef, useState } from "react";
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

import { Canvas, useFrame } from "@react-three/fiber";

import { useAuth } from "../context/AuthContext";
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

function FloatingParticles() {
  const particles = [];

  for (let i = 0; i < 55; i++) {
    particles.push(
      <mesh
        key={i}
        position={[
          (Math.random() - 0.5) * 13,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
        ]}
      >
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.35}
        />
      </mesh>
    );
  }

  return <group>{particles}</group>;
}

function MainShape() {
  const meshRef = useRef(null);

  useFrame(({ mouse }) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x +=
      (mouse.y * 0.45 - meshRef.current.rotation.x) *
      0.025;

    meshRef.current.rotation.y +=
      (mouse.x * 0.65 - meshRef.current.rotation.y) *
      0.025;
  });

  return (
    <mesh
      ref={meshRef}
      position={[3.2, 0.3, -1]}
    >
      <icosahedronGeometry args={[2.1, 1]} />

      <meshBasicMaterial
        color="#6F9BB8"
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function SecondaryShapes() {
  const groupRef = useRef(null);

  useFrame(({ mouse }) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.x +=
      (mouse.y * 0.25 - groupRef.current.rotation.x) *
      0.02;

    groupRef.current.rotation.y +=
      (mouse.x * 0.35 - groupRef.current.rotation.y) *
      0.02;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-3.4, 1.5, -1]}>
        <octahedronGeometry args={[1.1, 0]} />

        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh position={[3.8, -2.1, -2]}>
        <icosahedronGeometry args={[0.9, 1]} />

        <meshBasicMaterial
          color="#2F5D7C"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>

      <mesh position={[-3.2, -2, -1]}>
        <icosahedronGeometry args={[0.55, 1]} />

        <meshBasicMaterial
          color="#6F9BB8"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function ParallaxCamera() {
  useFrame(({ mouse, camera }) => {
    camera.position.x +=
      (mouse.x * 0.9 - camera.position.x) *
      0.025;

    camera.position.y +=
      (mouse.y * 0.6 - camera.position.y) *
      0.025;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function LoginScene() {
  return (
    <>
      <ambientLight intensity={1} />
      <ParallaxCamera />
      <MainShape />
      <SecondaryShapes />
      <FloatingParticles />
    </>
  );
}

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
          <LoginScene />
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