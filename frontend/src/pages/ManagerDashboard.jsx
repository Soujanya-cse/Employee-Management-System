import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import BlockIcon from "@mui/icons-material/Block";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { Canvas, useFrame } from "@react-three/fiber";

import api from "../services/api";
import EmployeeCard from "../components/EmployeeCard";
import TaskCard from "../components/TaskCard";
import EditTaskDrawer from "../components/EditTaskDrawer";
import EmployeeDrawer from "../components/EmployeeDrawer";

import { taskSchema } from "../validation/taskSchema";

import colors from "../theme/colors";
import { fieldSx } from "../theme/formStyles";

import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";

import { useAuth } from "../context/AuthContext";
import FloatingParticles from "../components/common/FloatingParticles";
import DeleteConfirmationDialog from "../components/common/DeleteConfirmationDialog";

const drawerWidth = 240;

/* ------------------------------------------------ */
/* 3D BACKGROUND                                    */
/* ------------------------------------------------ */

function AnimatedScene() {
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
      <mesh position={[2.2, 0.4, 0]}>
        <icosahedronGeometry args={[1.35, 1]} />

        <meshBasicMaterial
          color="#2F5D7C"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>

      <mesh position={[-2.2, -0.5, -1]}>
        <icosahedronGeometry args={[0.7, 1]} />

        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      <FloatingParticles
        count={45}
        spreadX={10}
        spreadY={5}
        spreadZ={5}
        opacity={0.55}
      />
    </group>
  );
}

/* ------------------------------------------------ */
/* DELETE DIALOG                                    */
/* ------------------------------------------------ */

/* ------------------------------------------------ */
/* SECTION TITLE                                    */
/* ------------------------------------------------ */

function DashboardTitle({ title, subtitle, icon }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.primary,
            border: "1px solid #D9E4EA",
            borderRadius: 1.5,
            backgroundColor: "#F7FAFC",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "1.65rem", md: "2rem" },
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -0.7,
            color: colors.text,
          }}
        >
          {title}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: 0.8,
          ml: 5.4,
          color: colors.secondary,
          fontSize: "0.9rem",
          lineHeight: 1.6,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

/* ------------------------------------------------ */
/* WORKLOAD METRIC                                  */
/* ------------------------------------------------ */

/* ------------------------------------------------ */
/* WORKLOAD EMPLOYEE ROW                            */
/* ------------------------------------------------ */

function WorkloadEmployeeCard({ employee }) {
  const total = employee.totalTasks || 0;

  return (
    <Box
      sx={{
        py: 2.5,
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid #E7EDF1",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(210px, 0.9fr) minmax(70px, 0.2fr) minmax(420px, 1.9fr)",
          },
          alignItems: "center",
          gap: { xs: 2, md: 3 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 42,
              height: 42,
              backgroundColor: "#EAF1F5",
              color: colors.primary,
              fontWeight: 800,
              fontSize: "0.9rem",
            }}
          >
            {employee.employeeName?.charAt(0)?.toUpperCase() || "E"}
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontWeight: 750,
                color: colors.text,
                fontSize: "0.95rem",
              }}
            >
              {employee.employeeName}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                color: colors.secondary,
                fontSize: "0.74rem",
              }}
            >
              {employee.employeeId}
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Typography
            sx={{
              fontSize: "1.55rem",
              fontWeight: 800,
              color: colors.primary,
              lineHeight: 1,
            }}
          >
            {total}
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: "0.68rem",
              color: colors.secondary,
            }}
          >
            {total === 1 ? "task" : "tasks"}
          </Typography>
        </Box>

        <Stack spacing={1.15}>
          <WorkloadBar
            label="To-Do"
            value={employee.todoTasks}
            total={total}
            color="#999690"
          />
          <WorkloadBar
            label="Ongoing"
            value={employee.ongoingTasks}
            total={total}
            color="#3B82F6"
          />
          <WorkloadBar
            label="Blocked"
            value={employee.blockedTasks}
            total={total}
            color="#D64545"
          />
          <WorkloadBar
            label="Completed"
            value={employee.completedTasks}
            total={total}
            color="#2F8F62"
          />
        </Stack>
      </Box>
    </Box>
  );
}

