import { useNavigate } from "react-router-dom";
// import { useEffect, useMemo, useState } from "react";
import useDelete from "../../../Hooks/useDelete";
import ReusableTable from "../../../lib/ReusableTable";
import { AttendanceColumns } from "./AttendanceCol" // You need to create this
import type { IAttendance } from "./AttendanceTypes"; // You need to create this
// import type { GetResData } from "../../Common/Customer/CustomerTypes";
// import useGet from "../../../Hooks/useGet";

// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import type { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "react-toastify";
// import DropDownSkeleton from "../../SkeletonPage/DropDownSkeleton";
// import TableSkeleton from "../../SkeletonPage/TableSkeleton";

const AttendanceTable = () => {
  const navigate = useNavigate();
  const { deleteData } = useDelete("attendance");




  const handleAdd = () => {
    navigate("add");
  };

  const handleEdit = (row: IAttendance) => {
    navigate(`edit`, { state: row });
  };

  const handleDelete = async (row: IAttendance, refetch: () => void) => {
    try {
      await deleteData(row._id);
      refetch();
      toast.success("Attendance deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };


  return (
    <>
   
        <ReusableTable<IAttendance>
          // key={selectedBranch}
          subtitle="Dashboard"
          headLine="Attendance Table"
          btnText="Add Attendance"
          endpoint={`attendance?branch`}
          searchEndpoint={`attendance/search?branch`}
          columns={AttendanceColumns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
    
    </>
  );
};

export default AttendanceTable;