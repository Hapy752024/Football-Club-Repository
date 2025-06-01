import Box from "@mui/material/Box";
import { Typography } from '@mui/material';

/* name, value, onChange, and onBlur to be handled by parent - Formik*/
export default function MyToasterBox({message, severity = "info"}) {
    const backgroundColor = severity === "error" ? "#ff0000" : severity === "info" ? "#ffff99" : "#33cc33";

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
                alignItems: "center",
            }}
        >
            <Typography>{message}</Typography>

        </Box>
    );
}
