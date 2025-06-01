import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

/* name, value, onChange, and onBlur to be handled by parent - Formik*/
export default function SingleItemSelector({
	id,
	label,
	name,
	value,
	onChange,
	onBlur,
	error,
	helperText,
	options
}) {
	return (
		<FormControl fullWidth>
			<InputLabel id={`${id}-label`}>{label}</InputLabel>
			<Select
				labelId={`${id}-label`}
				value={value}
				id={id}
				label={label}
				name={name}
				onBlur={onBlur}
				onChange={onChange}
				error={error}>
				{options.map((option) => (
					<MenuItem
						key={option.value}
						value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</Select>
			{error && helperText ? (
				<FormHelperText error>{helperText}</FormHelperText>
			) : null}
		</FormControl>
	);
}
