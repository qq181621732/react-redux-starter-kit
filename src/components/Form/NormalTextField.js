import React from 'react'
import TextField from 'material-ui/TextField'
export const NormalTextField =  ({ input, label, meta: { touched, error }, ...custom }) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
    />
)
export default NormalTextField
