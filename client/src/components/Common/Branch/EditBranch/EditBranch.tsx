import { useLocation } from "react-router-dom";
import TableWrapper from "../../../../lib/TableWrapper"
import EditBranchForm from "./EditBranchForm"

const EditBranch = () => {
  const location = useLocation();
  const branchData = location.state;
  return (
    <TableWrapper headLine='Edit Branch'>
    <EditBranchForm defaultValues={branchData}/>
   </TableWrapper>
  )
}

export default EditBranch
