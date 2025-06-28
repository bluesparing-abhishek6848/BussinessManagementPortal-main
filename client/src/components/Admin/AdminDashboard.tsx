import { useEffect, useMemo, useState } from "react";
import useGet from "../../Hooks/useGet";
import type { IBranchDropDown } from "../Common/Branch/BranchTypes";
import type { GetResData } from "../Common/Customer/CustomerTypes";
import type { AdminDashboardData, AdminDashboardResponse } from "./IAdmin";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { mapUserRoute } from "../../Constant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardSkeleton from "../SkeletonPage/DashboardSkelatan";

const AdminDashboard = () => {
  const { data: branchList } =
    useGet<GetResData<IBranchDropDown>>("branches/drop-down");

  const {
    data: adminDashboardData,
    fetchData,
    isLoading,
    error,
  } = useGet<AdminDashboardResponse>("");

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const branches = useMemo(() => branchList?.data ?? [], [branchList]);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]._id);
    }
  }, [branches]);

  const handleBranchChange = (event: SelectChangeEvent<string>) => {
    setSelectedBranch(event.target.value);
  };

  useEffect(() => {
    if (!selectedBranch) return;
  
    const controller = new AbortController();
    const runFetch = async () => {
      try {
        await fetchData(
          controller.signal,
          `dashboard/admin?branchId=${selectedBranch}`
        );
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Fetch failed:", error);
        }
      }
    };
  
    runFetch();
  
    return () => controller.abort();
  }, [selectedBranch]);
  

  if (error) {
    return toast.error(error);
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="branch-select-label">Select Branch</InputLabel>
        <Select
          labelId="branch-select-label"
          id="branch-select"
          value={selectedBranch}
          label="Select Branch"
          onChange={handleBranchChange}
        >
          {branchList?.data.map((branch) => (
            <MenuItem key={branch._id} value={branch._id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {adminDashboardData && (
        <DashboardUI
          finance={adminDashboardData.data.finance}
          todayCollectionSummary={
            adminDashboardData.data.todayCollectionSummary
          }
          loansByStatus={adminDashboardData.data.loansByStatus}
          customersCount={adminDashboardData.data.customersCount}
          selectedBranch={selectedBranch} // Pass branch data
        />
      )}
    </div>
  );
};

export default AdminDashboard;

interface DashboardUIProps extends AdminDashboardData {
  selectedBranch?: string;
}

export const DashboardUI: React.FC<DashboardUIProps> = ({
  finance,
  todayCollectionSummary,
  loansByStatus,
  customersCount,
  selectedBranch,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = mapUserRoute(user?.role || "");
  const navigate = useNavigate();
  const handleLoanSummary = () => {
    if (userRole === "admin") {
      navigate("/admin/loan-summary");
    }
    else if (userRole === "branch-manager") {
    navigate("/branch-manager/loan");
  }
  };

// ...existing code...
const handleEMISummary = () => {
  if (userRole === "branch-manager") {
    navigate("/branch-manager/customers", { state: { branchId: selectedBranch } });
  } else if (userRole === "admin") {
    navigate("/admin/customers", { state: { branchId: selectedBranch } });
  }
};
// ...existing code...

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {user?.role === "admin" ? "Admin" : "BranchManager"} Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Finance Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Finance Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>Capital: ₹{finance?.capital || 0}</Typography>
              <Typography>
                Distributed: ₹{finance?.distributedAmount || 0}
              </Typography>
              <Typography>
                Remaining: ₹{finance?.remainingAmount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Collection Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%", bgcolor: "#fce4ec" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today’s Collection Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>Paid: ₹{todayCollectionSummary.Paid}</Typography>
              <Typography>UnPaid: ₹{todayCollectionSummary.UnPaid}</Typography>
              <Typography>
                Advance: ₹{todayCollectionSummary.Advance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            onClick={handleLoanSummary}
            sx={{
              height: "100%",
              bgcolor: "#e8f5e9",
              cursor:
                user?.role?.toLowerCase() === "admin"
                  ? "pointer"
                  : "default",
              "&:hover": {
                bgcolor:
                  user?.role?.toLowerCase() === "admin"
                    ? "#EBFFD8"
                    : "#e8f5e9",
              },
            }}
            className={`${user?.role === "admin" ? "cursor-pointer" : ""}`}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loan Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {Object.entries(loansByStatus).map(([status, count]) => (
                <Typography key={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Count */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            onClick={handleEMISummary}
            sx={{
              height: "100%",
              bgcolor: "#fff3e0",
              cursor:
                user?.role?.toLowerCase() === "branchmanager"
                  ? "pointer"
                  : "default",
              "&:hover": {
                bgcolor:
                  user?.role?.toLowerCase() === "branchmanager"
                    ? "#FAFFCA"
                    : "#fff3e0",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customers Count
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>Total Customers: {customersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
