import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    IconButton,
    Chip,
    Pagination,
    Paper,
    InputAdornment,
    Modal,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    FilterAlt as FilterAltIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';

const AssetManagement = () => {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [currentAsset, setCurrentAsset] = useState(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [availableInterns, setAvailableInterns] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedIntern, setSelectedIntern] = useState('');
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [selectedAssetId, setSelectedAssetId] = useState('');

    const rowsPerPage = 10;

    useEffect(() => {
        fetchAssets();
    }, []);

    
    const fetchAssets = async () => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            
            // Fetch assets
            const assetResponse = await fetch("http://localhost:8000/Sims/assert-stock/", {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (!assetResponse.ok) throw new Error("Failed to fetch asset data");
            const assetsData = await assetResponse.json();
    
            // Fetch users
            const userResponse = await fetch("http://localhost:8000/Sims/user-data/", {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (!userResponse.ok) throw new Error("Failed to fetch user data");
            const usersData = await userResponse.json();
            setUsers(usersData);

            const formattedAssets = assetsData.map(asset => {
                const isAssigned = !asset.inhand;
                let assignedToDisplay = 'Unassigned';
            
                if (isAssigned) {
                    // If user field is valid and exists in usersData
                    const assignedUser = usersData.find(user => user.id === asset.user);
                    if (assignedUser && assignedUser.usernam) {
                        assignedToDisplay = `${assignedUser.username} (ID: ${assignedUser.temp?.emp_id || asset.emp_id})`;
                    } else if (asset.emp_id) {
                        // Fallback to just emp_id if user data is missing
                        assignedToDisplay = asset.emp_id;
                    }
                }
            
                return {
                    id: asset.assert_id,
                    asset: asset.assert_model,
                    type: asset.allocated_type,
                    assignedTo: assignedToDisplay,
                    status: isAssigned ? "Assigned" : "Available",
                    createdDate: asset.created_date,
                    updatedDate: asset.updated_date,
                    inhand: asset.inhand,
                    configuration: asset.configuration,
                    department: asset.department,
                    empId: asset.emp_id,
                    userId: asset.user
                };
            });
                
            setAssets(formattedAssets);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleAssetClick = async (assetId) => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch("http://localhost:8000/Sims/asserthistory/", {
            headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "application/json"
            }
          });
      
          if (!response.ok) throw new Error("Failed to fetch asset history");
      
          const allHistory = await response.json();
          const filteredHistory = allHistory.filter(entry => entry.asset === assetId);
      
          setSelectedAssetId(assetId);
          setHistoryData(filteredHistory);
          setHistoryModalOpen(true);
        } catch (error) {
          console.error("Error fetching asset history:", error);
        }
      };
      
   // Add this function to fetch departments from the backend
const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://localhost:8000/Sims/departments/", {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) throw new Error("Failed to fetch departments");
        const data = await response.json();
        setDepartments(data);
    } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
    }
};

// Update the useEffect to call fetchDepartments
useEffect(() => {
    fetchAssets();
    fetchDepartments();
}, []);

