import { makeSeoUrl } from "../../Constant";
import Customer from "../Common/Customer/Customer";
import Seo from "../Seo/Seo";

const AdminCustomer = () => {
  return (
    <>
      <Seo
        title="Customers | Admin | Aapka Future"
        description="Manage all customers in Aapka Future loan system as Admin."
        url={makeSeoUrl('admin/customers')}
      />
      <Customer />
    </>
  );
};

export default AdminCustomer;