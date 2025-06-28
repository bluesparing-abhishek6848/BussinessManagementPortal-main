import { Button, Grid } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
}

const SubmitButton = ({
  loading = false,
  label = "Submit",
  loadingLabel = "Submitting...",
  ...rest
}: SubmitButtonProps) => {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          bgcolor: "primary.main",
          py: 1.9,
          fontWeight: "bold",
          "&:hover": { bgcolor: "primary.dark" },
          ...rest.sx, // allow external styles
        }}
        {...rest}
      >
        {loading ? loadingLabel : label}
      </Button>
    </Grid>
  );
};

export default SubmitButton;
