import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  IconButton,
  Menu,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Select,
  Paper,
  FormControl,
  InputLabel,
  Pagination,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  MoreVert,
  Edit,
  Person, 
  FindInPage, 
  Badge,  
  Search,
  Payment,
  FilterList,
  Close,
} from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';

const Status = ({ status }) => {
  const statusStyles = {
    COMPLETED: { backgroundColor: "#22C55E29", color: "#118D57" },
    PENDING: { backgroundColor: "#FFF5CC", color: "#FFAB00" },
    INCOMPLETE: { backgroundColor: "#FF563029", color: "#B71D1A" },
    FREE: { backgroundColor: "#E3F2FD", color: "#1565C0" },
  };

  const style = statusStyles[status.toUpperCase()] || {
    backgroundColor: "inherit",
    color: "inherit",
  };

  return (
    <Typography
      sx={{
        fontWeight: "bold",
        ...style,
        padding: "4px 8px",
        borderRadius: "4px",
      }}
    >
      {status}
    </Typography>
  );
};

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const [filter, setFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userData, setUserData] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  const [addPaymentData, setAddPaymentData] = useState({
    employee_id: "",
    employee_name: "",
    amount: 0,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    payment_method: "Gpay",
    status: "COMPLETED",
  });

  const [editedPayment, setEditedPayment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedInternLogs, setSelectedInternLogs] = useState(null);
  const [isAddingFromTable, setIsAddingFromTable] = useState(false);

  const handleCloseActionMenu = () => {
    setActionAnchorEl(null);
    setSelectedPaymentId(null);
  };

  const handlePaymentClick = (payment) => {
    setSelectedPaymentDetails({
      internId: payment.internId,
      name: payment.name,
      totalAmount: payment.totalAmount,
      paid: payment.paid,
      balance: payment.balance,
      logs: payment.logs || [],
      start_date: payment.start_date,
      end_date: payment.end_date,
    });
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedPaymentDetails(null);
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/Sims/fees/{paymentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete payment");
      }

      setPayments((prev) => prev.filter((payment) => payment.id !== paymentId));
      setSnackBarOpen(true);
      setError(null);
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError(err.message);
      setSnackBarOpen(true);
    }
  };

  const handleAddPayment = async () => {
    try {
      if (!addPaymentData.employee_id || !addPaymentData.employee_name || !addPaymentData.amount) {
        throw new Error("Employee ID, Name, and Amount are required");
      }

      const user = userData.find((u) => u.emp_id === parseInt(addPaymentData.employee_id));

      const newPayment = {
        employee_id: parseInt(addPaymentData.employee_id),
        employee_name: addPaymentData.employee_name,
        summary: {
          total_fee_amount: parseFloat(addPaymentData.amount),
          total_paid: addPaymentData.status === "COMPLETED" ? parseFloat(addPaymentData.amount) : 0,
          remaining_amount: addPaymentData.status === "COMPLETED" ? 0 : parseFloat(addPaymentData.amount),
          total_installments: 1,
        },
        payment_details: [
          {
            amount: parseFloat(addPaymentData.amount),
            payment_method: addPaymentData.payment_method,
            paid_date: new Date().toISOString(),
            start_date: addPaymentData.start_date,
            end_date: addPaymentData.end_date,
          },
        ],
      };

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/Sims/fees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(newPayment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add payment");
      }

      const data = await response.json();

      setPayments((prev) => [
        ...prev,
        {
          id: data.employee_id,
          internId: data.employee_id.toString(),
          name: data.employee_name,
          start_date: addPaymentData.start_date,
          end_date: addPaymentData.end_date,
          totalAmount: parseFloat(data.summary.total_fee_amount),
          paid: parseFloat(data.summary.total_paid),
          balance: parseFloat(data.summary.total_fee_amount) - parseFloat(data.summary.total_paid),
          status: data.summary.remaining_amount === 0 ? "COMPLETED" : "PENDING",
          logs: data.payment_details.map((p) => ({
            date: p.paid_date?.split("T")[0] || "N/A",
            amount: parseFloat(p.amount),
            mode: p.payment_method || "Unknown",
          })),
        },
      ]);

      setOpenAddDialog(false);
      setAddPaymentData({
        employee_id: "",
        employee_name: "",
        amount: 0,
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        payment_method: "Gpay",
        status: "COMPLETED",
      });
      setIsAddingFromTable(false);

      setError(null);
      setSnackBarOpen(true);
    } catch (err) {
      console.error("Error adding payment:", err);
      setError(err.message);
      setSnackBarOpen(true);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
  
        // Fetch user data
        const userDataResponse = await fetch(
          "http://localhost:8000/Sims/user-data/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
  
        if (!userDataResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userDataResponse.json();
        setUserData(userData);
  
        // Fetch payment data
        const paymentResponse = await fetch(
          "http://localhost:8000/Sims/fees/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
  
        if (!paymentResponse.ok) throw new Error("Failed to fetch payment data");
        const paymentData = await paymentResponse.json();
  
        // Map and combine data from userData and paymentData
        const transformedPayments = paymentData.map((payment) => {
          const user = userData.find((u) => u.emp_id === payment.employee_id);
          const totalPaid = parseFloat(payment.summary.total_paid || 0);
          const totalAmount = parseFloat(payment.summary.total_fee_amount || 0);
          const balance = totalAmount - totalPaid;
  
          // Get the current date and end date
          const currentDate = new Date();
          const endDate = new Date(user?.end_date || "");
  
          let status;
  
          if (totalAmount === 0) {
            status = "FREE";
          } else if (totalPaid === totalAmount || totalPaid > totalAmount) {
            status = "COMPLETED";
          } else if (currentDate > endDate && balance > 0) {
            status = "INCOMPLETE";
          } else {
            status = "PENDING";
          }
  
          return {
            id: payment.employee_id,
            internId: payment.employee_id.toString(),
            name: payment.employee_name || "Unknown",
            start_date: user?.start_date || "N/A",
            end_date: user?.end_date || "N/A",
            totalAmount: totalAmount,
            paid: totalPaid,
            balance: balance,
            status: status,
            logs: payment.payment_details.map((detail) => ({
              date: detail.paid_date.split("T")[0],
              amount: parseFloat(detail.amount) || 0,
              mode: detail.payment_method || "Unknown",
            })),
          };
        });
  
        setPayments(transformedPayments);
      } catch (error) {
        console.error("Error fetching details:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPayments();
  }, []);

  const handleSaveEdit = async () => {
    try {
      const updatedLogs = [...selectedPaymentDetails.logs];
      updatedLogs[currentLogIndex] = {
        ...updatedLogs[currentLogIndex],
        amount: editedPayment.paid,
        mode: editedPayment.payment_method,
      };

      const newTotalPaid = updatedLogs.reduce(
        (sum, log) => sum + (log.amount || 0),
        0
      );
      const newBalance = selectedPaymentDetails.totalAmount - newTotalPaid;
      const newStatus =
        newBalance === 0 || newBalance < 0
          ? "COMPLETED"
          : newBalance > 0
          ? "PENDING"
          : "INCOMPLETE";

      const updatedPayment = {
        employee_id: parseInt(selectedPaymentDetails.internId),
        employee_name: selectedPaymentDetails.name,
        summary: {
          total_fee_amount: editedPayment.totalAmount,
          total_paid: editedPayment.paid,
          remaining_amount: editedPayment.balance,
          total_installments: editedPayment.logs.length,
        },
        payment_details: updatedLogs.map((log) => ({
          amount: log.amount,
          payment_method: log.mode,
          paid_date: log.date ? `${log.date}T00:00:00Z` : new Date().toISOString(),
          start_date: selectedPaymentDetails.start_date,
          end_date: selectedPaymentDetails.end_date,
        })),
        start_date: selectedPaymentDetails.start_date,
        end_date: selectedPaymentDetails.end_date,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/Sims/fees/${parseInt(selectedPaymentDetails.internId)}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(updatedPayment),
        }
      );

      if (!response.ok) throw new Error("Failed to update payment");

      setPayments((prev) =>
        prev.map((payment) =>
          payment.internId === selectedPaymentDetails.internId
            ? {
                ...payment,
                paid: newTotalPaid,
                balance: newBalance,
                status: newStatus,
                logs: updatedLogs,
              }
            : payment
        )
      );

      setSelectedPaymentDetails((prev) => ({
        ...prev,
        paid: newTotalPaid,
        balance: newBalance,
        status: newStatus,
        logs: updatedLogs,
      }));

      setOpenEditDialog(false);
      setSnackBarOpen(true);
    } catch (err) {
      setError(err.message);
      setSnackBarOpen(true);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.name.toLowerCase().includes(filter.toLowerCase()) ||
      payment.internId.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter ? payment.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleResetFilters = () => {
    setFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const handleOpenLogDialog = (internId) => {
    const payment = payments.find(p => p.internId === internId);
    if (payment) {
      setSelectedInternLogs({
        internId: payment.internId,
        name: payment.name,
        logs: payment.logs
      });
      setLogDialogOpen(true);
    }
  };

  const handleAddPaymentFromTable = (payment) => {
    const user = userData.find(u => u.emp_id === parseInt(payment.internId));
    setIsAddingFromTable(true);
    setAddPaymentData({
      employee_id: payment.emp_id,
      employee_name: payment.name,
      amount: 0,
      start_date: user?.start_date || payment.start_date,
      end_date: user?.end_date || payment.end_date,
      payment_method: "Gpay",
      status: "COMPLETED",
    });
    setOpenAddDialog(true);
    handleCloseActionMenu();
  };

  const handleOpenAddDialog = () => {
    setIsAddingFromTable(false);
    setAddPaymentData({
      employee_id: "",
      employee_name: "",
      amount: 0,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      payment_method: "Gpay",
      status: "COMPLETED",
    });
    setOpenAddDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, color: "error.main" }}>
        <Typography>Error loading payments: {error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, bgcolor: "white", color: "black" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
        <Payment sx={{ marginRight: 1, fontSize: 40 }} />
        <Typography variant="h4" gutterBottom>
          Payment List
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Search Payments"
            variant="outlined"
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="INCOMPLETE">Incomplete</MenuItem>
              <MenuItem value="FREE">Free</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
        >
          Add Payment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {[
                "Intern ID",
                "Name",
                "Start Date",
                "End Date",
                "Total Amount",
                "Paid",
                "Balance",
                "Status",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow
                key={payment.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Button
                    onClick={() => handlePaymentClick(payment)}
                    sx={{
                      textTransform: "none",
                      color: "inherit",
                      p: 0,
                      fontWeight: "bold",
                      "&:hover": {
                        textDecoration: "underline",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {payment.internId}
                  </Button>
                </TableCell>
                <TableCell>{payment.name}</TableCell>
                <TableCell>{payment.start_date}</TableCell>
                <TableCell>{payment.end_date}</TableCell>
                <TableCell>{payment.totalAmount.toFixed(2)}</TableCell>
                <TableCell sx={{ color: "green", fontWeight: "bold" }}>
                  {payment.paid.toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{
                    color: payment.balance > 0 ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {payment.balance.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Status status={payment.status} />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      setSelectedPaymentId(payment.id);
                      setActionAnchorEl(e.currentTarget);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={actionAnchorEl}
                    open={
                      Boolean(actionAnchorEl) &&
                      selectedPaymentId === payment.id
                    }
                    onClose={handleCloseActionMenu}
                  >
                    <MenuItem
                      onClick={() => handleAddPaymentFromTable(payment)}
                    >
                      <AddIcon sx={{ mr: 1 }} /> Add Payment
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handlePaymentClick(payment);
                        handleCloseActionMenu();
                      }}
                    >
                      <FindInPage sx={{ mr: 1 }} /> View Details
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setPaymentToDelete(payment.id);
                        setDeleteConfirmDialog(true);
                        handleCloseActionMenu();
                      }}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography>
          Showing {paginatedPayments.length} of {filteredPayments.length}{" "}
          results
        </Typography>
        <Pagination
          count={Math.ceil(filteredPayments.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="md"
        fullWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            width: "800px",
            maxWidth: "90vw",
            height: "70vh",
            maxHeight: "700px",
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
              Payment History
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#666", fontSize: "0.9rem", mt: 0.5 }}>
              {selectedPaymentDetails?.name} ({selectedPaymentDetails?.internId})
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem", mt: 0.5 }}>
              Internship Period: {selectedPaymentDetails?.start_date} to {selectedPaymentDetails?.end_date}
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={handleClosePaymentDialog}
              sx={{
                color: "#666",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px 24px",
              backgroundColor: "#fafafa",
              borderBottom: "1px solid #eee",
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "#666", fontSize: "0.9rem" }}
              >
                Total Amount
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: "1.2rem" }}
              >
                ${selectedPaymentDetails?.totalAmount?.toFixed(2) || "0.00"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ color: "#666", fontSize: "0.9rem" }}
              >
                Balance
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color:
                    selectedPaymentDetails?.balance > 0
                      ? "error.main"
                      : "success.main",
                }}
              >
                ${selectedPaymentDetails?.balance?.toFixed(2) || "0.00"}
              </Typography>
            </Box>
          </Box>

          <TableContainer
            sx={{
              flex: 1,
              overflow: "auto",
              "& .MuiTableCell-root": {
                padding: "16px 24px",
              },
            }}
          >
            <Table stickyHeader size="medium">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f5f5f5",
                      fontSize: "0.95rem",
                      padding: "18px 24px",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f5f5f5",
                      fontSize: "0.95rem",
                      padding: "18px 24px",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f5f5f5",
                      fontSize: "0.95rem",
                      padding: "18px 24px",
                    }}
                  >
                    Payment Method
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#f5f5f5",
                      fontSize: "0.95rem",
                      padding: "18px 24px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPaymentDetails?.logs?.length > 0 ? (
                  selectedPaymentDetails.logs.map((log, index) => {
                    const methodColors = {
                      Gpay: {
                        bg: "#e3f2fd",
                        text: "#1565c0",
                        border: "#bbdefb",
                      },
                      BankTransfer: {
                        bg: "#e8f5e9",
                        text: "#2e7d32",
                        border: "#c8e6c9",
                      },
                      Cash: {
                        bg: "#fff3e0",
                        text: "#e65100",
                        border: "#ffe0b2",
                      },
                      default: {
                        bg: "#f5f5f5",
                        text: "#616161",
                        border: "#e0e0e0",
                      },
                    };
                    const method = log.mode || "Unknown";
                    const colors = methodColors[method] || methodColors.default;

                    return (
                      <TableRow key={index} hover sx={{ height: "64px" }}>
                        <TableCell>{log.date}</TableCell>
                        <TableCell sx={{ color: "green", fontWeight: 500 }}>
                          ${log.amount?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={method}
                            size="medium"
                            sx={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                              fontWeight: 500,
                              minWidth: "120px",
                              height: "32px",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              setCurrentLogIndex(index);
                              setEditedPayment({
                                ...selectedPaymentDetails,
                                paid: log.amount,
                                payment_method: log.mode,
                                logIndex: index,
                              });
                              setActionAnchorEl(e.currentTarget);
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            anchorEl={actionAnchorEl}
                            open={
                              Boolean(actionAnchorEl) &&
                              currentLogIndex === index
                            }
                            onClose={() => {
                              setActionAnchorEl(null);
                              setCurrentLogIndex(null);
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                setOpenEditDialog(true);
                                setActionAnchorEl(null);
                              }}
                            >
                              <Edit sx={{ mr: 1 }} /> Edit
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ padding: 6 }}>
                      No payment records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "16px 24px",
            backgroundColor: "#f5f5f5",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            onClick={handleClosePaymentDialog}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 24px",
              fontSize: "0.95rem",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Employee ID"
            fullWidth
            type="number"
            value={addPaymentData.employee_id}
            onChange={(e) =>
              setAddPaymentData({
                ...addPaymentData,
                employee_id: e.target.value, 
              }) 
            }
            disabled={isAddingFromTable}
          />
          <TextField
            margin="dense"
            label="Employee Name"
            fullWidth
            value={addPaymentData.employee_name}
            onChange={(e) =>
              setAddPaymentData({
                ...addPaymentData,
                employee_name: e.target.value,
              })
            }
            disabled={isAddingFromTable}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={addPaymentData.amount}
            onChange={(e) =>
              setAddPaymentData({
                ...addPaymentData,
                amount: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={addPaymentData.start_date}
            onChange={(e) =>
              setAddPaymentData({
                ...addPaymentData,
                start_date: e.target.value,
              })
            }
            disabled={isAddingFromTable}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={addPaymentData.end_date}
            onChange={(e) =>
              setAddPaymentData({ ...addPaymentData, end_date: e.target.value })
            }
            disabled={isAddingFromTable}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={addPaymentData.payment_method}
              onChange={(e) =>
                setAddPaymentData({
                  ...addPaymentData,
                  payment_method: e.target.value,
                })
              }
            >
              <MenuItem value="Gpay">Gpay</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={addPaymentData.status}
              onChange={(e) =>
                setAddPaymentData({ ...addPaymentData, status: e.target.value })
              }
            >
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPayment} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent dividers>
          {editedPayment && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Employee Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {editedPayment.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">Start Date</Typography>
                  <Typography variant="body1">
                    {editedPayment.start_date}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">End Date</Typography>
                  <Typography variant="body1">
                    {editedPayment.end_date}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Payment Date</Typography>
                <Typography variant="body1">
                  {selectedPaymentDetails?.logs[currentLogIndex]?.date}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Total Amount</Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  ${editedPayment.totalAmount?.toFixed(2) || "0.00"}
                </Typography>
              </Box>

              <TextField
                margin="dense"
                label="Paid Amount"
                type="number"
                fullWidth
                value={editedPayment.paid}
                onChange={(e) => {
                  const newAmount = parseFloat(e.target.value);
                  setEditedPayment({
                    ...editedPayment,
                    paid: newAmount,
                  });
                }}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={editedPayment.payment_method}
                  onChange={(e) =>
                    setEditedPayment({
                      ...editedPayment,
                      payment_method: e.target.value,
                    })
                  }
                  label="Payment Method"
                >
                  <MenuItem value="Gpay">Gpay</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Status</Typography>
                <Status
                  status={
                    editedPayment.paid === editedPayment.totalAmount
                      ? "COMPLETED"
                      : "PENDING"
                  }
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmDialog} onClose={() => setDeleteConfirmDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this payment record?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeletePayment(paymentToDelete);
              setDeleteConfirmDialog(false);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackBarOpen(false)}
        message={error ? `Error: ${error}` : "Operation completed successfully"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
};

export default PaymentList;