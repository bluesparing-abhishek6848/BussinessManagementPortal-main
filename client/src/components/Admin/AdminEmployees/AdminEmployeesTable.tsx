import { makeSeoUrl } from "../../../Constant";
import UsersTable from "../../Common/Employee/UsersTable";
import Seo from "../../Seo/Seo";

const AdminEmployeesTable = () => {
  return (
    <>
      <Seo
        title="Manage Employees | VEW"
        description="Admin panel to manage all platform users and roles."
        url={makeSeoUrl("admin/employees")}
      />

      <UsersTable />
    </>
  );
};

export default AdminEmployeesTable;
