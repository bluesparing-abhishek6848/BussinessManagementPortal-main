
  import { useNavigate } from "react-router-dom";

  import { useMemo } from "react";


  import useDelete from "../../../Hooks/useDelete";

  import ReusableTable from "../../../lib/ReusableTable";
  import { LoanColumns } from "./LoanCol";
  import type { ILoan } from "./LoanTypes";

import { toast } from "react-toastify";

  const LoanTable = () => {
     
    const navigate = useNavigate();
    const { deleteData } = useDelete("loans");

    const columns = useMemo(() => LoanColumns, []);

    const handleAdd = () => {
      navigate("add");
    };

    const handleEdit = (row: ILoan) => {
      navigate(`edit/${row._id}`, { state: row });
    };

    const onView = (row:ILoan)=>{
      navigate(`view/${row._id}`);
    }
   
    const handleDelete = async (row: ILoan, refetch: () => void) => {
      try {
        await deleteData(row._id||"");
        refetch(); 
        toast.success("Loan deleted successfully!");
      
       
      } catch (error:any) {
        toast.error(error.message || "An unexpected error occurred.");
      }
    };

    return (
      <ReusableTable<ILoan>
        subtitle="Dashboard"
        headLine="Loan Table"
        btnText="Add Loan"
        endpoint="loans"
        searchEndpoint="loans/search"
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={onView}
      />
    );
  };




  export default LoanTable
