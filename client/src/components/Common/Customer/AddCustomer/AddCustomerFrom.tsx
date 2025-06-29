import { Grid, Button, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import InputField from "../../../../lib/InputField";
import { useState, useEffect } from "react";
import { objectToFormData } from "../../../../Constant";
import usePost from "../../../../Hooks/usePost";
import { useNavigate } from "react-router-dom";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import type { IBranch } from "../../Branch/OrderTypes";

interface AddCustomerFormProps {
  phone: string;
  name: string;
  address: string;
  aadhar: string;
  aadharPic: FileList;
  alternative_phone?: string;
}

const AddCustomerForm = () => {
  const navigate = useNavigate();
  const { postData, isLoading, error } = usePost<any, FormData>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddCustomerFormProps>();

  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const branch = user?.branch as IBranch;
  const branchId = branch._id;

  const aadharPic = watch("aadharPic");

  useEffect(() => {
    if (aadharPic && aadharPic.length > 0) {
      const file = aadharPic[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [aadharPic]);

  const onSubmit = async (data: AddCustomerFormProps) => {
    const obj = { ...data, aadharPic: data.aadharPic[0], branch: branchId };
    const payload = objectToFormData(obj);
    const res = await postData(payload, "customers");

    if (res.success) {
      navigate(-1);
    }
  };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <InputField
              label="Full Name"
              register={register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              error={errors.name}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <InputField
              label="address"
              type="string"
              register={register("address", {
                required: "Address is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              error={errors.address}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <InputField
              label="Phone Number"
              type="tel"
              inputProps={{ maxLength: 10 }}
              register={register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Must be exactly 10 digits",
                },
              })}
              error={errors.phone}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <InputField
              label="Alternative Phone Number"
              type="tel"
              inputProps={{ maxLength: 10 }}
              register={register("alternative_phone", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Must be exactly 10 digits",
                },
              })}
              error={errors.alternative_phone}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <InputField
              label="Aadhar Number"
              type="text"
              inputProps={{ maxLength: 4 }}
              register={register("aadhar", {
                required: "Aadhar is required",
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "Must be exactly 4 digits",
                },
              })}
              error={errors.aadhar}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ textTransform: "none", py: 1.9 }}
            >
              Upload Aadhar
              <input
                type="file"
                accept="image/*"
                hidden
                {...register("aadharPic", {
                  required: "Profile picture is required",
                })}
              />
            </Button>

            {errors.aadharPic && (
              <Typography variant="caption" color="error" mt={1}>
                {errors.aadharPic.message}
              </Typography>
            )}

            {preview && (
              <Box mt={2}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* <Grid size={{ xs: 12, sm: 6, lg: 4 }}></Grid> */}

          <SubmitButton
            loading={isLoading}
            label="Add Customer"
            loadingLabel="submiting..."
          />
          {error && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default AddCustomerForm;
