import  TextField  from "@mui/material/TextField";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

export interface InputFieldProps {
  label: string;
  type?: string;
  inputProps?: object;
  register: UseFormRegisterReturn;
  error?: FieldError;
  select?: boolean;
  loading?: boolean;
}

const InputField = ({
  label,
  register,
  error,
  type = "text",
  select = false,
  loading,
  ...rest
}: any) => {
  return (
    <TextField
      label={label}
      type={type}
      fullWidth
      {...register}
      select={select}
      error={!!error}
      helperText={error?.message}
      InputLabelProps={{
        shrink: type === "date" ? true : undefined, // 👈 fixes overlay for date
      }}
      {...rest}
    />
  );
};

export default InputField;
