import Grid from '@mui/material/Grid';

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import usePost from "../../../../Hooks/usePost";
import InputField from "../../../../lib/InputField";
import { toast } from "react-toastify";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";

interface AddBranchFormProps {
  name: string;
  address: string;
}

const AddBranchForm = () => {
  const { postData, isLoading } = usePost<any, AddBranchFormProps>();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddBranchFormProps>();

  const onSubmit = async (data: AddBranchFormProps) => {
    try {
      await postData(data, "branches"); // ✅ fixed API endpoint
      // After successful post:
      toast.success("Branch Added successfully!");
      reset();
      navigate(-1);
    } catch (error: any) {
      // Show toast with error message here
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <FormWrapper>
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Branch"
            error={!!errors.name}
            register={register("name", {
              required: "BranchName is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InputField
            label="Branch Address"
            fullWidth
            error={!!errors.address}
            register={register("address", {
              required: "Branch Address is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            })}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              bgcolor: "primary.main",
              py: 1.9,
              fontWeight: "bold",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isLoading ? "Creating..." : "Create Branch"}
          </Button>
        </Grid> */}
        <SubmitButton
            loading={isLoading}
            label="Add Branch"
            loadingLabel="Creating..."
          />
      </Grid>
    </form>
    </FormWrapper>
  );
};

export default AddBranchForm;
