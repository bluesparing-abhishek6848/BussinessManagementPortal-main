import { useSelector } from "react-redux";
import type { MyState } from "./RoleBasedHeader";
import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo/Seo";
import { makeSeoUrl } from "../Constant";

const AdminProfile = () => <div></div>;
const BranchManagerProfile = () => <div></div>;
const CollectionManagerProfile = () => <div></div>;
const AccountManagerProfile = () => <div></div>;
const GuestProfile = () => <div></div>;

const Profile = () => {
  const user = useSelector((state: MyState) => state.auth.user);

  const navigate = useNavigate();
  const getInitials = (name = "A") => name.charAt(0).toUpperCase();
  const renderRoleComponent = () => {
    switch (user.role) {
      case "admin":
        return <AdminProfile />;
      case "branchManager":
        return <BranchManagerProfile />;
      case "collectionManager":
        return <CollectionManagerProfile />;
      case "accountManager":
        return <AccountManagerProfile />;
      default:
        console.warn("Unknown role. Rendering GuestProfile");
        return <GuestProfile />;
    }
  };

  if (!user || !user.role) {
    return (
      <div className="text-red-500">
        Invalid user session. Please log in again.
      </div>
    );
  }

  const goToProfile = () => {
    switch (user.role) {
      case "admin":
      case "branchManager":
      case "collectionManager":
      case "accountManager":
        navigate("/profile");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <>
      <Seo
        title="My Profile | Aapka Future"
        description="View and edit your profile and account information."
        url={makeSeoUrl("profile")}
      />
      <div className="max-w-4xl mx-auto mt-6 md:mt-12 px-4 sm:px-6 py-6 sm:py-8 bg-white rounded-xl sm:rounded-2xl shadow-md space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          {/* Profile Info */}
          <div
            className="flex items-center gap-4 cursor-pointer w-full sm:w-auto"
            onClick={goToProfile}
          >
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                loading="lazy"
                className="w-14 h-14 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-300 text-gray-700 font-bold flex items-center justify-center border border-gray-400 text-xl">
                {getInitials(user.name)}
              </div>
            )}

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-green-600 font-semibold">
                {user.role?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-2 text-sm sm:text-base">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          {user.branch && (
            <p>
              <strong>Branch:</strong>{" "}
              {typeof user.branch === "string"
                ? user.branch
                : user.branch?.name}
            </p>
          )}
        </div>

        {/* Role Specific Component */}
        <div>{renderRoleComponent()}</div>
      </div>
    </>
  );
};

export default Profile;
