import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import { useNavigate } from "react-router-dom";

import colors from "../theme/colors";
import {
  cardBaseSx,
  actionButtonSx,
  sectionLabelSx,
  infoBoxSx,
} from "../theme/cardStyles";

function EmployeeCard({
  employee,
  showActions = false,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const employeeInitial =
    employee.name?.charAt(0)?.toUpperCase() || "";

  return (
    <Paper
      elevation={0}
      sx={{
        ...cardBaseSx,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.steelBlue})`,
        },
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <Avatar
            sx={{
              width: 54,
              height: 54,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.steelBlue})`,
              fontSize: "1.25rem",
              fontWeight: 800,
            }}
          >
            {employeeInitial || <PersonIcon />}
          </Avatar>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              noWrap
              sx={{
                color: colors.text,
                fontSize: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {employee.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: colors.secondary,
                mt: 0.3,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              Employee ID: {employee.id}
            </Typography>
          </Box>
        </Stack>

        {showActions && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              flexShrink: 0,
            }}
          >
            <Tooltip title="Edit employee">
              <IconButton
                aria-label="Edit employee"
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

            <Tooltip title="Delete employee">
              <IconButton
                aria-label="Delete employee"
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

      {/* Employee information */}

      <Box sx={infoBoxSx}>
        <BadgeOutlinedIcon
          sx={{
            color: colors.steelBlue,
            fontSize: 22,
          }}
        />

        <Box>
          <Typography sx={sectionLabelSx}>
            Role
          </Typography>

          <Typography
            variant="body2"
            fontWeight={700}
            sx={{
              color: colors.text,
              mt: 0.3,
            }}
          >
            {employee.type}
          </Typography>
        </Box>
      </Box>

      {/* Action */}

      <Button
        fullWidth
        variant="outlined"
        endIcon={<ArrowForwardRoundedIcon />}
        onClick={() =>
          navigate(`/employee/${employee.id}`)
        }
        sx={{
          mt: "auto",
          py: 1.1,
          borderRadius: 2,
          borderColor: colors.primary,
          color: colors.primary,
          fontWeight: 700,
          textTransform: "none",
          "&:hover": {
            borderColor: colors.deepBlue,
            backgroundColor: colors.lightBlue,
          },
        }}
      >
        View Tasks
      </Button>
    </Paper>
  );
}

export default EmployeeCard;