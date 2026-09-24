const dashboardStyles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F5F7FA",
  },

  section: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 3,
    boxShadow: "none",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    mb: 3,
  },

  sectionTitle: {
    color: "#172033",
    fontWeight: 800,
  },

  sectionSubtitle: {
    color: "#64748B",
    mt: 0.5,
  },

  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 2.5,
  },

  emptyState: {
    p: {
      xs: 4,
      md: 6,
    },
    textAlign: "center",
    borderRadius: 3,
    border: "1px solid #E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  countChip: {
    backgroundColor: "#E8F0F5",
    color: "#003153",
    fontWeight: 700,
    borderRadius: 2,

    "& .MuiChip-icon": {
      color: "#003153",
    },
  },
};

export default dashboardStyles;