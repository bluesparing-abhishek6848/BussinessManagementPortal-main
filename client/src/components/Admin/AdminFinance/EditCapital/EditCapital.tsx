import { useLocation } from "react-router-dom";
import TableWrapper from "../../../../lib/TableWrapper";
import EditCapitalForm from "./EditCapitalForm";

const EditCapital = () => {
  const location = useLocation();
  const customerData = location.state;
  
  return (
    <TableWrapper headLine="Edit Capital Form">
      <EditCapitalForm defaultValues={customerData}/>
    </TableWrapper>
  );
};

export default EditCapital;
