import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SingleItemSelector({id, label, options, emptyOption = false}) {
	const [selection, setSelection] = emptyOption ? React.useState("") : React.useState(options[0]?.value ?? "");

	const handleChange = event => {
		setSelection(event.target.value);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id={`${id}-label`}>
				{label}
			</InputLabel>
			<Select
				labelId={`${id}-label`}
				value={selection}
				id={id}
				label={label}
				onChange={handleChange}
			>
				{options.map(option =>
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}
