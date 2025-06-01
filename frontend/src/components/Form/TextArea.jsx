import * as React from "react";
import TextField from "@mui/material/TextField";

/* name, value, onChange, and onBlur to be handled by parent - Formik*/
export default function TextArea({id, label, rows = 4, name, value,  onChange, onBlur, error, helperText, sx = {}}) {
	return (	
		<TextField
			id={id}
			label={label}
            name={name}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			error = {error}
			helperText = {helperText}
			multiline
			rows={rows}
			variant="outlined"
			sx={{ 
				width: "100%",
				...sx
			}}
		/> 
	);
}