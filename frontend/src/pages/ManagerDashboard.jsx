import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import StatCard from "../components/dashboard/StatCard";
import DashboardSection from "../components/dashboard/DashboardSection";

const drawerWidth = 240;

/* ------------------------------------------------ */
/* 3D BACKGROUND                                    */
/* ------------------------------------------------ */

function FloatingParticles() {
  const particles = [];

  for (let i = 0; i < 45; i += 1) {
    particles.push(
      <mesh
        key={i}
        position={[
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
        ]}
      >
        <sphereGeometry args={[0.025, 8, 8]} />

        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.55} />
      </mesh>,
    );
  }

  return <group>{particles}</group>;
}

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

      <FloatingParticles />
    </group>
  );
}

/* ------------------------------------------------ */
/* DELETE CONFIRMATION DIALOG                       */
/* ------------------------------------------------ */

function DeleteDialog({
  open,
  title,
  itemName,
  loading,
  onCancel,
  onConfirm,
  confirmText,
}) {
  return (
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
}

/* ------------------------------------------------ */
/* MAIN DASHBOARD                                   */
/* ------------------------------------------------ */

function ManagerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
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

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);

      const response = await api.get("/tasks");

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
    fetchTasks();
  }, []);

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
    } catch (error) {
      console.error("Error creating task:", error);
      showMessage("Failed to create task.", "error");
    }
  };

  const handleManagerStatusChange = async (taskId, newStatus) => {
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

      showMessage("Task status updated successfully.");
    } catch (error) {
      console.error("Error updating task status:", error);
      showMessage("Failed to update task status.", "error");
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
    } catch (error) {
      console.error("Error deleting employee:", error);
      showMessage("Failed to delete employee.", "error");
    } finally {
      setDeletingEmployee(false);
    }
  };

  /* ------------------------------------------------ */
  /* NAVIGATION                                      */
  /* ------------------------------------------------ */

  const scrollToSection = (sectionId) => {
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
        background: "linear-gradient(180deg, #003153 0%, #00243D 100%)",
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
            color: "#B8CBD8",
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
                backgroundColor: "rgba(255,255,255,0.12)",
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
            <Typography variant="body2" fontWeight={700}>
              Manager
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
        backgroundColor: colors.background,
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
            backgroundColor: colors.white,
            borderBottom: `1px solid ${colors.border}`,
            backdropFilter: "blur(12px)",
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
                onClick={() => setMobileOpen(true)}
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

            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                sx={{
                  color: colors.secondary,
                  "&:hover": {
                    color: colors.primary,
                    backgroundColor: colors.lightBlue,
                  },
                }}
              >
                <NotificationsIcon />
              </IconButton>

              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: "linear-gradient(135deg, #003153, #2F5D7C)",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                M
              </Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="xl"
          sx={{
            py: {
              xs: 3,
              md: 4,
            },
          }}
        >
          {/* HERO SECTION */}

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              minHeight: {
                xs: 300,
                md: 340,
              },
              mb: 4,
              borderRadius: 4,
              color: colors.white,
              background:
                "linear-gradient(135deg, #003153 0%, #00243D 60%, #2F5D7C 100%)",
              boxShadow: "0 20px 50px rgba(0,49,83,0.18)",
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
                maxWidth: 650,
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
                  backgroundColor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
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
                Welcome back
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  maxWidth: 500,
                  color: "#D7E3EA",
                  lineHeight: 1.8,
                }}
              >
                Manage employees, assign tasks and keep track of your team's
                work from one place.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => scrollToSection("add-task")}
                sx={{
                  mt: 3,
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 2,
                  color: colors.primary,
                  backgroundColor: colors.white,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: colors.lightBlue,
                    transform: "translateY(-2px)",
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
                mb: 3,
                borderRadius: 2,
              }}
            >
              {message}
            </Alert>
          )}

          {/* STATISTICS */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2.5,
              mb: 5,
            }}
          >
            <StatCard
              title="Total Employees"
              value={employees.length}
              description="Registered employees"
              icon={<PeopleIcon />}
              accentColor={colors.primary}
            />

            <StatCard
              title="Total Tasks"
              value={tasks.length}
              description="Created tasks"
              icon={<AssignmentIcon />}
              accentColor={colors.steelBlue}
            />
          </Box>

          {/* ADD TASK SECTION */}

          <Box
            id="add-task"
            sx={{
              mb: 5,
              scrollMarginTop: 90,
            }}
          >
            <DashboardSection>
              <SectionHeader
                title="Create a new task"
                subtitle="Assign a task to an employee"
              />

              <Box
                component="form"
                onSubmit={handleSubmit(handleCreateTask)}
                noValidate
                sx={{
                  display: "grid",
                  gap: 2,
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
                  placeholder="Example: complete the frontend task"
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

                <Box sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{
                      px: 3,
                      py: 1.2,
                      borderRadius: 2,
                      color: colors.white,
                      backgroundColor: colors.primary,
                      textTransform: "none",
                      fontWeight: 700,
                      "&:hover": {
                        backgroundColor: colors.deepBlue,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Create Task
                  </Button>
                </Box>
              </Box>
            </DashboardSection>
          </Box>

          {/* EMPLOYEES SECTION */}

          <Box
            id="employees"
            sx={{
              mb: 5,
              scrollMarginTop: 90,
            }}
          >
            <SectionHeader
              title="Employees"
              subtitle="Manage and view employee tasks"
              action={
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Chip
                    label={`${employees.length} Employees`}
                    sx={{
                      color: colors.primary,
                      backgroundColor: colors.lightBlue,
                      fontWeight: 700,
                    }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddEmployee}
                    sx={{
                      borderRadius: 2,
                      color: colors.white,
                      backgroundColor: colors.primary,
                      textTransform: "none",
                      fontWeight: 700,
                      "&:hover": {
                        backgroundColor: colors.deepBlue,
                      },
                    }}
                  >
                    Add Employee
                  </Button>
                </Stack>
              }
            />

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
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 2.5,
                }}
              >
                {employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    showActions
                    onEdit={() => handleEditEmployee(employee)}
                    onDelete={() => handleDeleteEmployeeClick(employee)}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* TASKS SECTION */}

          <Box
            id="tasks"
            sx={{
              scrollMarginTop: 90,
            }}
          >
            <SectionHeader
              title="All Tasks"
              subtitle="Overview of all assigned tasks"
              action={
                <Chip
                  label={`${tasks.length} Tasks`}
                  sx={{
                    color: colors.primary,
                    backgroundColor: colors.lightBlue,
                    fontWeight: 700,
                  }}
                />
              }
            />

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
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 2.5,
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
        </Container>
      </Box>

      {/* EDIT TASK DRAWER */}

      <EditTaskDrawer
        open={taskDrawerOpen}
        task={selectedTask}
        employees={employees}
        onClose={handleCloseTaskDrawer}
        onUpdated={fetchTasks}
      />

      {/* ADD/EDIT EMPLOYEE DRAWER */}

      <EmployeeDrawer
        open={employeeDrawerOpen}
        employee={selectedEmployee}
        onClose={handleCloseEmployeeDrawer}
        onSaved={fetchEmployees}
      />

      {/* DELETE TASK DIALOG */}

      <DeleteDialog
        open={taskDeleteDialogOpen}
        title="Delete Task"
        itemName={taskToDelete?.title}
        loading={deletingTask}
        onCancel={handleCancelTaskDelete}
        onConfirm={handleConfirmTaskDelete}
        confirmText="Delete Task"
      />

      {/* DELETE EMPLOYEE DIALOG */}

      <DeleteDialog
        open={employeeDeleteDialogOpen}
        title="Delete Employee"
        itemName={employeeToDelete?.name}
        loading={deletingEmployee}
        onCancel={handleCancelEmployeeDelete}
        onConfirm={handleConfirmEmployeeDelete}
        confirmText="Delete Employee"
      />
    </Box>
  );
}

export default ManagerDashboard;
