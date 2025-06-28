import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import type { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';

interface ReusableAutocompleteProps<T> {
  label: string;
  value: T | null;
  onChange: (value: T | null) => void;
  options: T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue: (option: T, value: T) => boolean;
  error?: boolean;
  helperText?: string;
  disabled?:boolean
}

export function ReusableAutocomplete<T>({
  label,
  value,
  onChange,
  options,
  getOptionLabel,
  isOptionEqualToValue,
  error,
  helperText,disabled=false
}: ReusableAutocompleteProps<T>) {
  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          fullWidth
          disabled={disabled}
        />
      )}
    />
  );
}
