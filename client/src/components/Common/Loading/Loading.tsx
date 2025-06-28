import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';


interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading, please wait..." }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <CircularProgress size={50} thickness={5} color="primary" />
      <Typography
        variant="body1"
        sx={{ marginTop: 2, color: "text.secondary", fontWeight: 500 }}
      >
        {message}
      </Typography>
    </div>
  );
};

export default Loading;
