import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo/Seo";
import { makeSeoUrl } from "../Constant";

const UnAuthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Seo
        title="Unauthorized | Aapka Future"
        description="You do not have permission to access this page."
        url={makeSeoUrl("unauthorized")}
      />

      <div className="h-screen w-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center">
          <Typography variant="h3" color="error" gutterBottom>
            403
          </Typography>
          <Typography variant="h5" className="mb-4">
            Unauthorized Access
          </Typography>
          <Typography variant="body1" className="mb-6 text-gray-600">
            You do not have permission to view this page. Please contact the administrator or go back.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoBack}
            className="mt-2"
          >
            Go Back
          </Button>
        </div>
      </div>
    </>
  );
};




export default UnAuthorized
