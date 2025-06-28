import { useLocation } from "react-router-dom";
import TableWrapper from "../../../../lib/TableWrapper";
import EditCustomerFrom from "./EditCustomerFrom";

const EditCustomer = () => {
  const location = useLocation();
  const customerData = location.state;

  return (
    <TableWrapper headLine="Edit Customer Form">
      <EditCustomerFrom defaultValues={customerData} />
    </TableWrapper>
  );
};

export default EditCustomer;
