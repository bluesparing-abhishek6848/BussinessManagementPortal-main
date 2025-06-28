// src/components/ui/FormWrapper.tsx
import { Paper } from "@mui/material";
import type { ReactNode } from "react";

interface FormWrapperProps {
  children: ReactNode;
}

const FormWrapper = ({ children }: FormWrapperProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        // mt: 3,
        width: "100%",
        maxWidth: "100%",
        maxHeight: "73vh",
        overflowY: "auto",
        boxSizing: "border-box",
        mx: "auto",
        backgroundColor: "background.paper",
        // borderRadius: 2,
      }}
    >
      {children}
    </Paper>
  );
};

export default FormWrapper;