// Update the fetchAvailableInterns function to correctly use the API endpoint
const fetchAvailableInterns = (department) => {
    const available = assets
        .filter(asset => 
            asset.inhand &&  // Changed to filter inhand: true
            asset.department === department && 
            asset.empId
        )
        .map(asset => asset.empId);

    const uniqueEmpIds = [...new Set(available)];
    setAvailableInterns(uniqueEmpIds);
};

    const handleDepartmentChange = (e) => {
        const department = e.target.value;
        setSelectedDepartment(department);
        setSelectedIntern(''); // Reset intern selection when department changes
        if (department) {
            fetchAvailableInterns(department);
        } else {
            setAvailableInterns([]);
        }
    };

    const handleInternChange = (e) => {
        setSelectedIntern(e.target.value);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleSelectAsset = (assetId) => {
        setSelectedAssets(prev =>
            prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = paginatedAssets.map((asset) => asset.id);
            setSelectedAssets(newSelected);
        } else {
            setSelectedAssets([]);
        }
    };

    const fetchAssetHistory = async (assetId) => {
        const token = localStorage.getItem("token");
      
        try {
          const response = await fetch("http://localhost:8000/Sims/asserthistory/", {
            headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "application/json"
            }
          });
      
          if (!response.ok) throw new Error("Failed to fetch asset history");
      
          const data = await response.json();
          const filtered = data.filter(entry => entry.asset === assetId);
      
          setHistoryData(filtered);
          setSelectedAssetId(assetId);
          setHistoryModalOpen(true);
        } catch (error) {
          console.error("Error fetching asset history:", error);
          alert("Failed to fetch asset history");
        }
      };
      
    const handleBulkDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const deletePromises = selectedAssets.map(id => 
                fetch(`http://localhost:8000/Sims/assert-stock/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Token ${token}`,
                    }
                })
            );
            
            await Promise.all(deletePromises);
            // Refresh the asset list
            await fetchAssets();
            setSelectedAssets([]);
        } catch (error) {
            console.error("Error deleting assets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const getFilteredAssets = () => {
        return assets.filter(asset => {
            const searchMatch = asset.asset.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              asset.id.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = !statusFilter || asset.status === statusFilter;
            const typeMatch = !typeFilter || asset.type === typeFilter;

            return searchMatch && statusMatch && typeMatch;
        });
    };

    const filteredAssets = getFilteredAssets();
    const paginatedAssets = filteredAssets.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleOpenModal = (asset = null) => {
        setCurrentAsset(asset);
        const department = asset?.department || '';
        setSelectedDepartment(department);
        setSelectedIntern(asset?.empId || '');
        
        if (department) {
            fetchAvailableInterns(department);
        } else {
            setAvailableInterns([]);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedDepartment('');
        setSelectedIntern('');
        setAvailableInterns([]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
      
        const formData = new FormData(event.currentTarget);
      
        const assetData = {
          assert_id: formData.get('assetId'),
          assert_model: formData.get('assetName'),
          allocated_type: formData.get('assetType'),
          configuration: formData.get('configuration'),
          department: formData.get('department'),
          emp_id: formData.get('empId') || null,
          inhand: !formData.get('empId') // false if assigned
        };
      
        try {
          const response = await fetch("http://localhost:8000/Sims/assert-stock/", {
            method: 'POST',
            headers: {
              "Authorization": `Token ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(assetData)
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create asset");
          }
      
          await fetchAssets(); // refresh asset list
          handleCloseModal();  // close modal
        } catch (error) {
          console.error("Error saving asset:", error);
          alert(`Error: ${error.message}`);
        }
      };
      
    
    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "success"; 
            case "Assigned":
                return "warning"; 
            case "Maintenance":
                return "error"; 
            default:
                return "default";
        }
    };

    const renderAssetList = () => (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Asset Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                        
                    >
                        Add Asset
                    </Button>
                    
                </Box>

                <Accordion expanded={expanded} onChange={handleExpandClick} sx={{ mb: 3 }}>
                    <AccordionSummary expandIcon={<FilterAltIcon />}>
                        <Box display="flex" alignItems="center">
                            <FilterAltIcon color="action" sx={{ mr: 1 }} />
                            <Typography>Filters</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Search assets..."
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        label="Status"
                                    >
                                        <MenuItem value="">All Statuses</MenuItem>
                                        <MenuItem value="Assigned">Assigned</MenuItem>
                                        <MenuItem value="Available">Available</MenuItem>
                                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        label="Type"
                                    >
                                        <MenuItem value="">All Types</MenuItem>
                                        <MenuItem value="Laptop">Laptop</MenuItem>
                                        <MenuItem value="Desktop">Desktop</MenuItem>
                                        <MenuItem value="Mouse">Mouse</MenuItem>
                                        <MenuItem value="Tablet">Tablet</MenuItem>
                                        <MenuItem value="Charger">Charger</MenuItem>
                                        <MenuItem value="Headphone">Headphone</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end" gap={1}>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<FilterListIcon />}
                                        onClick={() => {
                                            setStatusFilter("");
                                            setTypeFilter("");
                                            setSearchTerm("");
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Modal open={historyModalOpen} onClose={() => setHistoryModalOpen(false)}>
  <Box sx={{
    width: '80%',
    maxHeight: '80vh',
    overflowY: 'auto',
    margin: '5% auto',
    backgroundColor: 'white',
    p: 4,
    borderRadius: 2,
    boxShadow: 24
  }}>
    <Typography variant="h6" mb={2}>
      Asset History - {selectedAssetId}
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Actor</TableCell>
          <TableCell>Intern ID</TableCell>
          <TableCell>Event Type</TableCell>
          <TableCell>Timestamp</TableCell>
          <TableCell>Asset</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {historyData.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.actor}</TableCell>
            <TableCell>{entry.emp_id || '—'}</TableCell>
            <TableCell>{entry.event_type}</TableCell>
            <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
            <TableCell>{entry.asset}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
</Modal>

                       
                {selectedAssets.length > 0 && (
                    <Box mb={2} display="flex" alignItems="center" gap={2}>
                        <Typography color="textSecondary">
                            {selectedAssets.length} selected
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleBulkDelete}
                            size="small"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Delete Selected'}
                        </Button>
                    </Box>
                )}

                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'background.default' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selectedAssets.length > 0 && selectedAssets.length < filteredAssets.length
                                        }
                                        checked={
                                            filteredAssets.length > 0 && selectedAssets.length === filteredAssets.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Asset ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Asset Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Configuration</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Assigned To</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedAssets.length > 0 ? (
                                paginatedAssets.map((asset) => (
                                    <TableRow key={asset.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedAssets.includes(asset.id)}
                                                onChange={() => handleSelectAsset(asset.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
  <Button
    variant="text"
    onClick={() => fetchAssetHistory(asset.id)}
    sx={{ textTransform: 'none', padding: 0 }}
  >
    {asset.id}
  </Button>
</TableCell>

                                        <TableCell>{asset.asset}</TableCell>
                                        <TableCell>{asset.type}</TableCell>
                                        <TableCell>{asset.configuration}</TableCell>
                                        <TableCell>{asset.assignedTo || 'Unassigned'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={asset.status}
                                                color={getStatusColor(asset.status)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenModal(asset)} size="small">
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <Box textAlign="center">
                                            <SearchIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="body1" color="textSecondary">
                                                No assets found matching your criteria
                                            </Typography>
                                            <Button
                                                variant="text"
                                                onClick={() => {
                                                    setStatusFilter("");
                                                    setTypeFilter("");
                                                    setSearchTerm("");
                                                }}
                                                sx={{ mt: 1 }}
                                            >
                                                Clear all filters
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                    <Typography color="textSecondary">
                        Showing {paginatedAssets.length} of {filteredAssets.length} assets
                    </Typography>
                    <Pagination
                        count={Math.ceil(filteredAssets.length / rowsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            </CardContent>
        </Card>
    );

    const renderModal = () => (
        <Modal open={openModal} onClose={handleCloseModal}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: '95%', sm: 600 },
                    maxWidth: 600,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
            >
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                    {currentAsset ? "Edit Asset" : "Add New Asset"}
                </Typography>
    
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* First row: Asset ID and Asset Name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Asset ID"
                                name="assetId"
                                defaultValue={currentAsset?.id || ''}
                                required
                                size="small"
                                disabled={!!currentAsset}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Asset Name"
                                name="assetName"
                                defaultValue={currentAsset?.asset || ''}
                                required
                                size="small"
                            />
                        </Grid>
                        
                        {/* Second row: Type and Department */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" required>
                                <InputLabel>Asset Type</InputLabel>
                                <Select
                                    label="Asset Type"
                                    name="assetType"
                                    defaultValue={currentAsset?.type || ""}
                                >
                                    <MenuItem value="Laptop">Laptop</MenuItem>
                                    <MenuItem value="Desktop">Desktop</MenuItem>
                                    <MenuItem value="Mouse">Mouse</MenuItem>
                                    <MenuItem value="Tablet">Tablet</MenuItem>
                                    <MenuItem value="Charger">Charger</MenuItem>
                                    <MenuItem value="Headphone">Headphone</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Department</InputLabel>
                                <Select
                                    label="Department"
                                    name="department"
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                >
                                    <MenuItem value="">Not specified</MenuItem>
                                    {departments.map(dept => (
                                        <MenuItem key={dept.department} value={dept.department}>
                                            {dept.department}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        {/* Third row: Configuration (full width) */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Configuration"
                                name="configuration"
                                defaultValue={currentAsset?.configuration || ''}
                                required
                                size="small"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        
                        {/* Fourth row: Assign to Intern (full width) */}
                        <Grid item xs={12}>
                        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
    <InputLabel>Assign to Intern</InputLabel>
    <Select
        name="empId"
        value={selectedIntern}
        onChange={handleInternChange}
        label="Assign to Intern"
    >
        <MenuItem value="">None</MenuItem>
        {availableInterns.map((empId) => (
            <MenuItem key={empId} value={empId}>
                {empId}
            </MenuItem>
        ))}
    </Select>
</FormControl>




                        </Grid>
                    </Grid>
    
                    {/* Action buttons */}
                    <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                        <Button 
                            onClick={handleCloseModal} 
                            variant="outlined" 
                            disabled={loading}
                        >
                            CANCEL
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Processing...
                                </>
                            ) : currentAsset ? (
                                "UPDATE ASSET"
                            ) : (
                                "ADD ASSET"
                            )}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
    
    return (
        <div>
            {renderAssetList()}
            {renderModal()}
        </div>
    );
};

export default AssetManagement;