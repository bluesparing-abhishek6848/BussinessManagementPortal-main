import { Button, Box } from "@mui/material";
import { useMemo } from "react";
// import useGet from "../../../Hooks/useGet";
// import type { IBranchDropDown } from "../../Common/Branch/BranchTypes";
// import type { GetResData } from "../../Common/Customer/CustomerTypes";

// import type { SelectChangeEvent } from "@mui/material/Select";

import type { IAdvance } from "../../Common/Advance/AdvanceTypes.tsx"; // Make sure this type exists
import ReusableTable from "../../../lib/ReusableTable";
import { AdvanceColumns } from "../../Common/Advance/AdvanceCol.tsx"; // Make sure this columns file exists
import { useNavigate } from "react-router-dom";

const AdvanceSummary = () => {
  const columns = useMemo(() => AdvanceColumns, []);
  const navigate = useNavigate();
 

  const onView = (row: IAdvance) => {
    navigate(`view/${row._id}`);
  };



  const handleAddAdvance = () => {
    navigate("/admin/advance/add");
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleAddAdvance}>
          Add Advance
        </Button>
      </Box>
      {/* {!branchList?.data ? (
        <DropDownSkeleton height={56} width="100%" />
      ) : (
        <FormControl fullWidth>
          <InputLabel id="branch-select-label">Select Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            id="branch-select"
            // value={selectedBranch}
            label="Select Branch"
            // onChange={handleBranchChange}
          >
            {branchList.data.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )} */}

      <ReusableTable<IAdvance>
        // key={selectedBranch}
        subtitle="Dashboard"
        headLine="Advance Table"
        endpoint={`advances?branch`}
        searchEndpoint={`advances/search?branch`}
        onView={onView}
        columns={columns}
      />
    </div>
  );
};

export default AdvanceSummary;
