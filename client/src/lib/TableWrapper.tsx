import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { MyState } from "../pages/RoleBasedHeader";
import { useSelector } from "react-redux";
import { MoveLeft } from "lucide-react";

interface TableWrapperProps {
  children: React.ReactNode;
  subtitle?: string;
  headLine?: string;
  onHandleClick?: () => void;
  btnText?: string;
}

const TableWrapper = ({
  children,
  subtitle,
  headLine,
  onHandleClick,
  btnText,
}: TableWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldShowBackIcon =
    location.pathname.includes("edit") ||
    location.pathname.includes("add") ||
    location.pathname.includes("today-collection");

  const user = useSelector((state: MyState) => state.auth.user);

  const getDashboardLink = () => {
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "branchManager":
        return "/branch-manager/dashboard";
      case "collectionManager":
        return "/collection-manager/dashboard";
      case "accountManager":
        return "/account-manager/dashboard";
      default:
        return "/guest/dashboard";
    }
  };

  return (
    <>
   
      <Box
        sx={{   
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 2,
          mb: 1,
          flexWrap: "wrap",
        }}
      >
        {shouldShowBackIcon && (
          <MoveLeft
            className="text-blue-500 cursor-pointer hover:text-blue-400"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          />
        )}
        <Typography variant="h6" fontWeight={600}>
          {headLine}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 2,
          gap: 1,
        }}
      >
        {subtitle && (
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{
              wordBreak: "break-word",
              flexGrow: 1,
            }}
          >
            <NavLink to={getDashboardLink()}>{subtitle}</NavLink>
          </Typography>
        )}

        {  onHandleClick && (
          <Button
            variant="contained"
            onClick={onHandleClick}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {btnText}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          borderBottom: "3px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          // mb: 2,
        }}
      />

      <Box sx={{ width: "100%", pt: 2, overflowX: "auto" }}>{children}</Box>
      {/* </Paper> */}
    </>
  );
};

export default TableWrapper;
