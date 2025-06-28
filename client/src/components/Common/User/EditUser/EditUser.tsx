import { useLocation } from "react-router-dom";
import TableWrapper from "../../../../lib/TableWrapper"
import EditUserForm from "./EditUserForm"

const EditUser = () => {
  const location = useLocation();
  const userData = location.state;
    return (
        <TableWrapper headLine="Edit User Form">
          <EditUserForm defaultValues = {userData}/>
        </TableWrapper>
    )
}

export default EditUser
