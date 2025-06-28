import Grid from '@mui/material/Grid';

import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import usePut from "../../../../Hooks/usePut";
import InputField from "../../../../lib/InputField";
import { toast } from "react-toastify";
import SubmitButton from "../../../../lib/ButtonWrapper";
import FormWrapper from "../../../../lib/FormWrapper";

interface EditBranchFormProps {
  name: string;
  address: string;
}

const EditBranchForm = ({
  defaultValues,
}: {
  defaultValues: EditBranchFormProps;
}) => {
  const { id: branchId } = useParams();
  const { putData, isLoading } = usePut<any, EditBranchFormProps>();
  // const { data: branchResponse = {} } = useGet<any>("branches");
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EditBranchFormProps>({ defaultValues });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: EditBranchFormProps) => {
    try {
      await putData(data, `branches/${branchId}`); // ✅ fixed API endpoint
      toast.success("Branch updated successfully!");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Branch"
              fullWidth
              register={register("name", {
                required: "Branch Name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              variant="outlined" // Use 'outlined' if you want the label to show at the top
              InputLabelProps={{
                shrink: true, // Ensures the label stays at the top
              }}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Branch Address"
              fullWidth
              register={register("address", {
                required: "Branch Address is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              variant="outlined" // Use 'outlined' if you want the label to show at the top
              InputLabelProps={{
                shrink: true, // Ensures the label stays at the top
              }}
              error={!!errors.address}
              helperText={errors.address?.message}
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
            {isLoading ? "Updating..." : "Update Branch"}
          </Button>
        </Grid> */}
          <SubmitButton
            loading={isLoading}
            label="Update Branch"
            loadingLabel="Updating..."
          />
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default EditBranchForm;
