import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Stack,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Canvas, useFrame } from "@react-three/fiber";

import api from "../services/api";
import TaskCard from "../components/TaskCard";
import SummaryCard from "../components/dashboard/SummaryCard";
import dashboardStyles from "../theme/dashboardStyles";
import colors from "../theme/colors";

function FloatingParticles() {
  const particles = [];

  for (let i = 0; i < 35; i++) {
    particles.push(
      <mesh
        key={i}
        position={[
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4,
        ]}
      >
        <sphereGeometry args={[0.025, 8, 8]} />

        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
      </mesh>,
    );
  }

  return <group>{particles}</group>;
}

function EmployeeScene() {
  const groupRef = useRef(null);

  useFrame(({ mouse }) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x +=
      (mouse.y * 0.08 - groupRef.current.rotation.x) * 0.02;

    groupRef.current.rotation.y +=
      (mouse.x * 0.12 - groupRef.current.rotation.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[2.5, 0, 0]}>
        <icosahedronGeometry args={[1.25, 1]} />

        <meshBasicMaterial
          color="#2F5D7C"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh position={[-2, 0.5, -1]}>
        <icosahedronGeometry args={[0.55, 1]} />

        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      <FloatingParticles />
    </group>
  );
}

function EmployeeDashboard() {
  const { employeeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    /*
     * Employee should only access their own dashboard.
     *
     * Manager can access any employee dashboard.
     */
    if (
      user.role === "EMPLOYEE" &&
      user.id !== employeeId
    ) {
      navigate(`/employee/${user.id}`, {
        replace: true,
      });

      return;
    }

    fetchEmployeeData();
  }, [employeeId, user]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);

      let employeeResponse;

      /*
       * Employee:
       * Use /auth/me because /users/** is manager-only.
       *
       * Manager:
       * Use /users/{employeeId} because the manager
       * can view any employee's details.
       */
      if (user.role === "EMPLOYEE") {
        employeeResponse = await api.get("/auth/me");
      } else {
        employeeResponse = await api.get(
          `/users/${employeeId}`,
        );
      }

      const tasksResponse = await api.get(
        `/tasks/employee/${employeeId}`,
      );

      setEmployee(employeeResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error(
        "Error fetching employee data:",
        error,
      );

      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    taskId,
    newStatus,
  ) => {
    try {
      setUpdatingTaskId(taskId);

      const response = await api.patch(
        `/tasks/${taskId}/status`,
        null,
        {
          params: {
            status: newStatus,
          },
        },
      );

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? response.data
            : task,
        ),
      );

      setMessage(
        "Task status updated successfully.",
      );

      setMessageType("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        "Error updating task status:",
        error,
      );

      const backendMessage =
        error.response?.data?.message ||
        "Unable to update task status. Please try again.";

      setMessage(backendMessage);
      setMessageType("error");
      setSnackbarOpen(true);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const ongoingTasks = tasks.filter(
    (task) => task.status === "ONGOING",
  ).length;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <CircularProgress
          sx={{
            color: colors.primary,
          }}
        />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: colors.background,
          pt: 8,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: `1px solid ${colors.border}`,
              textAlign: "center",
              backgroundColor: colors.white,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: colors.text,
              }}
            >
              Employee not found
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={dashboardStyles.page}>

      {/* HEADER */}

      <Box
        sx={{
          minHeight: {
            xs: 330,
            md: 360,
          },
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #003153 0%, #00243D 60%, #2F5D7C 100%)",
          color: colors.white,
          boxShadow:
            "0 20px 50px rgba(0,49,83,0.18)",
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
              position: [0, 0, 7],
              fov: 50,
            }}
          >
            <ambientLight intensity={0.5} />
            <EmployeeScene />
          </Canvas>
        </Box>

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 1,
            minHeight: "100%",
            py: {
              xs: 5,
              md: 7,
            },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box>
            <Chip
              label={
                user?.role === "MANAGER"
                  ? "EMPLOYEE DETAILS"
                  : "EMPLOYEE DASHBOARD"
              }
              size="small"
              sx={{
                mb: 2,
                color: colors.white,
                backgroundColor:
                  "rgba(255,255,255,0.12)",
                border:
                  "1px solid rgba(255,255,255,0.2)",
                fontWeight: 700,
                letterSpacing: 0.8,
                backdropFilter: "blur(8px)",
              }}
            />

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "2rem",
                  md: "3rem",
                },
                lineHeight: 1.15,
                mb: 1.5,
              }}
            >
              Welcome, {employee.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#D7E3EA",
                maxWidth: 500,
              }}
            >
              {user?.role === "MANAGER"
                ? "View the employee's assigned tasks and progress."
                : "Here is an overview of your assigned tasks and progress."}
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                mt: 3,
                flexWrap: "wrap",
                rowGap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.8,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <PersonIcon fontSize="small" />

                <Typography variant="body2">
                  {employee.id}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.8,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <AssignmentIcon fontSize="small" />

                <Typography variant="body2">
                  {tasks.length} Tasks
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* MAIN CONTENT */}

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >

        {/* SUMMARY CARDS */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 5,
          }}
        >
          <SummaryCard
            icon={<AssignmentIcon />}
            label="Total Tasks"
            value={tasks.length}
          />

          <SummaryCard
            icon={<AccessTimeIcon />}
            label="Ongoing Tasks"
            value={ongoingTasks}
          />

          <SummaryCard
            icon={<CheckCircleIcon />}
            label="Completed Tasks"
            value={completedTasks}
            iconColor={colors.success}
          />
        </Box>

        {/* TASK HEADER */}

        <Box sx={dashboardStyles.sectionHeader}>
          <Box>
            <Typography
              variant="h5"
              sx={dashboardStyles.sectionTitle}
            >
              {user?.role === "MANAGER"
                ? "Employee Tasks"
                : "My Tasks"}
            </Typography>

            <Typography
              variant="body2"
              sx={dashboardStyles.sectionSubtitle}
            >
              {user?.role === "MANAGER"
                ? "View the tasks assigned to this employee."
                : "View and manage the tasks assigned to you."}
            </Typography>
          </Box>

          <Chip
            icon={<AssignmentIcon />}
            label={`${tasks.length} Tasks`}
            sx={dashboardStyles.countChip}
          />
        </Box>

        <Divider
          sx={{
            mb: 3,
            borderColor: colors.border,
          }}
        />

        {/* TASK LIST */}

        {tasks.length === 0 ? (
          <Paper
            elevation={0}
            sx={dashboardStyles.emptyState}
          >
            <AssignmentIcon
              sx={{
                fontSize: 48,
                color: "#94A3B8",
                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: "#475569",
              }}
            >
              No tasks assigned
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: colors.secondary,
                mt: 0.5,
              }}
            >
              {user?.role === "MANAGER"
                ? "This employee currently has no assigned tasks."
                : "You currently don't have any assigned tasks."}
            </Typography>
          </Paper>
        ) : (
          <Box sx={dashboardStyles.taskGrid}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showStatusActions={true}
                onStatusChange={(newStatus) =>
                  handleStatusChange(
                    task.id,
                    newStatus,
                  )
                }
                updatingStatus={
                  updatingTaskId === task.id
                }
              />
            ))}
          </Box>
        )}
      </Container>

      {/* SUCCESS OR ERROR MESSAGE */}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messageType}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmployeeDashboard;