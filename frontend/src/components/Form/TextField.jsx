import TextField from "@mui/material/TextField";

export default function BasicTextFields({id, label}) {
	return (
		<TextField id={id} label={label} variant="outlined" sx={{ width: "100%"}} />
	);
}
