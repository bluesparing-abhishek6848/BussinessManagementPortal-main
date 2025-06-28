import { useNavigate } from "react-router-dom";
import useDelete from "../../../Hooks/useDelete";
import type { IUsers } from "./UserTypes";
import { useMemo } from "react";
import { UserColumns } from "./UsersCol";
import ReusableTable from "../../../lib/ReusableTable";
import { toast } from "react-toastify";
import type { RootState } from "../../../store";
import { useSelector } from "react-redux";
import type { IBranch } from "../Branch/BranchTypes";
// import ConfirmDialog from "../../../lib/ConfirmDelete";

const UsersTable = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // const [confirmOpen, setConfirmOpen] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [refetchFunc, setRefetchFunc] = useState<() => void>(() => () => {});

  const branch = user?.branch as IBranch;
  const { deleteData } = useDelete("users");
  const columns = useMemo(() => UserColumns, []);

  const userJson = localStorage.getItem("user");
  const role = userJson ? JSON.parse(userJson).role : null;

  const handleAdd = () => {
    if (role === "admin") {
      navigate("/admin/users/add");
    } else if (role === "branchManager") {
      navigate("/branch-manager/users/add");
    } else {
      alert("Unauthorized role");
    }
  };

  // const confirmDelete = (row: IUsers, refetch: () => void) => {
  //   setSelectedUser(row);
  //   setRefetchFunc(() => refetch);
  //   setConfirmOpen(true);
  // };

  // const executeDelete = async () => {
  //   if (!selectedUser) return;
  //   setLoading(true);
  //   try {
  //     await deleteData(selectedUser._id);
  //     toast.success("User deleted successfully!");
  //     refetchFunc();
  //   } catch (error: any) {
  //     toast.error(error.message || "An unexpected error occurred.");
  //   } finally {
  //     setLoading(false);
  //     setConfirmOpen(false);
  //     setSelectedUser(null);
  //   }
  // };

  const handleDelete = async (row: IUsers, refetch: () => void) => {
    try {
      await deleteData(row._id);
      refetch();
      toast.success("User deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleEdit = (row: IUsers) => {
    if (role === "admin") {
      navigate(`/admin/users/edit/${row._id}`, { state: row });
    } else if (role === "branchManager") {
      navigate(`/branch-manager/users/edit/${row._id}`, { state: row });
    } else {
      alert("Unauthorized role");
    }
  };

  const makeEndPoints = () => {
   
      return "employees";
  };
  const makeSearchEndpoints = () => {
    if (user?.role === "admin") {
      return "users/search?";
    } else {
      return `users/search?branch=${branch?._id}`;
    }
  };
  return (
    <>
      <ReusableTable<IUsers>
        subtitle="Dashboard"
        headLine="Employees Table"
        btnText="Add Employee"
        endpoint={makeEndPoints()}
        searchEndpoint={makeSearchEndpoints()}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this user?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeDelete}
        loading={loading}
      /> */}
    </>
  );
};

export default UsersTable;
