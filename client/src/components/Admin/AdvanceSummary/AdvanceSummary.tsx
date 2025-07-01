import { Button, Box } from "@mui/material";
import { useMemo } from "react";
import type { IAdvance } from "../../Common/Advance/AdvanceTypes.tsx";
import ReusableTable from "../../../lib/ReusableTable";
import { AdvanceColumns } from "../../Common/Advance/AdvanceCol.tsx";
import { useNavigate } from "react-router-dom";
import useDelete from "../../../Hooks/useDelete";
import { toast } from "react-toastify";

const AdvanceSummary = () => {
  const columns = useMemo(() => AdvanceColumns, []);
  const navigate = useNavigate();
  const { deleteData } = useDelete("advances");

  const onView = (row: IAdvance) => {
    navigate(`view/${row._id}`);
  };

  const handleAddAdvance = () => {
    navigate("/admin/advance/add");
  };

  // Add this handler for delete
  const handleDelete = async (row: IAdvance, refetch: () => void) => {
    try {
      await deleteData(row._id);
      toast.success("Advance deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleAddAdvance}>
          Add Advance
        </Button>
      </Box>
      <ReusableTable<IAdvance>
        subtitle="Dashboard"
        headLine="Advance Table"
        endpoint={`advances`}
        searchEndpoint={`advances/search?branch`}
        onDelete={handleDelete} // <-- Add this line
        // onView={onView}
        columns={columns}
      />
    </div>
  );
};

export default AdvanceSummary;