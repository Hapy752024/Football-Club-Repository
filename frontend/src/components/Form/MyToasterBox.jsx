import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

/* name, value, onChange, and onBlur to be handled by parent - Formik*/ const SEVERITY_COLORS =
	{
		error: { background: "#d32f2f", text: "#fff" },
		info: { background: "#1976d2", text: "#fff" },
		success: { background: "#2e7d32", text: "#fff" }
	};

export default function MyToasterBox({ message, severity = "info" }) {
	const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.success;

	return (
		<Box
			sx={{
				backgroundColor: backgroundColor,
				color: severity === "error" ? "#fff" : "#000",
				borderRadius: "4px",
				boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
				padding: "10px",
				marginTop: "10px",
				marginBottom: "10px",
				display: "flex",
				alignItems: "center"
			}}>
			<Typography>{message}</Typography>
		</Box>
	);
}
