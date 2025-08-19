import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,

  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Typography,
  InputAdornment,
  Avatar,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Button,
  IconButton,
  Popover,
  Stack,
  Container,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  CircularProgress,
  Tooltip,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  CssBaseline,
  Grid,
  Menu,
  InputLabel,
  Card
} from '@mui/material';
import {
  Search as SearchIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  AssignmentInd,
  HowToReg as RegisterIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Home as AddressIcon,
  LocationOn as PincodeIcon,
  Cake as DOBIcon,
  Transgender as GenderIcon,
  MoreVert as MoreVertIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  MoreHoriz as OtherIcon,
  CreditCard as AadharIcon,
  School as GraduateIcon,
  Save as SaveIcon,
  ArrowForward as NextIcon,
  ArrowBack as BackIcon,
  PictureAsPdf,
  Description,
  PermIdentity,
  Info,
  VerifiedUser,
  School as CollegeIcon,
  Class as DegreeIcon,
  ListAlt as DeptIcon,
  CalendarToday as YearIcon,
  Grade as CgpaIcon,
  ContactPhone as FacultyIcon,
  CloudUpload,
  Delete,
  CheckCircle,
  AdminPanelSettings,
  TaskAlt,
  Business as CompanyIcon,
  Category as DomainIcon,
  Groups as DepartmentIcon,
  MonetizationOn as SchemeIcon,
  Groups as TeamIcon,
  Tag as AssetIcon,
  Event as StartDateIcon,
  EventAvailable as EndDateIcon,
  Schedule as DurationIcon,
  CalendarToday as DaysIcon,
  AccessTime as ShiftIcon,
  ToggleOn as StatusIcon,
  SupervisorAccount as ManagerIcon,
  Person as SupervisorIcon,
  AddAPhoto as AddPhotoIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import EditedForm from './EditedForm';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const theme = createTheme({
  palette: {
    primary: {
      main: '#4361ee',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3f37c9',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#3a56e8',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            color: '#4caf50',
          },
          '&.Mui-active': {
            color: '#4361ee',
          },
        },
      },
    },
  },
});

