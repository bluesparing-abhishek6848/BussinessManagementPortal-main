import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../../../../lib/InputField";
import usePut from "../../../../Hooks/usePut";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";
import { Box, Button, Typography } from "@mui/material";

interface EditCustomerFormProps {
  _id: string;
  phone: string;
  name: string;
  address: string;
  aadhar: string;
  branch?: string;
  aadharPic: FileList | string;
  alternative_phone: string;
}

const EditCustomerForm = ({
  defaultValues,
}: {
  defaultValues: EditCustomerFormProps;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { putData, isLoading,error } = usePut<any, any>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditCustomerFormProps>({ defaultValues });

  const [preview, setPreview] = useState<string | null>(null);

  const aadharPic = watch("aadharPic");

  useEffect(() => {
    if (aadharPic && typeof aadharPic !== "string" && aadharPic.length > 0) {
      const file = aadharPic[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (
      defaultValues?.aadharPic &&
      typeof defaultValues.aadharPic === "string"
    ) {
      setPreview(
        `${import.meta.env.VITE_API_IMAGE_URL}${defaultValues.aadharPic}`
      );
    }
  }, [aadharPic, defaultValues]);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: EditCustomerFormProps) => {
    const payload: any = { ...data };

    // If aadharPic is FileList, pick the file
    if (data.aadharPic instanceof FileList && data.aadharPic.length > 0) {
      payload.aadharPic = data.aadharPic[0];
    } else {
      delete payload.aadharPic; // prevent overwriting image if not updated
    }

    if (user?.branch) {
      if (typeof user.branch === "object" && "_id" in user.branch) {
        payload.branch = user.branch._id;
      } else {
        payload.branch = user.branch;
      }
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const res = await putData(formData, `customers/${data._id}`);
    if (res && "_id" in res) {
      toast.success("Customer updated successfully");
      navigate(-1);
    } else {
      toast.error("Update failed");
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
              label="Address"
              type="text"
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
              label="Last 4 digits of Aadhar Number"
              type="text"
              inputProps={{ maxLength: 4 }}
              register={register("aadhar", {
                required: "Last 4 digits are required",
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
                  required: !preview ? "Profile picture is required" : false,
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
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            )}
          </Grid>

          <SubmitButton
            loading={isLoading}
            label="Update Customer"
            loadingLabel="Updating..."
          />
        </Grid>
               {error && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
            </Grid>
        )}
      </form>
    </FormWrapper>
  );
};

export default EditCustomerForm;