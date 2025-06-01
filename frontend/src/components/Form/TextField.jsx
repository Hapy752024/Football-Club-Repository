import TextField from "@mui/material/TextField";

/* name, value, onChange, and onBlur to be handled by parent - Formik*/
export default function BasicTextFields({id, label, name, value, onChange, onBlur, error, helperText}) {
	return (
		<TextField 
			id={id} 
			label={label} 
			name={name}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			variant="outlined"
			sx={{ width: "100%"}}
			error = {error}
			helperText = {helperText}
			/>
	);
}