function WorkloadBar({ label, value = 0, total = 0, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Typography
        sx={{
          width: 68,
          flexShrink: 0,
          fontSize: "0.7rem",
          fontWeight: 650,
          color: colors.secondary,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          flex: 1,
          height: 6,
          borderRadius: 10,
          backgroundColor: "#EDF1F3",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: "100%",
            borderRadius: 10,
            backgroundColor: color,
            transition: "width 0.3s ease",
          }}
        />
      </Box>

      <Typography
        sx={{
          width: 22,
          textAlign: "right",
          fontSize: "0.78rem",
          fontWeight: 750,
          color: value > 0 ? colors.text : "#A7B0B6",
        }}
      >
        {value || 0}
      </Typography>
    </Stack>
  );
}

/* ------------------------------------------------ */
/* WORKLOAD PAGE                                    */
/* ------------------------------------------------ */

function ManagerWorkloadPage({
  employeeWorkload,
  loadingEmployeeWorkload,
  onBack,
}) {
  return (
    <Box
      sx={{
        py: 0,
      }}
    >
      <Button
        size="small"
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{
          minHeight: 30,
          px: 1.25,
          py: 0.4,
          mb: 2,
          borderRadius: 1.5,
          color: colors.primary,
          borderColor: "#C8D6DE",
          textTransform: "none",
          fontWeight: 700,
          "&:hover": {
            borderColor: colors.primary,
            backgroundColor: "#F4F8FA",
          },
        }}
      >
        Back to Dashboard
      </Button>

      <Stack sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.primary,
                border: "1px solid #D9E4EA",
                borderRadius: 1.5,
                backgroundColor: "#F7FAFC",
              }}
            >
              <AssignmentIcon />
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                fontWeight: 800,
                letterSpacing: -0.8,
                color: colors.text,
              }}
            >
              Employee Workload
            </Typography>
          </Stack>

          <Typography
            sx={{
              mt: 1,
              ml: { xs: 0, sm: 6.1 },
              color: colors.secondary,
              fontSize: "0.9rem",
            }}
          >
            See how each employee's tasks are distributed.
          </Typography>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid #DDE5EA",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, md: 3 },
            py: 1.75,
            backgroundColor: "#F7F9FA",
            borderBottom: "1px solid #E5EBEF",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(210px, 0.9fr) minmax(70px, 0.2fr) minmax(420px, 1.9fr)",
              },
              gap: { xs: 1, md: 3 },
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: colors.secondary,
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.75,
              }}
            >
              Employee
            </Typography>

            <Typography
              sx={{
                color: colors.secondary,
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.75,
              }}
            >
              Total
            </Typography>

            <Stack
              direction="row"
              spacing={{ xs: 1.5, md: 2 }}
              alignItems="center"
              flexWrap="wrap"
              rowGap={0.75}
            >
              {[
                { label: "To-Do", color: "#3B82F6" },
                { label: "Ongoing", color: "#D99000" },
                { label: "Blocked", color: "#D64545" },
                { label: "Completed", color: "#2F8F62" },
              ].map((item) => (
                <Stack
                  key={item.label}
                  direction="row"
                  spacing={0.55}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: item.color,
                    }}
                  />

                  <Typography
                    sx={{
                      color: colors.secondary,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Box>

        {loadingEmployeeWorkload ? (
          <LoadingState message="Loading employee workload..." />
        ) : employeeWorkload.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <EmptyState
              title="No employee workload found"
              message="Add employees to view their workload."
            />
          </Box>
        ) : (
          <Box sx={{ px: { xs: 1, md: 1.5 } }}>
            {employeeWorkload.map((employee) => (
              <WorkloadEmployeeCard
                key={employee.employeeId}
                employee={employee}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

/* ------------------------------------------------ */
/* MAIN DASHBOARD                                   */
/* ------------------------------------------------ */

function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isWorkloadPage = new URLSearchParams(location.search).get("view") === "workload";

  const [employees, setEmployees] = useState([]);
  const [employeesWithoutTasks, setEmployeesWithoutTasks] = useState([]);
  const [employeeWorkload, setEmployeeWorkload] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingEmployeesWithoutTasks, setLoadingEmployeesWithoutTasks] =
    useState(true);
  const [loadingEmployeeWorkload, setLoadingEmployeeWorkload] =
    useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDrawerOpen, setEmployeeDrawerOpen] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [taskDeleteDialogOpen, setTaskDeleteDialogOpen] = useState(false);
  const [employeeDeleteDialogOpen, setEmployeeDeleteDialogOpen] =
    useState(false);

  const [deletingTask, setDeletingTask] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

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

  /* ------------------------------------------------ */
  /* LOGOUT                                          */
  /* ------------------------------------------------ */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ------------------------------------------------ */
  /* MESSAGE HANDLER                                 */
  /* ------------------------------------------------ */

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  /* ------------------------------------------------ */
  /* FETCH DATA                                      */
  /* ------------------------------------------------ */

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);

      const response = await api.get("/users/type/EMPLOYEE");

      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showMessage("Failed to load employees.", "error");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchEmployeesWithoutTasks = async () => {
    try {
      setLoadingEmployeesWithoutTasks(true);

      const response = await api.get(
        "/users/employees/without-tasks",
      );

      setEmployeesWithoutTasks(response.data);
    } catch (error) {
      console.error(
        "Error fetching employees without tasks:",
        error,
      );

      showMessage(
        "Failed to load employees without tasks.",
        "error",
      );
    } finally {
      setLoadingEmployeesWithoutTasks(false);
    }
  };

  const fetchEmployeeWorkload = async () => {
    try {
      setLoadingEmployeeWorkload(true);

      const response = await api.get(
        "/users/employees/workload",
      );

      setEmployeeWorkload(response.data);
    } catch (error) {
      console.error(
        "Error fetching employee workload:",
        error,
      );

      showMessage(
        "Failed to load employee workload.",
        "error",
      );
    } finally {
      setLoadingEmployeeWorkload(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);

      const response = await api.get("/tasks", {
        params: {
          status: statusFilter,
          priority: priorityFilter,
        },
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showMessage("Failed to load tasks.", "error");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchEmployeesWithoutTasks();
    fetchEmployeeWorkload();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    if (isWorkloadPage || !location.hash) return;

    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [isWorkloadPage, location.hash]);

  /* ------------------------------------------------ */
  /* TASK HANDLERS                                   */
  /* ------------------------------------------------ */

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskDrawerOpen(true);
  };

  const handleCloseTaskDrawer = () => {
    setTaskDrawerOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task);
    setTaskDeleteDialogOpen(true);
  };

  const handleCancelTaskDelete = () => {
    setTaskDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmTaskDelete = async () => {
    if (!taskToDelete) return;

    setDeletingTask(true);

    try {
      await api.delete(`/tasks/${taskToDelete.id}`);

      showMessage("Task deleted successfully.");

      handleCancelTaskDelete();

      await fetchTasks();
      await fetchEmployeesWithoutTasks();
      await fetchEmployeeWorkload();
    } catch (error) {
      console.error("Error deleting task:", error);
      showMessage("Failed to delete task.", "error");
    } finally {
      setDeletingTask(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      await api.post("/tasks", data);

      showMessage("Task created successfully.");

      reset();

      await fetchTasks();
      await fetchEmployeesWithoutTasks();
      await fetchEmployeeWorkload();
    } catch (error) {
      console.error("Error creating task:", error);
      showMessage("Failed to create task.", "error");
    }
  };

  const handleManagerStatusChange = async (
    taskId,
    newStatus,
  ) => {
    try {
      const response = await api.patch(
        `/tasks/${taskId}/manager-status`,
        null,
        {
          params: {
            status: newStatus,
          },
        },
      );

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? response.data : task,
        ),
      );

      await fetchEmployeeWorkload();

      showMessage("Task status updated successfully.");
    } catch (error) {
      console.error(
        "Error updating task status:",
        error,
      );

      showMessage(
        "Failed to update task status.",
        "error",
      );
    }
  };

  /* ------------------------------------------------ */
  /* EMPLOYEE HANDLERS                               */
  /* ------------------------------------------------ */

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeDrawerOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeDrawerOpen(true);
  };

  const handleCloseEmployeeDrawer = () => {
    setEmployeeDrawerOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployeeClick = (employee) => {
    setEmployeeToDelete(employee);
    setEmployeeDeleteDialogOpen(true);
  };

  const handleCancelEmployeeDelete = () => {
    setEmployeeDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleConfirmEmployeeDelete = async () => {
    if (!employeeToDelete) return;

    setDeletingEmployee(true);

    try {
      await api.delete(`/users/${employeeToDelete.id}`);

      showMessage("Employee deleted successfully.");

      handleCancelEmployeeDelete();

      await fetchEmployees();
      await fetchEmployeesWithoutTasks();
      await fetchEmployeeWorkload();
    } catch (error) {
      console.error(
        "Error deleting employee:",
        error,
      );

      showMessage(
        "Failed to delete employee.",
        "error",
      );
    } finally {
      setDeletingEmployee(false);
    }
  };

  /* ------------------------------------------------ */
  /* NAVIGATION                                      */
  /* ------------------------------------------------ */

  const scrollToSection = (sectionId) => {
    if (sectionId === "workload") {
      navigate("/manager?view=workload");
      setMobileOpen(false);
      return;
    }

    if (isWorkloadPage) {
      navigate(`/manager#${sectionId}`);
      setMobileOpen(false);
      return;
    }

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMobileOpen(false);
  };

  /* ------------------------------------------------ */
  /* SIDEBAR                                         */
  /* ------------------------------------------------ */

  const sidebarItems = [
    {
      label: "Overview",
      icon: <TrendingUpIcon />,
      section: "overview",
    },
    {
      label: "Workload Analysis",
      icon: <AssignmentIcon />,
      section: "workload",
    },
    {
      label: "Add Task",
      icon: <AddIcon />,
      section: "add-task",
    },
    {
      label: "Employees",
      icon: <PeopleIcon />,
      section: "employees",
    },
    {
      label: "Tasks",
      icon: <AssignmentIcon />,
      section: "tasks",
    },
  ];

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: colors.white,
        background:
          "linear-gradient(180deg, #003153 0%, #00243D 100%)",
      }}
    >
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: 0.3,
          }}
        >
          Employee
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#b9cddb",
            mt: 0.5,
          }}
        >
          Management System
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.12)",
        }}
      />

      <Box sx={{ px: 1.5, py: 2 }}>
        {sidebarItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => scrollToSection(item.section)}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              color: "#D7E3EA",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.12)",
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "#D7E3EA",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2, pb: 2 }}>
        <Divider
          sx={{
            mb: 2,
            borderColor: "rgba(255,255,255,0.12)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              backgroundColor: colors.white,
              color: colors.primary,
            }}
          >
            <PersonIcon />
          </Avatar>

          <Box>
            <Typography
              variant="body2"
              fontWeight={700}
            >
              {user?.name || "Manager"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  /* ------------------------------------------------ */
  /* UI                                               */
  /* ------------------------------------------------ */

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F5F7F8",
      }}
    >
      {/* DESKTOP SIDEBAR */}

      <Box
        component="nav"
        sx={{
          width: {
            xs: 0,
            md: drawerWidth,
          },
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="permanent"
          open
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* MOBILE SIDEBAR */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* MAIN CONTENT */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {/* HEADER */}

        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            color: colors.text,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E1E7EB",
          }}
        >
          <Toolbar
            sx={{
              minHeight: 72,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={() =>
                  setMobileOpen(true)
                }
                sx={{
                  display: {
                    xs: "flex",
                    md: "none",
                  },
                  mr: 1,
                  color: colors.primary,
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.text,
                    fontWeight: 800,
                  }}
                >
                  Manager Dashboard
                </Typography>
              </Box>
            </Box>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <IconButton
                sx={{
                  color: colors.secondary,
                  "&:hover": {
                    color: colors.primary,
                    backgroundColor:
                      colors.lightBlue,
                  },
                }}
              >
                <NotificationsIcon />
              </IconButton>

              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background:
                    "linear-gradient(135deg, #003153, #2F5D7C)",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "M"}
              </Avatar>

              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  color: colors.primary,
                  borderColor: colors.primary,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: colors.deepBlue,
                    backgroundColor:
                      colors.lightBlue,
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="xl"
          sx={{
            py: isWorkloadPage
              ? { xs: 1.5, md: 2 }
              : { xs: 3, md: 5 },
          }}
        >
          {isWorkloadPage ? (
            <ManagerWorkloadPage
              employeeWorkload={employeeWorkload}
              loadingEmployeeWorkload={loadingEmployeeWorkload}
              onBack={() => navigate("/manager")}
            />
          ) : (
            <>
          {/* HERO */}

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              minHeight: {
                xs: 300,
                md: 350,
              },
              mb: 6,
              borderRadius: 4,
              color: colors.white,
              background:
                "linear-gradient(135deg, #003153 0%, #00243D 60%, #2F5D7C 100%)",
              boxShadow:
                "0 24px 60px rgba(0,49,83,0.2)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
              }}
            >
              <Canvas
                camera={{
                  position: [0, 0, 7],
                  fov: 50,
                }}
              >
                <ambientLight intensity={0.5} />
                <AnimatedScene />
              </Canvas>
            </Box>

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: 680,
                p: {
                  xs: 3,
                  md: 5,
                },
              }}
            >
              <Chip
                label="MANAGER"
                size="small"
                sx={{
                  mb: 2,
                  color: colors.white,
                  fontWeight: 700,
                  letterSpacing: 1,
                  backgroundColor:
                    "rgba(255,255,255,0.12)",
                  border:
                    "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  fontSize: {
                    xs: "2rem",
                    md: "3rem",
                  },
                }}
              >
                Welcome back,{" "}
                {user?.name || "Manager"}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: 530,
                  color: "#D7E3EA",
                  lineHeight: 1.8,
                }}
              >
                Manage employees, assign tasks and
                monitor your team's progress from
                one place.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  scrollToSection("add-task")
                }
                sx={{
                  mt: 3,
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 2,
                  color: colors.primary,
                  backgroundColor:
                    colors.white,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor:
                      colors.lightBlue,
                    transform:
                      "translateY(-2px)",
                  },
                }}
              >
                Add Task
              </Button>
            </Box>
          </Box>

          {/* ALERT */}

          {message && (
            <Alert
              severity={messageType}
              onClose={() => setMessage("")}
              sx={{
                mb: 4,
                borderRadius: 2,
              }}
            >
              {message}
            </Alert>
          )}

          {/* OVERVIEW */}

          <Box
            id="overview"
            sx={{
              mb: 8,
              scrollMarginTop: 90,
            }}
          >
            <DashboardTitle
              title="Overview"
              subtitle="A quick look at your team's current activity"
              icon={<TrendingUpIcon />}
            />

            <Paper
              elevation={0}
              sx={{
                border: "1px solid #DDE5EA",
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                }}
              >
                {[
                  {
                    label: "Employees",
                    value: employees.length,
                    note: "Team members",
                    icon: <PeopleIcon />,
                  },
                  {
                    label: "Tasks",
                    value: tasks.length,
                    note: "Current task list",
                    icon: <AssignmentIcon />,
                  },
                  {
                    label: "Unassigned",
                    value: employeesWithoutTasks.length,
                    note: "Employees without tasks",
                    icon: <PendingActionsIcon />,
                  },
                ].map((item, index) => (
                  <Box
                    key={item.label}
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRight: {
                        sm:
                          index < 2
                            ? "1px solid #E5EBEF"
                            : "none",
                      },
                      borderBottom: {
                        xs:
                          index < 2
                            ? "1px solid #E5EBEF"
                            : "none",
                        sm: "none",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: colors.secondary,
                            fontSize: "0.78rem",
                            fontWeight: 650,
                            mb: 1,
                          }}
                        >
                          {item.label}
                        </Typography>

                        <Typography
                          sx={{
                            color: colors.text,
                            fontSize: "2rem",
                            lineHeight: 1,
                            fontWeight: 800,
                            letterSpacing: -0.8,
                          }}
                        >
                          {item.value}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1,
                            color: colors.secondary,
                            fontSize: "0.76rem",
                          }}
                        >
                          {item.note}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          color: colors.primary,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {item.icon}
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={() => navigate("/manager?view=workload")}
                sx={{
                  borderRadius: 1.5,
                  px: 2.2,
                  py: 1,
                  color: colors.primary,
                  borderColor: "#C8D6DE",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: colors.primary,
                    backgroundColor: "#F4F8FA",
                  },
                }}
              >
                Workload Analysis
              </Button>
            </Box>
          </Box>

          {/* EMPLOYEES WITHOUT TASKS */}

          <Box
            sx={{
              mb: 8,
              scrollMarginTop: 90,
            }}
          >
            <DashboardTitle
              title="Employees Without Tasks"
              subtitle="Members who currently have no assigned work"
              icon={<PendingActionsIcon />}
            />

            <Paper
              elevation={0}
              sx={{
                border: "1px solid #E8DFCA",
                borderLeft: "4px solid #C78A18",
                borderRadius: 2,
                backgroundColor: "#FFFCF5",
                overflow: "hidden",
              }}
            >
              {loadingEmployeesWithoutTasks ? (
                <Box sx={{ p: 3 }}>
                  <LoadingState message="Checking employees without tasks..." />
                </Box>
              ) : employeesWithoutTasks.length === 0 ? (
                <Box sx={{ p: 3 }}>
                  <Typography
                    sx={{
                      fontWeight: 750,
                      color: colors.text,
                      fontSize: "0.98rem",
                    }}
                  >
                    All employees have tasks
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color: colors.secondary,
                      fontSize: "0.86rem",
                    }}
                  >
                    Every employee currently has at least one assigned task.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {employeesWithoutTasks.map((employee) => (
                    <Box
                      key={employee.id}
                      sx={{
                        px: { xs: 2, md: 3 },
                        py: 2,
                        borderBottom: "1px solid #EFE6D3",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              backgroundColor: "#F7E9C5",
                              color: "#8A5A00",
                              fontWeight: 800,
                              fontSize: "0.85rem",
                            }}
                          >
                            {employee.name?.charAt(0)?.toUpperCase() || "E"}
                          </Avatar>

                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: colors.text,
                                fontSize: "0.92rem",
                              }}
                            >
                              {employee.name}
                            </Typography>

                            <Typography
                              sx={{
                                color: colors.secondary,
                                fontSize: "0.76rem",
                                mt: 0.2,
                              }}
                            >
                              {employee.id} · {employee.email}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          sx={{
                            color: "#8A5A00",
                            fontSize: "0.76rem",
                            fontWeight: 750,
                          }}
                        >
                          No tasks assigned
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          {/* ADD TASK */}

          <Box
            id="add-task"
            sx={{
              mb: 8,
              scrollMarginTop: 90,
            }}
          >
            <DashboardTitle
              title="Create a New Task"
              subtitle="Assign a new task directly to a member of your team"
              icon={<AddIcon />}
            />

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                border: "1px solid #DDE5EA",
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit(handleCreateTask)}
                noValidate
                sx={{
                  display: "grid",
                  gap: 2.25,
                }}
              >
                <TextField
                  label="Task title"
                  placeholder="Example: Complete frontend"
                  fullWidth
                  {...register("title")}
                  error={Boolean(errors.title)}
                  helperText={
                    errors.title?.message || "Use letters and spaces only"
                  }
                  sx={fieldSx}
                />

                <TextField
                  label="Description"
                  placeholder="Example: Complete the frontend task"
                  fullWidth
                  multiline
                  rows={3}
                  {...register("description")}
                  error={Boolean(errors.description)}
                  helperText={
                    errors.description?.message ||
                    "Use lowercase letters and spaces only"
                  }
                  sx={fieldSx}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Priority"
                    placeholder="Example: HIGH"
                    fullWidth
                    {...register("priority")}
                    error={Boolean(errors.priority)}
                    helperText={
                      errors.priority?.message || "LOW, MEDIUM, or HIGH"
                    }
                    sx={fieldSx}
                  />

                  <TextField
                    select
                    label="Assign employee"
                    fullWidth
                    defaultValue=""
                    {...register("assignedTo")}
                    error={Boolean(errors.assignedTo)}
                    helperText={
                      errors.assignedTo?.message || "Select an employee"
                    }
                    sx={fieldSx}
                  >
                    <MenuItem value="">Select an employee</MenuItem>

                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.id})
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{
                    width: "fit-content",
                    px: 3,
                    py: 1.2,
                    mt: 0.5,
                    borderRadius: 1.5,
                    color: colors.white,
                    backgroundColor: colors.primary,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: colors.deepBlue,
                      boxShadow: "none",
                    },
                  }}
                >
                  Create Task
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* EMPLOYEES */}

          <Box
            id="employees"
            sx={{
              mb: 8,
              scrollMarginTop: 90,
            }}
          >
            <DashboardTitle
              title="Employees"
              subtitle="Manage your employees and their accounts"
              icon={<PeopleIcon />}
            />

            <Paper
              elevation={0}
              sx={{
                border: "1px solid #DDE5EA",
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: { xs: 2.5, md: 3 },
                  py: 2,
                  borderBottom: "1px solid #E5EBEF",
                  backgroundColor: "#F7F9FA",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.98rem",
                        fontWeight: 750,
                        color: colors.text,
                      }}
                    >
                      Team members
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.35,
                        color: colors.secondary,
                        fontSize: "0.78rem",
                      }}
                    >
                      {employees.length} employee
                      {employees.length === 1 ? "" : "s"} in your team
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddEmployee}
                    sx={{
                      borderRadius: 1.5,
                      color: colors.white,
                      backgroundColor: colors.primary,
                      textTransform: "none",
                      fontWeight: 700,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: colors.deepBlue,
                        boxShadow: "none",
                      },
                    }}
                  >
                    Add Employee
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ p: { xs: 2, md: 3 } }}>
                {loadingEmployees ? (
                  <LoadingState message="Loading employees..." />
                ) : employees.length === 0 ? (
                  <EmptyState
                    title="No employees found"
                    message="Add an employee to get started."
                  />
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: 2,
                    }}
                  >
                    {employees.map((employee) => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        showActions
                        onEdit={() => handleEditEmployee(employee)}
                        onDelete={() =>
                          handleDeleteEmployeeClick(employee)
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>

          {/* TASKS */}

          <Box
            id="tasks"
            sx={{
              mb: 3,
              scrollMarginTop: 90,
            }}
          >
            <DashboardTitle
              title="All Tasks"
              subtitle="View, filter and manage tasks assigned to your employees"
              icon={<AssignmentIcon />}
            />

            <Paper
              elevation={0}
              sx={{
                border: "1px solid #DDE5EA",
                borderRadius: 2,
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: { xs: 2, md: 3 },
                  py: 2,
                  borderBottom: "1px solid #E5EBEF",
                  backgroundColor: "#F7F9FA",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", md: "center" }}
                  spacing={2}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.98rem",
                        fontWeight: 750,
                        color: colors.text,
                      }}
                    >
                      Task list
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.35,
                        color: colors.secondary,
                        fontSize: "0.78rem",
                      }}
                    >
                      {tasks.length} task{tasks.length === 1 ? "" : "s"} shown
                    </Typography>
                  </Box>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                  >
                    <TextField
                      select
                      size="small"
                      label="Status"
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                      sx={{
                        minWidth: { xs: "100%", sm: 145 },
                        ...fieldSx,
                      }}
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      <MenuItem value="TO-DO">To-Do</MenuItem>
                      <MenuItem value="ONGOING">Ongoing</MenuItem>
                      <MenuItem value="BLOCKED">Blocked</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                    </TextField>

                    <TextField
                      select
                      size="small"
                      label="Priority"
                      value={priorityFilter}
                      onChange={(event) =>
                        setPriorityFilter(event.target.value)
                      }
                      sx={{
                        minWidth: { xs: "100%", sm: 145 },
                        ...fieldSx,
                      }}
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                    </TextField>
                  </Stack>
                </Stack>
              </Box>

              <Box sx={{ p: { xs: 2, md: 3 } }}>
                {loadingTasks ? (
                  <LoadingState message="Loading tasks..." />
                ) : tasks.length === 0 ? (
                  <EmptyState
                    title="No tasks found"
                    message="Create your first task using the Add Task section."
                  />
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: 2,
                    }}
                  >
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        showActions
                        onEdit={() => handleEditTask(task)}
                        onDelete={() => handleDeleteTaskClick(task)}
                        showStatusActions
                        managerMode
                        onStatusChange={(newStatus) =>
                          handleManagerStatusChange(task.id, newStatus)
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
            </>
          )}
        </Container>
      </Box>

      {/* EDIT TASK DRAWER */}

      <EditTaskDrawer
        open={taskDrawerOpen}
        task={selectedTask}
        employees={employees}
        onClose={
          handleCloseTaskDrawer
        }
        onUpdated={fetchTasks}
      />

      {/* ADD / EDIT EMPLOYEE DRAWER */}

      <EmployeeDrawer
        open={employeeDrawerOpen}
        employee={selectedEmployee}
        onClose={
          handleCloseEmployeeDrawer
        }
        onSaved={async () => {
          await fetchEmployees();
          await fetchEmployeesWithoutTasks();
          await fetchEmployeeWorkload();
        }}
      />

      {/* DELETE TASK DIALOG */}

      <DeleteConfirmationDialog
        open={taskDeleteDialogOpen}
        title="Delete Task"
        itemName={
          taskToDelete?.title
        }
        loading={deletingTask}
        onCancel={
          handleCancelTaskDelete
        }
        onConfirm={
          handleConfirmTaskDelete
        }
        confirmText="Delete Task"
      />

      {/* DELETE EMPLOYEE DIALOG */}

      <DeleteConfirmationDialog
        open={
          employeeDeleteDialogOpen
        }
        title="Delete Employee"
        itemName={
          employeeToDelete?.name
        }
        loading={deletingEmployee}
        onCancel={
          handleCancelEmployeeDelete
        }
        onConfirm={
          handleConfirmEmployeeDelete
        }
        confirmText="Delete Employee"
      />
    </Box>
  );
}

export default ManagerDashboard;