const InternLists = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('InProgress');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInternId, setSelectedInternId] = useState(null);
  const [interns, setInterns] = useState([]); // Active interns
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deletedInterns, setDeletedInterns] = useState([]); // Deleted interns

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    scheme: '',
    domain: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditedForm, setShowEditedForm] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState(null); // optional, to pass data

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all required data in parallel
        const [userDataRes, registerRes, tempRes] = await Promise.all([
          axios.get("http://localhost:8000/Sims/user-data/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/Sims/register/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://localhost:8000/Sims/temps/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        console.log("User Data:", userDataRes.data);

        // Get intern usernames from temp data
        const internUsernames = new Set(
          tempRes.data
            .filter((entry) => entry.role === "intern")
            .map((entry) => entry.username)
        );

        // Filter only intern users
        const internUsers = userDataRes.data.filter((user) =>
          internUsernames.has(user.username)
        );

        // Combine intern data with registration info
        const combinedData = internUsers.map((user) => {
          const registerInfo = registerRes.data.find(
            (reg) => reg.id === user.user
          ) || {};
          return {
            ...user,
            ...registerInfo,
            firstName: registerInfo.first_name || "",
            lastName: registerInfo.last_name || "",
          };
        });

        const today = new Date();

        const formatted = combinedData.map((item) => {
          const endDate = item.end_date ? new Date(item.end_date) : null;

          let status = "InProgress";
          if (item.user_status?.toLowerCase() === "discontinued") {
            status = "Discontinued";
          } else if (endDate && endDate < today) {
            status = "Completed";
          }

          return {
            id: item.emp_id,
            name: item.username,
            firstName: item.first_name || item.firstName || "",
            lastName: item.last_name || item.lastName || "",
            email: item.email || `${item.username}@example.com`,
            department: item.department || "-",
            scheme: item.scheme || "-",
            domain: item.domain || "-",
            startDate: item.start_date || "-",
            endDate: item.end_date || "-",
            status,
            reportingManager: item.reporting_manager_username || "-",
            reportingSupervisor: item.reporting_supervisor_username || "-",
            duration: item.duration || "-",
            shiftTiming: item.shift_timing || "-",
            teamName: item.team_name || "-",
          };
        });

        setInterns(formatted);
      } catch (error) {
        console.error("Failed to fetch interns:", error);
      }
    };


    fetchInterns();
  }, []);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleDeleteIntern = async (internId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Update status in backend (soft delete)
      const response = await axios.patch(
        `http://localhost:8000/Sims/user-data/${internId}/`,
        { is_deleted: "true" },  // Changed from is_deleted to user_status
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
  
      // Update frontend state
      setInterns(prevInterns => {
        const updatedInterns = [...prevInterns];
        const index = updatedInterns.findIndex(intern => intern.id === internId);
  
        if (index !== -1) {
          const deletedIntern = { 
            ...updatedInterns[index], 
            status: "Deleted" 
          };
          updatedInterns.splice(index, 1);  // Remove from active interns
          setDeletedInterns(prev => [...prev, deletedIntern]);  // Add to deleted interns
        }
  
        return updatedInterns;
      });
  
      // Show success message
      setSnackbarMessage("Intern deleted successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to delete intern:", error);
      setSnackbarMessage("Failed to delete intern. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleMenuOpen = (event, internId) => {
    setAnchorEl(event.currentTarget);
    setSelectedInternId(internId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInternId(null);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      scheme: '',
      domain: ''
    });
  };

  const filteredInterns = activeTab === 'Deleted'
    ? deletedInterns.filter(intern =>
      intern.id.toString().includes(searchTerm) ||
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.scheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.domain.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : interns.filter(intern =>
      intern.status === activeTab &&
      (intern.id.toString().includes(searchTerm) ||
        intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.scheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.domain.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.department === '' || intern.department === filters.department) &&
      (filters.scheme === '' || intern.scheme === filters.scheme) &&
      (filters.domain === '' || intern.domain === filters.domain)
    );
  const columns = [
    'Intern ID', 'Intern Name', 'Email ID', 'Department', 'Scheme', 'Domain', 'Start Date', 'End Date', 'Status', 'Action'
  ];

  const departments = [...new Set(interns.map(intern => intern.department))];
  const schemes = [...new Set(interns.map(intern => intern.scheme))];
  const domains = [...new Set(interns.map(intern => intern.domain))];

  const count = Math.ceil(filteredInterns.length / rowsPerPage);
  const paginatedInterns = filteredInterns.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const schemeColors = {
    'Free': { bg: '#e3f2fd', text: '#1976d2' },
    'Project': { bg: '#e8f5e9', text: '#388e3c' },
    'Course': { bg: '#fff3e0', text: '#ffa000' }
  };

  const domainColors = {
    'Full Stack': { bg: '#e3f2fd', text: '#1976d2' },
    'Machine Learning': { bg: '#f3e5f5', text: '#8e24aa' },
    'Cloud Computing': { bg: '#e0f7fa', text: '#00acc1' },
    'Mobile Development': { bg: '#e8f5e9', text: '#43a047' },
    'Data Analytics': { bg: '#f1f8e9', text: '#7cb342' },
    'Design Systems': { bg: '#fff8e1', text: '#ffb300' }
  };

  const open = Boolean(filterAnchorEl);
  const id = open ? 'filter-popover' : undefined;

  const handleAddIntern = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleInternAdded = () => {
    setShowAddForm(false);
    // Refresh the intern list
  
    const fetchInterns = async () => {
      try {
        const token = localStorage.getItem("token");
    
        // Fetch all required data in parallel
        const [userDataRes, registerRes, tempRes] = await Promise.all([
          axios.get("http://localhost:8000/Sims/user-data/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/Sims/register/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://localhost:8000/Sims/temps/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
    
        // Get intern usernames from temp data
        const internUsernames = new Set(
          tempRes.data
            .filter((entry) => entry.role === "intern")
            .map((entry) => entry.username)
        );
    
        // Filter only intern users
        const internUsers = userDataRes.data.filter((user) =>
          internUsernames.has(user.username)
        );
    
        // Combine intern data with registration info
        const combinedData = internUsers.map((user) => {
          const registerInfo = registerRes.data.find(
            (reg) => reg.id === user.user
          ) || {};
          return {
            ...user,
            ...registerInfo,
            firstName: registerInfo.first_name || "",
            lastName: registerInfo.last_name || "",
          };
        });
    
        const today = new Date();
    
        // Separate active and deleted interns
        const activeInterns = [];
        const deletedInterns = [];
    
        combinedData.forEach((item) => {
          const endDate = item.end_date ? new Date(item.end_date) : null;
          const isDeleted = item.user_status?.toLowerCase() === "deleted";
    
          const internData = {
            id: item.emp_id,
            name: item.username,
            firstName: item.first_name || item.firstName || "",
            lastName: item.last_name || item.lastName || "",
            email: item.email || `${item.username}@example.com`,
            department: item.department || "-",
            scheme: item.scheme || "-",
            domain: item.domain || "-",
            startDate: item.start_date || "-",
            endDate: item.end_date || "-",
            status: isDeleted ? "Deleted" : 
                    item.user_status?.toLowerCase() === "discontinued" ? "Discontinued" :
                    endDate && endDate < today ? "Completed" : "InProgress",
            reportingManager: item.reporting_manager_username || "-",
            reportingSupervisor: item.reporting_supervisor_username || "-",
            duration: item.duration || "-",
            shiftTiming: item.shift_timing || "-",
            teamName: item.team_name || "-",
          };
    
          if (isDeleted) {
            deletedInterns.push(internData);
          } else {
            activeInterns.push(internData);
          }
        });
    
        setInterns(activeInterns);
        setDeletedInterns(deletedInterns);
      } catch (error) {
        console.error("Failed to fetch interns:", error);
      }
    };
  
    fetchInterns();
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showAddForm ? (
        <MultiStepForm onClose={handleCloseAddForm} onComplete={handleInternAdded} />
      ) : (
        <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            backgroundColor: 'background.paper',
            p: 3,
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Intern Management
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Search by name, ID, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: 350,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fieldset: {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton
                onClick={handleFilterClick}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 1,
                  color: 'primary.main'
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddIntern}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1
              }}
            >
              Add Intern
            </Button>
          </Box>

          <Popover
            id={id}
            open={open}
            anchorEl={filterAnchorEl}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                p: 3,
                width: 300,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>

            <Stack spacing={3}>
              <FormControl fullWidth size="small">
                <Typography variant="body2" sx={{ mb: 1 }}>Department</Typography>
                <Select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <Typography variant="body2" sx={{ mb: 1 }}>Scheme</Typography>
                <Select
                  name="scheme"
                  value={filters.scheme}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">All Schemes</MenuItem>
                  {schemes.map((scheme) => (
                    <MenuItem key={scheme} value={scheme}>{scheme}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <Typography variant="body2" sx={{ mb: 1 }}>Domain</Typography>
                <Select
                  name="domain"
                  value={filters.domain}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">All Domains</MenuItem>
                  {domains.map((domain) => (
                    <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  onClick={clearFilters}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleFilterClose}
                  variant="contained"
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Apply
                </Button>
              </Box>
            </Stack>
          </Popover>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 3
              }
            }}
            variant="fullWidth"
          >
            <Tab
              label="In Progress"
              value="InProgress"
              icon={<WorkIcon fontSize="small" />}
              iconPosition="start"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: 48
              }}
            />
            <Tab
              label="Completed"
              value="Completed"
              icon={<CheckCircleIcon fontSize="small" />}
              iconPosition="start"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: 48
              }}
            />
            <Tab
              label="Discontinued"
              value="Discontinued"
              icon={<CancelIcon fontSize="small" />}
              iconPosition="start"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: 48
              }}
            />
            <Tab
              label="Deleted"
              value="Deleted"
              icon={<DeleteIcon fontSize="small" />}
              iconPosition="start"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: 48
              }}
            />
          </Tabs>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: 'background.default' }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInterns.map((intern) => (
                  <TableRow
                    key={intern.id}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>{intern.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            mr: 2,
                            bgcolor: 'primary.main',
                            color: 'common.white'
                          }}
                        >
                          {intern.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {intern.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {intern.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{intern.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={intern.scheme}
                        size="small"
                        sx={{
                          backgroundColor: schemeColors[intern.scheme]?.bg || '#f5f5f5',
                          color: schemeColors[intern.scheme]?.text || 'text.primary',
                          fontWeight: 500,
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={intern.domain}
                        size="small"
                        sx={{
                          backgroundColor: domainColors[intern.domain]?.bg || '#f5f5f5',
                          color: domainColors[intern.domain]?.text || 'text.primary',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>{intern.startDate}</TableCell>
                    <TableCell>{intern.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={intern.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            intern.status === 'InProgress' ? 'rgba(33, 150, 243, 0.1)' :
                              intern.status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                          color:
                            intern.status === 'InProgress' ? 'primary.main' :
                              intern.status === 'Completed' ? 'success.main' : 'error.main',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton onClick={(e) => handleMenuOpen(e, intern.id)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedInternId === intern.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            navigate('/EditedForm', { state: { internData: intern } });
                            handleMenuClose();
                          }}
                        >
                          <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleDeleteIntern(intern.id);
                            handleMenuClose();
                          }}
                        >
                          <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>



                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredInterns.length === 0 ? (
            <Box sx={{
              textAlign: 'center',
              p: 5,
              color: 'text.secondary',
              backgroundColor: 'background.paper',
              borderRadius: 3,
              mt: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}>
              <Typography variant="h6">No interns found</Typography>
              <Typography variant="body2" mt={1}>
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3,
              p: 2,
              backgroundColor: 'background.paper',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="body2" color="text.secondary">
                Showing {paginatedInterns.length} of {filteredInterns.length} interns
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }} color="text.secondary">
                  Rows per page:
                </Typography>
                <FormControl variant="standard" size="small">
                  <Select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                      '& .MuiSelect-select': {
                        py: 1,
                        pl: 1.5,
                        pr: 3
                      }
                    }}
                  >
                    {[5, 10, 25].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Pagination
                  count={count}
                  page={page}
                  onChange={handleChangePage}
                  shape="rounded"
                  sx={{ ml: 2 }}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </ThemeProvider>
  );
};

// -----------------register&personaldata------------------

const RegisterPage = ({ onNext, initialData, isReturning }) => {
  const [formData, setFormData] = useState( {
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    mobile: "",
    department: "",
    role: "intern",
    address1: "",
    address2: "",
    pincode: "",
    dob: "",
    gender: "",
    aadharNumber: "",
    isFirstGraduate: false,
    profilePhoto: null
  });

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(initialData?.profilePhotoUrl || null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const roles = [
    { value: "intern", label: "Intern" },
    
  ];

  const genders = [
    { value: "male", label: "Male", icon: <MaleIcon /> },
    { value: "female", label: "Female", icon: <FemaleIcon /> },
    { value: "other", label: "Other", icon: <OtherIcon /> }
  ];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/Sims/departments/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : 
             (name === "mobile" || name === "pincode" || name === "aadharNumber") ? 
             value.replace(/\D/g, "") : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setSnackbarMessage("Please select an image file (JPEG, PNG)");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage("Image size should be less than 5MB");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({
          ...formData,
          profilePhoto: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    
    if (formData.role === "intern" && !formData.department) {
      newErrors.department = "Department is required for interns";
    }

    if (!formData.address1) newErrors.address1 = "Address 1 is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    else if (formData.pincode.length !== 6) newErrors.pincode = "Pincode must be 6 digits";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const adminToken = localStorage.getItem('token');
        
        // 1. Register User (Temp record)
        const registerPayload = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role,
          department: formData.department
        };
        
        
  
        const registerResponse = await axios.post(
          "http://localhost:8000/Sims/register/",
          registerPayload,
          {
            headers: {
              Authorization: `Token ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (validateForm()) {
          try {
            localStorage.setItem("internDepartment", formData.department); // save department
            if (onNext) onNext(formData);
          } catch (error) {
            // handle error
          }
        }
  
        const emp_id = registerResponse.data?.emp_id;
        localStorage.setItem("emp_id", emp_id); // store it once
        if (!emp_id) throw new Error("Missing emp_id in registration response");
  
        const personalFormData = new FormData();
        personalFormData.append('emp_id', emp_id);
        personalFormData.append('gender', formData.gender.toUpperCase().substring(0, 1));
        personalFormData.append('date_of_birth', formData.dob);
        personalFormData.append('phone_no', formData.mobile);
        if (formData.aadharNumber) {
          personalFormData.append('aadhar_number', parseInt(formData.aadharNumber, 10));
        }
        
        personalFormData.append('address1', formData.address1);
        personalFormData.append('address2', formData.address2 || '');
        personalFormData.append('pincode', formData.pincode);
        if (formData.profilePhoto) {
          personalFormData.append('photo', formData.profilePhoto, formData.profilePhoto.name);
        }


  
        // 3. Send personal data as multipart/form-data
        await axios.post(
          "http://localhost:8000/Sims/personal-data/",
          personalFormData,
          {
            headers: {
              Authorization: `Token ${adminToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
  
        // Success handling
        setSnackbarMessage("Registration successful!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        
        if (onNext) onNext(formData);
  
      } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        
        const errorMessage = error.response?.data?.detail || 
          Object.values(error.response?.data || {})[0]?.[0] || 
          "Registration failed";
          
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };
  

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleDeletePhoto = () => {
    setFormData({ ...formData, profilePhoto: null });
    setPhotoPreview(null);
  };

  return (
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4
              }}>
                <Avatar sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  mb: 2
                }}>
                  <RegisterIcon fontSize="large" />
                </Avatar>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}
                >
                  User Registration
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Fill in the details to register a new user
                </Typography>
              </Box>
            
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={!!errors.username}
                      helperText={errors.username}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!errors.first_name}
                      helperText={errors.first_name}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!errors.last_name}
                      helperText={errors.last_name}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mobile (Optional)"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      error={!!errors.mobile}
                      helperText={errors.mobile}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.department}>
                      <InputLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentInd fontSize="small" color="action" /> Department
                        </Box>
                      </InputLabel>
                      <Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        label="Department"
                        disabled={formData.role !== "intern"}
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept.id} value={dept.department}>
                            {dept.department}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.department && (
                        <Typography variant="caption" color="error">
                          {errors.department}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ my: 4 }}>
                  <Divider>
                    <Typography variant="h6" sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.primary',
                      fontWeight: 'bold'
                    }}>
                      <AddressIcon color="primary" /> Personal Details
                    </Typography>
                  </Divider>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address 1"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                      error={!!errors.address1}
                      helperText={errors.address1}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AddressIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address 2 (Optional)"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AddressIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      error={!!errors.pincode}
                      helperText={errors.pincode}
                      variant="outlined"
                      inputProps={{ maxLength: 6 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PincodeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      error={!!errors.dob}
                      helperText={errors.dob}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DOBIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                
                  <Grid item xs={12}>
                    <FormControl component="fieldset" error={!!errors.gender}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <GenderIcon color="primary" />
                        <Typography variant="subtitle1">Gender</Typography>
                      </Box>
                      <RadioGroup
                        row
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        {genders.map((gender) => (
                          <FormControlLabel
                            key={gender.value}
                            value={gender.value}
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {gender.icon} {gender.label}
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                      {errors.gender && (
                        <Typography variant="caption" color="error">
                          {errors.gender}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<UploadIcon />}
                        onClick={triggerFileInput}
                        sx={{
                          py: 1,
                          px: 2,
                          fontWeight: 'bold'
                        }}
                      >
                        Upload Your Photo
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        JPEG or PNG, Max 5MB
                      </Typography>

                      {photoPreview && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            alt="Profile Photo"
                            src={photoPreview}
                            sx={{ width: 50, height: 50, border: '2px solid #f5f5f5' }}
                          />
                          <IconButton color="error" onClick={handleDeletePhoto}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AadharIcon color="primary" /> Optional Details
                    </Typography>
                  
                    <TextField
                      fullWidth
                      label="Aadhar Number (Optional)"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      variant="outlined"
                      inputProps={{ maxLength: 12 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AadharIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isFirstGraduate}
                          onChange={handleChange}
                          name="isFirstGraduate"
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GraduateIcon color="action" /> First Graduate
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      size="large"
                      startIcon={<CancelIcon />}
                      onClick={() => navigate('/admindashboard', { state: { show: "Intern Management" } })}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary" 
                      type="submit"
                      size="large"
                      startIcon={<SaveIcon />}
                      endIcon={<NextIcon />}
                    >
                      Save & Next
                    </Button>
                  </Grid>
                </Grid>
              </form>
            
              <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert 
                  onClose={() => setOpenSnackbar(false)} 
                  severity={snackbarSeverity} 
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Paper>
            );
            };
            // ------------------------end register&personaldata------------------
            //-------------------------College details----------------------------
            const CollegeInfoForm = ({ onBack, onNext, initialData }) => {
            const [formData, setFormData] = useState(initialData || {
            collegeName: "",
            collegeAddress: "",
            collegeEmail: "",
            degreeType: "",
            degree: "",
            department: "",
            yearOfPassing: "",
            cgpa: "",
            facultyNumber: ""
            });
            
            const [errors, setErrors] = useState({});
            const [openSnackbar, setOpenSnackbar] = useState(false);
            const [snackbarMessage, setSnackbarMessage] = useState("");
            const [snackbarSeverity, setSnackbarSeverity] = useState("success");
            
            const departments = [
            "Computer Science",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Civil Engineering",
            "Electronics & Communication",
            "Information Technology",
            "Chemical Engineering",
            "Biotechnology",
            "Mathematics",
            "Physics",
            "Chemistry",
            "Business Administration",
            "Commerce",
            "Arts",
            "Law",
            "Medicine"
            ];
            
            const degrees = {
            UG: ["B.Tech", "B.E", "B.Sc", "B.Com", "B.A", "BBA", "LLB", "MBBS"],
            PG: ["M.Tech", "M.E", "M.Sc", "M.Com", "M.A", "MBA", "LLM", "MD"],
            OTHER: ["Diploma", "Ph.D", "Post Doctoral", "Certificate Course"]
            };
            
            const handleChange = (e) => {
            const { name, value } = e.target;
            
            setFormData(prev => ({
              ...prev,
              [name]: value
            }));
            
            if (errors[name]) {
              setErrors(prev => ({ ...prev, [name]: "" }));
            }
            };
            
            const validateForm = () => {
            const newErrors = {};
            if (!formData.collegeName) newErrors.collegeName = "College name is required";
            if (!formData.collegeAddress) newErrors.collegeAddress = "College address is required";
            if (!formData.degree) newErrors.degree = "Degree is required";
            if (!formData.department) newErrors.department = "Department is required";
            if (!formData.yearOfPassing) newErrors.yearOfPassing = "Year of passing is required";
            else if (formData.yearOfPassing.length !== 4 || isNaN(formData.yearOfPassing)) {
            newErrors.yearOfPassing = "Enter a valid year";
            }
            if (!formData.cgpa) newErrors.cgpa = "CGPA is required";
            else if (isNaN(formData.cgpa) || parseFloat(formData.cgpa) > 10 || parseFloat(formData.cgpa) < 0) {
            newErrors.cgpa = "Enter a valid CGPA (0-10)";
            }
            
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
            };
            

            const handleSubmit = async (e) => {
              e.preventDefault();

              if (validateForm()) {
                try {
                  const token = localStorage.getItem("token");
                  const emp_id1 = localStorage.getItem("emp_id"); // Or wherever you get it from
                  console.log("emp_id1", emp_id1);
                  const payload = {
                    emp_id: emp_id1,
                    college_name: formData.collegeName,
                    college_address: formData.collegeAddress,
                    college_emailid: formData.collegeEmail ? parseInt(formData.collegeEmail) : null,
                    degree_type: formData.degreeType,
                    degree: formData.degree,
                    college_department: formData.department,
                    year_of_passing: parseInt(formData.yearOfPassing),
                    cgpa: parseFloat(formData.cgpa),
                    college_faculty_phonenumber: formData.facultyNumber ? parseInt(formData.facultyNumber) : null,
                  };
                  

                  await axios.post("http://localhost:8000/Sims/college-details/", payload, {
                    headers: {
                      Authorization: `Token ${token}`,
                      "Content-Type": "application/json"
                    }
                  });

                  setSnackbarMessage("College information saved! Continue to next step...");
                  setSnackbarSeverity("success");
                  setOpenSnackbar(true);

                  if (onNext) onNext(formData);
                } catch (error) {
                  console.error("Error submitting college info:", error);
                  setSnackbarMessage("Failed to save college details. Please try again.");
                  setSnackbarSeverity("error");
                  setOpenSnackbar(true);
                }
              }
            };

            
            return (
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
            }}>
            <Avatar sx={{
            bgcolor: 'primary.main',
            width: 56,
            height: 56,
            mb: 2
            }}>
            <CollegeIcon fontSize="large" />
            </Avatar>
            <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
            fontWeight: 'bold',
            color: 'text.primary'
            }}
            >
            College Information
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
            Provide your academic details
            </Typography>
            </Box>
            
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="College Name"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      error={!!errors.collegeName}
                      helperText={errors.collegeName}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CollegeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="College Address"
                      name="collegeAddress"
                      value={formData.collegeAddress}
                      onChange={handleChange}
                      error={!!errors.collegeAddress}
                      helperText={errors.collegeAddress}
                      variant="outlined"
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AddressIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="College Email (Optional)"
                      name="collegeEmail"
                      type="email"
                      value={formData.collegeEmail}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider>
                      <Typography variant="h6" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'text.primary',
                        fontWeight: 'bold'
                      }}>
                        <DegreeIcon color="primary" /> Academic Details
                      </Typography>
                    </Divider>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DegreeIcon color="primary" />
                        <Typography variant="subtitle1">Degree Type</Typography>
                      </Box>
                      <RadioGroup
                        row
                        name="degreeType"
                        value={formData.degreeType}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="UG"
                          control={<Radio color="primary" />}
                          label="Undergraduate (UG)"
                        />
                        <FormControlLabel
                          value="PG"
                          control={<Radio color="primary" />}
                          label="Postgraduate (PG)"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio color="primary" />}
                          label="Other"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.degree}>
                      <InputLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DegreeIcon fontSize="small" color="action" /> Degree
                        </Box>
                      </InputLabel>
                      <Select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        label="Degree"
                      >
                        {degrees[formData.degreeType]?.map((degree) => (
                          <MenuItem key={degree} value={degree}>
                            {degree}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.degree && (
                        <Typography variant="caption" color="error">
                          {errors.degree}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.department}>
                      <InputLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DeptIcon fontSize="small" color="action" /> Department
                        </Box>
                      </InputLabel>
                      <Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        label="Department"
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.department && (
                        <Typography variant="caption" color="error">
                          {errors.department}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Year of Passing"
                      name="yearOfPassing"
                      type="number"
                      value={formData.yearOfPassing}
                      onChange={handleChange}
                      error={!!errors.yearOfPassing}
                      helperText={errors.yearOfPassing}
                      variant="outlined"
                      inputProps={{ min: "1900", max: "2099" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <YearIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CGPA (out of 10)"
                      name="cgpa"
                      type="number"
                      value={formData.cgpa}
                      onChange={handleChange}
                      error={!!errors.cgpa}
                      helperText={errors.cgpa}
                      variant="outlined"
                      inputProps={{ step: "0.01", min: "0", max: "10" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CgpaIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Faculty Number (Optional)"
                      name="facultyNumber"
                      value={formData.facultyNumber}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FacultyIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
            
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      size="large"
                      startIcon={<BackIcon />}
                      onClick={onBack}
                    >
                      Previous
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary" 
                      type="submit"
                      size="large"
                      startIcon={<SaveIcon />}
                      endIcon={<NextIcon />}
                    >
                      Save & Next
                    </Button>
                  </Grid>
                </Grid>
              </form>
            
              <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert 
                  onClose={() => setOpenSnackbar(false)} 
                  severity={snackbarSeverity} 
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Paper>
            );
            };
          //  -------------------------End college details----------------------------- 
          // -----------------------------companydetails---------------------
            const CompanyDetailsForm = ({ onBack, onNext, initialData }) => {
            const [formData, setFormData] = useState({
                domain: "",
                scheme: "",
                teamName: "",
                assetCode: "",
                startDate: null,
                endDate: null,
                duration: "",
                workingDays: "",
                shiftTiming: "",
                status: "",
                reportingManager: "",
                reportingSupervisor: ""
              });
            
            const [errors, setErrors] = useState({});
            const [openSnackbar, setOpenSnackbar] = useState(false);
            const [snackbarMessage, setSnackbarMessage] = useState("");
            const [snackbarSeverity, setSnackbarSeverity] = useState("success");
            const [department, setDepartment] = useState([]);
            const [domain, setDomain] = useState([]);
            

            useEffect(() => {
              const fetchDepartmentAndDomains = async () => {
                try {
                  const emp_id = localStorage.getItem("emp_id");
                  const token = localStorage.getItem("token");
            
                  // 1. Fetch user's department
                  const userRes = await axios.get(`http://localhost:8000/Sims/user-data/${emp_id}/`, {
                    headers: { Authorization: `Token ${token}` }
                  });
            
                  const dept = localStorage.getItem("internDepartment") || userRes.data.department;
                  setDepartment(dept);
            
                  if (dept && typeof dept === "string") {
                    // 2. Fetch domains by department using new API
                    const domainRes = await axios.get(
                      `http://localhost:8000/Sims/domains-by-department/?department=${encodeURIComponent(dept)}`,
                      { headers: { Authorization: `Token ${token}` } }
                    );
                    console.log("Domain response:", domainRes.data);
            
                    if (Array.isArray(domainRes.data)) {
                      setDomain(domainRes.data); // Set full array of { id, domain, department }
                    } else {
                      console.warn("Unexpected domain response format", domainRes.data);
                      setDomain([]);
                    }
                  }
                } catch (error) {
                  console.error("Error fetching department or domains:", error);
                  setDomain([]);
                }
              };
            
              fetchDepartmentAndDomains();
            }, []);
            
            
            
            useEffect(() => {
              if (department) {
                const fetchDomains = async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get("http://localhost:8000/Sims/domains/", {
                      headers: { Authorization: `Token ${token}` },
                    });
                    
                    // Handle paginated or non-paginated responses
                    const domainsData = res.data.results || res.data;
                    
                    // Ensure domainsData is an array
                    const filteredDomains = Array.isArray(domainsData)
                      ? domainsData.filter((d) =>
                        d.department?.toLowerCase().trim() === (typeof department === "string" ? department.toLowerCase().trim() : "")

                        )
                      : [];

                    
                    setDomain(filteredDomains);
                  } catch (error) {
                    console.error("Error fetching domains:", error);
                    setDomain([]); // Reset to empty array on error
                  }
                };
                fetchDomains();
              }
            }, [department]);            
            
            const handleFilterChange = (e) => {
              const { name, value } = e.target;
              setFormData((prev) => ({
                ...prev,
                [name]: value
              }));
              
            };
          
          
            
            
            
            const workingDaysOptions = [
            { value: "mon-fri", label: "Monday to Friday" },
            { value: "mon-sat", label: "Monday to Saturday" },
            { value: "sun-thu", label: "Sunday to Thursday" },
            { value: "shift", label: "Rotational Shifts" }
            ];
            
            const shiftTimings = [
            { value: "9am-1pm", label: "9:00 AM - 1:00 PM" },
            { value: "1pm-5pm", label: "1:00 PM - 5:00 PM" },
            { value: "9am-5pm", label: "9:00 AM - 5:00 PM" },
            { value: "10am-6pm", label: "10:00 AM - 6:00 PM" },
            { value: "2pm-10pm", label: "2:00 PM - 10:00 PM" },
            { value: "10pm-6am", label: "10:00 PM - 6:00 AM" }
            ];
            
            const reportingStaff = [
            "John Smith",
            "Sarah Johnson",
            "Michael Brown",
            "Emily Davis",
            "David Wilson",
            "Jessica Lee",
            "Robert Taylor",
            "Jennifer Martinez"
            ];
            
            useEffect(() => {
            if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            
              if (start > end) {
                setErrors(prev => ({ ...prev, endDate: "End date cannot be before start date" }));
                setFormData(prev => ({...prev, duration: "" }));
                return;
              }
              
              const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                                  (end.getMonth() - start.getMonth());
              
              setFormData(prev => ({
                ...prev,
                duration: `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`
              }));
            }
            }, [formData.startDate, formData.endDate]);
            
            const handleChange = (e) => {
            const { name, value } = e.target;
            
            setFormData(prev => ({
              ...prev,
              [name]: value
            }));
            
            if (errors[name]) {
              setErrors(prev => ({ ...prev, [name]: "" }));
            }
            };


      
           
            
            
            const handleDateChange = (name, date) => {
            setFormData(prev => ({
            ...prev,
            [name]: date
            }));
            
            if (name === "endDate" && formData.startDate && date < formData.startDate) {
              setErrors(prev => ({ ...prev, endDate: "End date cannot be before start date" }));
            } else if (errors.endDate) {
              setErrors(prev => ({ ...prev, endDate: "" }));
            }
            };

             // For staff list for reporting manager and supervisor
            const [staffList, setStaffList] = useState([]);

            useEffect(() => {
              const department = localStorage.getItem("internDepartment");
              const token = localStorage.getItem("token");
            
              console.log("Department from localStorage:", department);
            
              if (department && token) {
                axios.get(`http://localhost:8000/Sims/staffs-by-department/?department=${encodeURIComponent(department)}`, {
                  headers: {
                    Authorization: `Token ${token}`
                  }
                })
                .then((response) => setStaffList(response.data))
                .catch((error) => console.error("Failed to fetch staff list:", error));
              }
            }, []);
            
            console.log("staffssssss response", staffList);
            
            const validateForm = () => {
            const newErrors = {};
            if (!formData.domain) newErrors.domain = "Domain is required";
            if (!formData.teamName) newErrors.teamName = "Team name is required";
            if (!formData.startDate) newErrors.startDate = "Start date is required";
            if (!formData.endDate) newErrors.endDate = "End date is required";
            if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
            newErrors.endDate = "End date cannot be before start date";
            }
            
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
            };
            
            // PATCH Request for Company Details
            const handleSubmit = async (e) => {
              e.preventDefault(); // Prevent form from refreshing the page
            
              if (!validateForm()) return;
            
              const emp_id = localStorage.getItem("emp_id");
              const token = localStorage.getItem("token");
            
              const payload = {
                domain: formData.domain, // this should match the `domain` string of a valid Domain object
                scheme: formData.scheme.toUpperCase(), // Ensure values like 'FREE', 'COURSE', 'PROJECT'
                team_name: formData.teamName || null,
                asset_code: formData.assetCode || null,
                start_date: formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : null,
                end_date: formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : null,
                duration: formData.duration || null,
                days: formData.workingDays || null,
                shift_timing: formData.shiftTiming || null,
                status: formData.status || "active",
                reporting_manager: formData.reportingManager || null, // this must be a valid username
                reporting_supervisor: formData.reportingSupervisor || null, // must be valid username
              };
              
            
              try {
                const res = await axios.patch(`http://localhost:8000/Sims/user-data/${emp_id}/`, payload, {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                  }
                });
            
                setSnackbarMessage("Company details saved successfully!");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            
                if (onNext) onNext(formData); // Proceed only on success
            
              } catch (error) {
                console.error("Failed to save company details:", error.response?.data || error.message);
                setSnackbarMessage("Failed to save company details. Please check required fields.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
                // ❌ DO NOT reload or redirect
              }
            };
            
            
            

            
            return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
            }}>
            <Avatar sx={{
            bgcolor: 'primary.main',
            width: 56,
            height: 56,
            mb: 2
            }}>
            <CompanyIcon fontSize="large" />
            </Avatar>
            <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
            fontWeight: 'bold',
            color: 'text.primary'
            }}
            >
            Company Details
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
            Provide your company and employment details
            </Typography>
            </Box>
            
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="body2" sx={{ mb: 1 }}>Domain</Typography>
                      <Select
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="">Select Domain</MenuItem>
                        {Array.isArray(domain) && domain.map((item) => (
                          <MenuItem key={item.id} value={item.domain}>
                            {item.domain}
                          </MenuItem>
                        ))}

                      </Select>
                    </FormControl>




                    </Grid>
                    
              
                    
                    <Grid item xs={12}>
                      <Divider>
                        <Typography variant="h6" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'text.primary',
                          fontWeight: 'bold'
                        }}>
                          <SchemeIcon color="primary" /> Scheme
                        </Typography>
                      </Divider>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <SchemeIcon color="primary" />
                          <Typography variant="subtitle1">Scheme</Typography>
                        </Box>
                        <RadioGroup
                          row
                          name="scheme"
                          value={formData.scheme}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="free"
                            control={<Radio color="primary" />}
                            label="Free"
                          />
                          <FormControlLabel
                            value="course"
                            control={<Radio color="primary" />}
                            label="Course"
                          />
                          <FormControlLabel
                            value="project"
                            control={<Radio color="primary" />}
                            label="Project"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Team Name"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        error={!!errors.teamName}
                        helperText={errors.teamName}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TeamIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Asset Code (Optional)"
                        name="assetCode"
                        value={formData.assetCode}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AssetIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider>
                        <Typography variant="h6" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'text.primary',
                          fontWeight: 'bold'
                        }}>
                          <DurationIcon color="primary" /> Duration Details
                        </Typography>
                      </Divider>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <DatePicker
                        label="Start Date"
                        value={formData.startDate}
                        onChange={(date) => handleDateChange("startDate", date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <StartDateIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <DatePicker
                        label="End Date"
                        value={formData.endDate}
                        onChange={(date) => handleDateChange("endDate", date)}
                        minDate={formData.startDate}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EndDateIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={formData.duration}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <DurationIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DaysIcon fontSize="small" color="action" /> Working Days
                          </Box>
                        </InputLabel>
                        <Select
                          name="workingDays"
                          value={formData.workingDays}
                          onChange={handleChange}
                          label="Working Days"
                        >
                          {workingDaysOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShiftIcon fontSize="small" color="action" /> Shift Timing
                          </Box>
                        </InputLabel>
                        <Select
                          name="shiftTiming"
                          value={formData.shiftTiming}
                          onChange={handleChange}
                          label="Shift Timing"
                        >
                          {shiftTimings.map((shift) => (
                            <MenuItem key={shift.value} value={shift.value}>
                              {shift.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider>
                        <Typography variant="h6" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'text.primary',
                          fontWeight: 'bold'
                        }}>
                          <StatusIcon color="primary" /> Status & Reporting
                        </Typography>
                      </Divider>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <StatusIcon color="primary" />
                          <Typography variant="subtitle1">Status</Typography>
                        </Box>
                        <RadioGroup
                          row
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="active"
                            control={<Radio color="primary" />}
                            label="Active"
                          />
                          <FormControlLabel
                            value="inactive"
                            control={<Radio color="primary" />}
                            label="Inactive"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
  <FormControl fullWidth>
    <InputLabel id="reporting-manager-label">Reporting Manager (Optional)</InputLabel>
    <Select
      labelId="reporting-manager-label"
      name="reportingManager"
      value={formData.reportingManager}
      onChange={handleChange}
      label="Reporting Manager (Optional)"
    >
      <MenuItem value=""><em>None</em></MenuItem>
      {staffList.map((staff) => (
        <MenuItem key={staff.id} value={staff.username}>
          {staff.username}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} md={6}>
  <FormControl fullWidth>
    <InputLabel id="reporting-supervisor-label">Reporting Supervisor (Optional)</InputLabel>
    <Select
      labelId="reporting-supervisor-label"
      name="reportingSupervisor"
      value={formData.reportingSupervisor}
      onChange={handleChange}
      label="Reporting Supervisor (Optional)"
    >
      <MenuItem value=""><em>None</em></MenuItem>
      {staffList.map((staff) => (
        <MenuItem key={staff.id} value={staff.username}>
          {staff.username}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

                  </Grid>
            
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        size="large"
                        startIcon={<BackIcon />}
                        onClick={onBack}
                      >
                        Previous
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        type="submit"
                        size="large"
                        startIcon={<SaveIcon />}
                        endIcon={<NextIcon />}
                      >
                        Save & Next
                      </Button>
                    </Grid>
                  </Grid>
                </form>
            
                <Snackbar 
                  open={openSnackbar} 
                  autoHideDuration={6000} 
                  onClose={() => setOpenSnackbar(false)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarSeverity} 
                    sx={{ width: "100%" }}
                  >
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </Paper>
            </LocalizationProvider>
            );
            };
            // -------------------end company details---------------------
            // -------------------Documents Upload---------------------
            const DocumentsUpload = ({ onBack, onNext, initialData, registerData }) => {
            const [files, setFiles] = useState(initialData || {
            adhaarCard: null,
            bonafideCertificate: null,
            collegeId: null,
            resume: null
            });
            
            const [loading, setLoading] = useState(false);
            const [snackbarOpen, setSnackbarOpen] = useState(false);
            const [snackbarKey, setSnackbarKey] = useState(0);
            const [snackbarMessage, setSnackbarMessage] = useState("");
            const [formData, setFormData] = useState({
              title: "",
              description: "",
              receiver: ""
            });
        
            // Here's the continuation of the code with the complete DocumentsUpload component and the rest of the implementation:
            
              const [snackbarSeverity, setSnackbarSeverity] = useState('success');
              const [agreeToTerms, setAgreeToTerms] = useState(false);
              const [progress, setProgress] = useState({
                adhaarCard: 0,
                bonafideCertificate: 0,
                collegeId: 0,
                resume: 0
              });
              const [openDialog, setOpenDialog] = useState(false);
              
              const documentNames = {
                adhaarCard: "Adhaar Card",
                bonafideCertificate: "Bonafide Certificate",
                collegeId: "College ID",
                resume: "Resume"
              };
              
              const handleFileUpload = (e, key) => {
                const file = e.target.files[0];
                if (!file) return;
                
                if (file.size > MAX_FILE_SIZE) {
                  showSnackbar(`File size exceeds the limit of 5MB for ${documentNames[key]}`, 'error', key);
                  return;
                }
                
                if (file.type !== 'application/pdf') {
                  showSnackbar(`Please upload a valid PDF file for ${documentNames[key]}`, 'error', key);
                  return;
                }
                
                setFiles({ ...files, [key]: file });
                simulateUploadProgress(key);
              };
              
              const simulateUploadProgress = (key) => {
                setProgress(prev => ({ ...prev, [key]: 0 }));
                const interval = setInterval(() => {
                  setProgress(prev => {
                    const newProgress = { ...prev };
                    if (newProgress[key] === 100) {
                      clearInterval(interval);
                      showSnackbar(`${documentNames[key]} uploaded successfully!`, 'success', key);
                      return newProgress;
                    }
                    newProgress[key] = Math.min(newProgress[key] + 10, 100);
                    return newProgress;
                  });
                }, 200);
              };
              
              const showSnackbar = (message, severity, key) => {
                setSnackbarMessage(message);
                setSnackbarSeverity(severity);
                setSnackbarKey(key);
                setSnackbarOpen(true);
              };
              
              const handleDeleteFile = (key) => {
                setFiles({ ...files, [key]: null });
                setProgress(prev => ({ ...prev, [key]: 0 }));
                showSnackbar(`${documentNames[key]} removed`, 'info', key);
              };
              
              const handleSaveSubmit = async (e) => {
                e.preventDefault();
              
                // Validate all required files are present
                if (!files.adhaarCard || !files.bonafideCertificate || !files.collegeId || !files.resume) {
                  showSnackbar('Please upload all required documents', 'error');
                  return;
                }
              
                const formDataToSend = new FormData();
                const emp_id = localStorage.getItem("emp_id");
              
                // Add metadata
                formDataToSend.append('title', formData.title);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('receiver', emp_id); // optional
              
                // Add documents (ensure names match backend)
                formDataToSend.append('adhaar_card', files.adhaarCard);
                formDataToSend.append('bonafide_certificate', files.bonafideCertificate);
                formDataToSend.append('college_id', files.collegeId);
                formDataToSend.append('resume', files.resume);
              
                try {
                  setLoading(true);
                  const token = localStorage.getItem("token");
                  const emp_id = localStorage.getItem("emp_id");
              
                  const response = await axios.post(
                    "http://localhost:8000/Sims/documents/",
                    formDataToSend,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Token ${token}`,
                        
                      }
                    }
                  );
              
                  showSnackbar('Documents uploaded successfully!', 'success');
                  if (onNext) onNext(response.data);
                } catch (error) {
                  console.error("Upload error:", error);
                  showSnackbar(error.response?.data?.detail || "Upload failed", 'error');
                } finally {
                  setLoading(false);
                }
              };
              
              
              const handleSnackbarClose = () => {
                setSnackbarOpen(false);
              };
              
              const handleOpenDialog = () => {
                setOpenDialog(true);
              };
              
              const handleCloseDialog = () => {
                setOpenDialog(false);
              };
              
              return (
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
                  }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: 56, 
                      height: 56,
                      mb: 2
                    }}>
                      <Description fontSize="large" />
                    </Avatar>
                    <Typography 
                      variant="h4" 
                      align="center" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'text.primary'
                      }}
                    >
                      Documents Upload
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                      Please upload the required documents below
                    </Typography>
                  </Box>
                
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PictureAsPdf color="primary" /> Upload Adhaar Card
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'adhaarCard')}
                            style={{ display: 'none' }}
                            id="upload-adhaar"
                          />
                          <label htmlFor="upload-adhaar">
                            <Tooltip title="Upload Adhaar Card">
                              <IconButton
                                color="primary"
                                component="span"
                              >
                                <CloudUpload />
                              </IconButton>
                            </Tooltip>
                          </label>
                          {files.adhaarCard && (
                            <LinearProgress 
                              variant="determinate" 
                              value={progress.adhaarCard} 
                              sx={{ width: '100%', ml: 2 }} 
                            />
                          )}
                        </Box>
                        <Divider sx={{ my: 3 }} />
                
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Description color="primary" /> Upload Bonafide Certificate
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'bonafideCertificate')}
                            style={{ display: 'none' }}
                            id="upload-bonafide"
                          />
                          <label htmlFor="upload-bonafide">
                            <Tooltip title="Upload Bonafide Certificate">
                              <IconButton
                                color="primary"
                                component="span"
                              >
                                <CloudUpload />
                              </IconButton>
                            </Tooltip>
                          </label>
                          {files.bonafideCertificate && (
                            <LinearProgress 
                              variant="determinate" 
                              value={progress.bonafideCertificate} 
                              sx={{ width: '100%', ml: 2 }} 
                            />
                          )}
                        </Box>
                        <Divider sx={{ my: 3 }} />
                
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PermIdentity color="primary" /> Upload College ID
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'collegeId')}
                            style={{ display: 'none' }}
                            id="upload-college-id"
                          />
                          <label htmlFor="upload-college-id">
                            <Tooltip title="Upload College ID">
                              <IconButton
                                color="primary"
                                component="span"
                              >
                                <CloudUpload />
                              </IconButton>
                            </Tooltip>
                          </label>
                          {files.collegeId && (
                            <LinearProgress 
                              variant="determinate" 
                              value={progress.collegeId} 
                              sx={{ width: '100%', ml: 2 }} 
                            />
                          )}
                        </Box>
                        <Divider sx={{ my: 3 }} />
                
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentInd color="primary" /> Upload Resume
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'resume')}
                            style={{ display: 'none' }}
                            id="upload-resume"
                          />
                          <label htmlFor="upload-resume">
                            <Tooltip title="Upload Resume">
                              <IconButton
                                color="primary"
                                component="span"
                              >
                                <CloudUpload />
                              </IconButton>
                            </Tooltip>
                          </label>
                          {files.resume && (
                            <LinearProgress 
                              variant="determinate" 
                              value={progress.resume} 
                              sx={{ width: '100%', ml: 2 }} 
                            />
                          )}
                        </Box>
                      </Box>
                    </Grid>
                
                    <Grid item xs={12} md={6}>
                      <Box>
                        {files.adhaarCard && (
                          <Card sx={{ mb: 3 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PictureAsPdf color="primary" /> {files.adhaarCard.name}
                              </Typography>
                              <IconButton onClick={() => handleDeleteFile('adhaarCard')}>
                                <Delete color="error" />
                              </IconButton>
                            </Box>
                          </Card>
                        )}
                
                        {files.bonafideCertificate && (
                          <Card sx={{ mb: 3 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Description color="primary" /> {files.bonafideCertificate.name}
                              </Typography>
                              <IconButton onClick={() => handleDeleteFile('bonafideCertificate')}>
                                <Delete color="error" />
                              </IconButton>
                            </Box>
                          </Card>
                        )}
                
                        {files.collegeId && (
                          <Card sx={{ mb: 3 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PermIdentity color="primary" /> {files.collegeId.name}
                              </Typography>
                              <IconButton onClick={() => handleDeleteFile('collegeId')}>
                                <Delete color="error" />
                              </IconButton>
                            </Box>
                          </Card>
                        )}
                
                        {files.resume && (
                          <Card sx={{ mb: 3 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssignmentInd color="primary" /> {files.resume.name}
                              </Typography>
                              <IconButton onClick={() => handleDeleteFile('resume')}>
                                <Delete color="error" />
                              </IconButton>
                            </Box>
                          </Card>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                
                  <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="I hereby agree to the terms and conditions as outlined by VDart."
                    />
                    <Tooltip title="View Terms and Conditions">
                      <IconButton onClick={handleOpenDialog}>
                        <Info color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        size="large"
                        startIcon={<BackIcon />}
                        onClick={onBack}
                      >
                        Previous
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveSubmit}
                        disabled={loading || !agreeToTerms}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save & Submit'}
                      </Button>
                    </Grid>
                  </Grid>
                
                  <Snackbar 
                    open={snackbarOpen} 
                    autoHideDuration={6000} 
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    key={snackbarKey}
                  >
                    <Alert 
                      onClose={handleSnackbarClose} 
                      severity={snackbarSeverity} 
                      sx={{ width: "100%" }}
                    >
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>
                      <Box display="flex" alignItems="center">
                        <VerifiedUser color="primary" sx={{ mr: 1 }} />
                        Terms and Conditions
                      </Box>
                    </DialogTitle>
                    <DialogContent>
                      <Typography>
                        By using this service, you agree to the terms and conditions outlined by VDart. Please read them carefully before proceeding.
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Paper>
              );
            };
            // ------------------end documents upload---------------------
            const ThankYouPage = ({ onRestart, onClose }) => {
              return (
                <Paper elevation={3} sx={{ 
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '70vh',
                  textAlign: 'center',
                  borderRadius: 4
                }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.light',
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4
                  }}>
                    <TaskAlt sx={{ fontSize: 60, color: 'primary.contrastText' }} />
                  </Box>
                  
                  <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    Registration Successful!
                  </Typography>
                  
                  <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                    <AdminPanelSettings sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                    Admin Registration Complete
                  </Typography>
                  
                  <Box sx={{ 
                    backgroundColor: 'background.default',
                    p: 4,
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: 600,
                    mb: 4
                  }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      The new user has been successfully registered in the system.
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      An email notification has been sent to the registered email address with login credentials.
                    </Typography>
                    
                    <Typography variant="body1">
                      You can now manage this user from the admin dashboard.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={onRestart}
                      sx={{
                        px: 4,
                      }}
                    >
                      Register Another User
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={onClose}
                      sx={{
                        px: 4,
                      }}
                    >
                      Return to Intern Lists
                    </Button>
                  </Box>
                </Paper>
              );
            };
            
            const MultiStepForm = ({ onClose, onComplete }) => {
              const [step, setStep] = useState(0);
              const [formData, setFormData] = useState({
                registerData: {},
                collegeData: {},
                companyData: {},
                documentsData: {}
              });
             
              const steps = [
                'User Registration',
                'College Information',
                'Company Details',
                'Documents Upload',
                'Complete'
              ];
            
              const handleNext = (data) => {
                const newFormData = { ...formData };
                if (step === 0) newFormData.registerData = data;
                if (step === 1) newFormData.collegeData = data;
                if (step === 2) newFormData.companyData = data;
                if (step === 3) newFormData.documentsData = data;
            
                setFormData(newFormData);
                setStep(step + 1);
              };
            
              const handleBack = () => {
                setStep(step - 1);
              };
            
              const handleSubmit = (data) => {
                handleNext(data);
                if (onComplete) {
                  onComplete();
                }
              };
            
              const handleRestart = () => {
                setStep(0);
                setFormData({
                  registerData: {},
                  collegeData: {},
                  companyData: {},
                  documentsData: {}
                });
              };
            
              const getStepContent = (stepIndex) => {
                switch (stepIndex) {
                  case 0:
                    return <RegisterPage 
                             onNext={handleNext} 
                             initialData={formData.registerData} 
                             isReturning={Object.keys(formData.registerData).length > 0}
                           />;
                  case 1:
                    return <CollegeInfoForm 
                             onBack={handleBack} 
                             onNext={handleNext} 
                             initialData={formData.collegeData} 
                           />;
                  case 2:
                    return <CompanyDetailsForm 
                             onBack={handleBack} 
                             onNext={handleNext} 
                             initialData={formData.companyData} 
                           />;
                  case 3:
                    return <DocumentsUpload 
                             onBack={handleBack} 
                             onNext={handleSubmit} 
                             initialData={formData.documentsData}
                             registerData={formData.registerData}
                           />;
                  case 4:
                    return <ThankYouPage onRestart={handleRestart} onClose={onClose} />;
                  default:
                    return null;
                }
              };
            
              return (
                <Container maxWidth="lg" sx={{ py: 4 }}>
                  {step < steps.length - 1 && (
                    <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
                      {steps.slice(0, -1).map((label, index) => (
                        <Step key={label}>
                          <StepLabel 
                            sx={{
                              '& .MuiStepLabel-label': {
                                fontWeight: 600,
                                color: step === index ? 'primary.main' : 'text.secondary'
                              }
                            }}
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  )}
            
                  {getStepContent(step)}
                </Container>
              );
            };
            
            export default InternLists;