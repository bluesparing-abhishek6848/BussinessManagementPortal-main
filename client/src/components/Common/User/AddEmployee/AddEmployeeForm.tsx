import { useForm } from "react-hook-form";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../../../../lib/InputField";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";
import usePost from "../../../../Hooks/usePost";

interface EmployeeFormProps {
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  dateOfJoining: string;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}


const AddEmployeesForm = () => {
  const navigate = useNavigate();
  const { postData, isLoading } = usePost<any, EmployeeFormProps>();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormProps>({
    defaultValues: {
      department: "General",
      isActive: true,
      dateOfJoining: new Date().toISOString().split("T")[0],
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });

  const onSubmit = async (data: EmployeeFormProps) => {
    try {
      await postData(data, "employees");
      toast.success("Employee added successfully!");
      reset();
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <FormWrapper>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box
          maxWidth="md"
          mx="auto"
          mt={4}
        >
          <Card elevation={3} style={{ borderRadius: 12 }}>
          <CardHeader
            title="Add New Employee"
            subheader="Fill the details below to add a new employee"
            sx={{
              background: "#1976d2",
              color: "#fff",
              textAlign: "center",
              paddingY: 3,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Full Name"
                  register={register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                  error={!!errors.name}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <InputField
                  label="Email"
                  type="email"
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  error={!!errors.email}
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Position"
                  register={register("position", {
                    required: "Position is required",
                  })}
                  error={!!errors.position}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <InputField
                  label="Department"
                  select
                  register={register("department", {
                    required: "Department is required",
                  })}
                  error={!!errors.department}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </MenuItem>
                  ))}
                </InputField>
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Salary"
                  type="number"
                  register={register("salary", {
                    required: "Salary is required",
                    min: { value: 0, message: "Salary must be positive" },
                  })}
                  error={!!errors.salary}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Date of Joining"
                  type="date"
                  register={register("dateOfJoining", {
                    required: "Date of joining is required",
                  })}
                  error={!!errors.dateOfJoining}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <InputField
                  label="Active"
                  type="checkbox"
                  register={register("isActive")}
                  error={!!errors.isActive}
                  checked={watch("isActive")}
                />
              </Grid> */}

              <Grid item xs={12}>
                <Box mt={2}>
                  <Typography variant="h6">
                    Address
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  label="Street"
                  register={register("address.street", {
                    required: "Street is required",
                  })}
                  error={!!errors.address?.street}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="City"
                  register={register("address.city", {
                    required: "City is required",
                  })}
                  error={!!errors.address?.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="State"
                  register={register("address.state", {
                    required: "State is required",
                  })}
                  error={!!errors.address?.state}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Zip Code"
                  register={register("address.zipCode", {
                    required: "Zip Code is required",
                    pattern: {
                      value: /^[0-9]{5,10}$/,
                      message: "Enter a valid zip code",
                    },
                  })}
                  error={!!errors.address?.zipCode}
                />
              </Grid>

              <Grid item xs={12}>
                <Box mt={3} display="flex" justifyContent="center">
                  <SubmitButton
                    loading={isLoading}
                    label="Add Employee"
                    loadingLabel="Creating..."
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      </form>
    </FormWrapper>
  );
};

export default AddEmployeesForm;
