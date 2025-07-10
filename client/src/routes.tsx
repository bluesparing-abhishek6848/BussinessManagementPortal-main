import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminCustomer from "./components/Admin/AdminCustomer";
import AddAdvance from "./components/Common/Loan/AddLoan/AddAdvance";
import path from "path";
import FinanceTable from "./components/Finance/FinanceTable";
import AddFinanceForm from "./components/Finance/AddFinanceForm";

const ManageTransaction = lazy(
  () => import("./components/Common/Loan/ManageTransction/ManageTransaction")
);
const AuthSwitcher = lazy(() => import("./pages/AuthSwitcher/AuthSwitcher"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
// const BranchManager = lazy(() => import("./pages/BranchManger"));
// const BMDashboard = lazy(
//   () => import("./components/BranchManager/BMDashboard")
// );
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const UnAuthorized = lazy(() => import("./pages/UnAuthorized"));
const LoanTable = lazy(() => import("./components/Common/Loan/LoanTable"));
// const BMCustomer = lazy(() => import("./components/BranchManager/BMCustomer"));
// const AddCustomer = lazy(
//   () => import("./components/Common/Customer/AddCustomer/AddCustomer")
// );
// const EditCustomer = lazy(
//   () => import("./components/Common/Customer/EditCustomer/EditCustomer")
// );
// const BMLoans = lazy(() => import("./components/BranchManager/BMLoans"));
// const AddLoan = lazy(() => import("./components/Common/Loan/AddLoan/AddLoan"));
// const EditLoan = lazy(
//   () => import("./components/Common/Loan/EditLoan/EditLoan")
// );
const AdminUsersTable = lazy(
  () => import("./components/Admin/AdminEmployees/AdminEmployeesTable")
);
const AdminAddUser = lazy(
  () => import("./components/Admin/AdminEmployees/AdminAddEmployees")
);
const AdminEditUser = lazy(
  () => import("./components/Admin/AdminEmployees/AdminEditEmployees")
);
const CapitalTable = lazy(
  () => import("./components/Admin/AdminFinance/AttendanceTable")
);
const AddCapital = lazy(
  () => import("./components/Admin/AdminFinance/AddCapital/AddAttendance")
);
// const AddUser = lazy(() => import("./components/Common/User/AddUser/AddUser"));
// const EditUser = lazy(
//   () => import("./components/Common/User/EditUser/EditUser")
// );
// const BMUsers = lazy(() => import("./components/BranchManager/BMUsers"));
// const CollectionManager = lazy(() => import("./pages/CollectionManager"));
// const CollectionDashboard = lazy(
//   () => import("./components/CollectionManager/CollectionDashboard")
// );
// const ViewCustomer = lazy(
//   () => import("./components/Common/Customer/ViewCustomer/ViewCustomer")
// );

const Profile = lazy(() => import("./pages/Profile"));
const SignUpForm = lazy(() => import("./pages/AuthSwitcher/SignUpForm"));
const AdminOrdersTable = lazy(
  () => import("./components/Admin/AdminOrder/AdminOrderTable")
);
const AdminAddOrderForm = lazy(
  () => import("./components/Admin/AdminOrder/AdminAddBranch")
);
const AdminEditBranchForm = lazy(
  () => import("./components/Admin/AdminOrder/AdminEditBranchForm")
);
const EditCapital = lazy(
  () => import("./components/Admin/AdminFinance/EditCapital/EditCapital")
);
// const TodayCollection = lazy(
//   () => import("./components/BranchManager/TodayCollection")
// );
// const AccountDashboard = lazy(
//   () => import("./components/Accountant/AccountDashboard")
// );
// const AccountManager = lazy(() => import("./pages/AccountManager"));
const AdvanceSummary
 = lazy(
  () => import("./components/Admin/AdvanceSummary/AdvanceSummary")
);

const routeConfig = [
  {
    path: "/admin/login",
    element: <SignUpForm />,
  },

  {
    path: "/",
    element: <AuthSwitcher />,
  },

  {
    path: "*",
    element: <UnAuthorized />,
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <Admin />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "employees", element: <AdminUsersTable /> },
          { path: "customers", element: <AdminCustomer /> },
          { path: "users/add", element: <AdminAddUser /> },
          { path: "users/edit/:id", element: <AdminEditUser /> },
          { path: "attendance", element: <CapitalTable /> },
          { path: "attendance/add", element: <AddCapital /> },
          { path: "finance/edit", element: <EditCapital /> },
          { path: "loan-table", element: <LoanTable /> },
          { path: "Orders", element: <AdminOrdersTable /> },
          { path: "orders/add", element: <AdminAddOrderForm /> },
          { path: "branch/edit/:id", element: <AdminEditBranchForm /> },
          { path: "advance", element: <AdvanceSummary/> },
           { path: "advance/add", element: <AddAdvance /> },
          { path: "loan-summary/view/:id", element: <ManageTransaction /> },
          { path: "profile", element: <Profile /> },
           {path: "finance", element:< FinanceTable/>},
           {path: "finance/add", element:< AddFinanceForm/>},
        ],
      },
    ],
  },
  // {
  //   element: <ProtectedRoute allowedRoles={["branch-manager"]} />,
  //   children: [
  //     {
  //       path: "/branch-manager",
  //       element: <BranchManager />,
  //       children: [
  //         { index: true, element: <Navigate to="dashboard" replace /> },
  //         { path: "dashboard", element: <BMDashboard /> },
  //         { path: "customers", element: <BMCustomer /> },
  //         { path: "customers/add", element: <AddCustomer /> },
  //         { path: "customers/edit", element: <EditCustomer /> },
  //         { path: "customers/view", element: <ViewCustomer /> },
  //         { path: "users", element: <BMUsers /> },
  //         { path: "users/add", element: <AddUser /> },
  //         { path: "users/edit/:id", element: <EditUser /> },
  //         { path: "loan", element: <BMLoans /> },
         
  //         { path: "loan/edit/:id", element: <EditLoan /> },
  //         { path: "loan/view/:id", element: <ManageTransaction /> },
  //         { path: "profile", element: <Profile /> },
  //         { path: "today-collection", element: <TodayCollection /> },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   element: <ProtectedRoute allowedRoles={["collection-manager"]} />,
  //   children: [
  //     {
  //       path: "/collection-manager",
  //       element: <CollectionManager />,
  //       children: [
  //         { index: true, element: <Navigate to="dashboard" replace /> },
  //         { path: "dashboard", element: <CollectionDashboard /> },
  //         { path: "profile", element: <Profile /> },
  //         { path: "today-collection", element: <TodayCollection /> },
  //         { path: "loan-summary", element: <BMLoans /> },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   element: <ProtectedRoute allowedRoles={["account-manager"]} />,
  //   children: [
  //     {
  //       path: "/account-manager",
  //       element: <AccountManager />,
  //       children: [
  //         { index: true, element: <Navigate to="dashboard" replace /> },
  //         // { path: "dashboard", element: <AccountDashboard /> },
  //         { path: "branch", element: <AdminBranchTable /> },
  //         { path: "branch/add", element: <AdminAddBranchForm /> },
  //         { path: "branch/edit/:id", element: <AdminEditBranchForm /> },
  //         { path: "loan-summary", element: <LoadSummaryViaBranch /> },
  //         { path: "loan-summary/view/:id", element: <ManageTransaction /> },
  //         { path: "finance", element: <CapitalTable /> },
  //         { path: "finance/add", element: <AddCapital /> },
  //         { path: "finance/edit", element: <EditCapital /> },
  //         { path: "profile", element: <Profile /> },
  //       ],
  //     },
  //   ],
  // },
];

export default routeConfig;
