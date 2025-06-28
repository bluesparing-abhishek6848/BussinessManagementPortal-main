import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../lib/ReusableTable";
import useDelete from "../../../Hooks/useDelete";
import { useMemo } from "react";
import { BranchColumns } from "./BranchCol";
import type { IBranch } from "./BranchTypes";
import { toast } from "react-toastify";

const BranchTable = () => {
  const navigate = useNavigate();

  const { deleteData } = useDelete("branches");
  const userJson = localStorage.getItem("user");
  const role = userJson ? JSON.parse(userJson).role : null;
  // ✅ FIXED: Call BranchColumns to get array of column definitions
  const columns = useMemo(() => BranchColumns(), []);

  const handleAdd = () => {
    if (role === "admin") {
      navigate("/admin/branch/add");
    } else if (role === "accountManager") {
      navigate("/account-manager/branch/add");
    } else {
      alert("Unauthorized role");
    }
  };

  const handleDelete = async (row: IBranch, refetch: () => void) => {
    try {
      await deleteData(row._id);
      refetch();
      toast.success("Branch deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleEdit = (row: IBranch) => {
    if (role === "admin") {
      navigate(`/admin/branch/edit/${row._id}`, { state: row });
    } else if (role === "accountManager") {
      navigate(`/account-manager/branch/edit/${row._id}`, { state: row });
    } else {
      alert("Unauthorized role");
    }
  };

  return (
    <ReusableTable<IBranch>
      subtitle="Dashboard"
      headLine="Branch Table"
      btnText="Add Branch"
      endpoint="branches"
      searchEndpoint="branches/search"
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default BranchTable;
