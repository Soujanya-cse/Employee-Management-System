import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Slider,
  Stack,
  Divider,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

import colors from "../theme/colors";
import {
  cardBaseSx,
  actionButtonSx,
  sectionLabelSx,
  infoBoxSx,
  iconBoxSx,
} from "../theme/cardStyles";

const statusSteps = ["TO-DO", "ONGOING", "BLOCKED", "COMPLETED"];

const statusColors = {
  "TO-DO": colors.secondary,
  ONGOING: colors.info,
  BLOCKED: colors.warning,
  COMPLETED: colors.success,
};

const priorityStyles = {
  HIGH: {
    backgroundColor: "#FEF2F2",
    color: colors.error,
  },
  MEDIUM: {
    backgroundColor: "#FFF7ED",
    color: colors.warning,
  },
  LOW: {
    backgroundColor: "#ECFDF3",
    color: colors.success,
  },
};

function TaskCard({
  task,
  showActions = false,
  onEdit,
  onDelete,
  showStatusActions = false,
  onStatusChange,
  updatingStatus = false,
  managerMode = false,
}) {
  const currentStatus = task.status || "TO-DO";
  const currentStatusIndex = statusSteps.indexOf(currentStatus);

  const getEmployeeStatuses = () => {
    switch (currentStatus) {
      case "TO-DO":
        return ["TO-DO", "ONGOING"];

      case "ONGOING":
        return ["ONGOING", "COMPLETED", "BLOCKED"];

      case "BLOCKED":
        return ["BLOCKED", "ONGOING"];

      case "COMPLETED":
        return ["COMPLETED"];

      default:
        return ["TO-DO"];
    }
  };

  const availableStatuses = managerMode ? statusSteps : getEmployeeStatuses();

  const handleStatusChange = (event, newValue) => {
    const selectedStatus = statusSteps[newValue];

    if (!availableStatuses.includes(selectedStatus)) {
      return;
    }

    if (selectedStatus !== currentStatus && onStatusChange) {
      onStatusChange(selectedStatus);
    }
  };

  const sliderMarks = statusSteps.map((status, index) => ({
    value: index,
    label: status,
  }));

  const priorityStyle = priorityStyles[task.priority] || {
    backgroundColor: colors.lightGray,
    color: colors.secondary,
  };

  const currentStatusColor = statusColors[currentStatus] || colors.secondary;

  return (
    <Paper
      elevation={0}
      sx={{
        ...cardBaseSx,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Task heading */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.3} sx={{ minWidth: 0 }}>
          <Box sx={iconBoxSx}>
            <AssignmentOutlinedIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={sectionLabelSx}>Task #{task.id}</Typography>

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                color: colors.text,
                fontSize: "1.05rem",
                lineHeight: 1.35,
                mt: 0.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.title}
            </Typography>
          </Box>
        </Stack>

        {showActions && (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit task">
              <IconButton
                aria-label="Edit task"
                onClick={onEdit}
                sx={{
                  ...actionButtonSx,
                  color: colors.primary,
                  "&:hover": {
                    backgroundColor: colors.lightBlue,
                  },
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete task">
              <IconButton
                aria-label="Delete task"
                onClick={onDelete}
                sx={{
                  ...actionButtonSx,
                  color: colors.error,
                  "&:hover": {
                    backgroundColor: "#FEF2F2",
                  },
                }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

      {/* Description */}

      <Typography
        variant="body2"
        sx={{
          color: colors.secondary,
          lineHeight: 1.7,
          minHeight: 48,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {task.description}
      </Typography>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Assignment */}

      <Box sx={infoBoxSx}>
        <PersonOutlineOutlinedIcon
          sx={{
            color: colors.steelBlue,
            fontSize: 22,
          }}
        />

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={sectionLabelSx}>Assigned to</Typography>

          <Typography
            variant="body2"
            fontWeight={700}
            noWrap
            sx={{
              color: colors.text,
              mt: 0.3,
            }}
          >
            {task.assignedTo}
          </Typography>
        </Box>
      </Box>

      {/* Priority */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <FlagOutlinedIcon
            sx={{
              fontSize: 18,
              color: colors.secondary,
            }}
          />

          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: colors.secondary }}
          >
            Priority
          </Typography>
        </Stack>

        <Chip
          label={task.priority || "Not set"}
          size="small"
          sx={{
            ...priorityStyle,
            borderRadius: 1.5,
            fontWeight: 800,
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Status */}

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography sx={sectionLabelSx}>Task status</Typography>

          <Chip
            label={currentStatus}
            size="small"
            sx={{
              backgroundColor: `${currentStatusColor}18`,
              color: currentStatusColor,
              fontWeight: 800,
              borderRadius: 1.5,
              fontSize: "0.7rem",
            }}
          />
        </Box>

        <Box sx={{ px: 1 }}>
          <Slider
            value={currentStatusIndex >= 0 ? currentStatusIndex : 0}
            min={0}
            max={statusSteps.length - 1}
            step={1}
            marks={sliderMarks}
            disabled={!showStatusActions || updatingStatus}
            onChangeCommitted={handleStatusChange}
            sx={{
              color: currentStatusColor,

              "& .MuiSlider-thumb": {
                width: 18,
                height: 18,
                backgroundColor: currentStatusColor,
                border: "3px solid #FFFFFF",
                boxShadow: "0 2px 8px rgba(15,23,42,0.2)",
              },

              "& .MuiSlider-track": {
                height: 7,
                border: "none",
                backgroundColor: currentStatusColor,
              },

              "& .MuiSlider-rail": {
                height: 7,
                backgroundColor: colors.border,
              },

              "& .MuiSlider-mark": {
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#CBD5E1",
              },

              "& .MuiSlider-markActive": {
                backgroundColor: currentStatusColor,
              },

              "& .MuiSlider-markLabel": {
                fontSize: "9px",
                fontWeight: 700,
                color: colors.secondary,
                marginTop: 1,
              },
            }}
          />
        </Box>

        {updatingStatus && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <CircularProgress size={18} sx={{ color: currentStatusColor }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default TaskCard;
