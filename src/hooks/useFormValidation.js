import { useState } from 'react';

export default function useFormValidation(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (validate) {
      setErrors(validate({ ...values, [name]: value }));
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, resetForm };
}
