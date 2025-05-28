import * as React from "react";
import TextField from "@mui/material/TextField";

export default function TextArea({id, label, rows = 4, defaultValue = "", sx = {}}) {
	return (	
		<TextField
			id={id}
			label={label}
			multiline
			rows={rows}
			defaultValue={defaultValue}
			variant="outlined"
			sx={{ 
				width: "100%",
				...sx
			}}
		/> 
	);
}