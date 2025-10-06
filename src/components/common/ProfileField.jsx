import React from "react";
import { TextField, Grid } from "@mui/material";

export default function ProfileField({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
}) {
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        fullWidth
        variant="outlined"
        size="small"
        disabled={disabled}
        type={type}
      />
    </Grid>
  );
}