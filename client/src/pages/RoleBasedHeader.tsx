import React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import type { IUser } from "../types";
import { logout } from "../store/authSlice";
import usePost from "../Hooks/usePost";
import IconActionButton from "../components/ui/IconActionBtn";
import { PowerCircleIcon } from "lucide-react";

interface RoleBasedHeaderProps {
  user: IUser;
}

interface Auth {
  user: IUser;
  token: string;
}

export interface MyState {
  auth: Auth;
  otherProp?: number;
}

const RoleBasedHeader: React.FC<RoleBasedHeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  const { postData } = usePost();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await postData({}, "users/logout");
    dispatch(logout());
  };

  const loading = useSelector((state: RootState) => state.finance.isLoading);
  const error = useSelector((state: RootState) => state.finance.error);
  const getInitials = (name = "A") => name.charAt(0).toUpperCase();

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );

  const goToProfile = () => {
    switch (user.role) {
      case "admin":
      case "branchManager":
      case "collectionManager":
      case "accountManager":
        navigate("profile");
        break;
      default:
        navigate("/");
    }
  };

  const renderRoleMessage = () => {
    switch (user.role) {
      case "admin":
      case "branchManager":
      case "collectionManager":
        return "Welcome,";
      case "accountManager":
        return "Welcome,";
      default:
        return "Welcome, Guest";
    }
  };

  return (
    <header className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left Section: Welcome */}
      <div className="text-sm sm:text-base font-medium text-gray-700">
        {renderRoleMessage()} <span className="text-gray-900">{user.name}</span>{" "}
        <span className="text-gray-500 text-sm">({user.role})</span>
      </div>

      {/* Right Section: Wallet + Profile */}
      <div className="flex items-center justify-between gap-4 sm:gap-6">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            loading="lazy"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300 cursor-pointer"
            onClick={goToProfile}
            title="Go to Profile"
          />
        ) : (
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-700 font-bold flex items-center justify-center border border-gray-400 cursor-pointer"
            onClick={goToProfile}
            title="Go to Profile"
          >
            {getInitials(user.name)}
          </div>
        )}

        <div className="w-full sm:w-auto">
          <IconActionButton title="Logout" icon={<PowerCircleIcon color="red" />} onClick={handleLogout} />

        </div>
      </div>
    </header>
  );
};

export default RoleBasedHeader;