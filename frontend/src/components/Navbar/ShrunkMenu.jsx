import * as React from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {Link, useLocation} from "react-router-dom";

export default function ShrunkMenu() {
	
    const location = useLocation();
    const path = location.pathname;
    console.log(path);

	return (
        <>
		<List
			sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", display: "flex", flexDirection: "column", alignItems: "center" }}
			component="nav"
			aria-labelledby="nested-list-subheader"
		>
			<ListItemButton  component={Link} to="/" selected={path === "/"} >
				<ListItemIcon sx={{  display: "flex", flexDirection: "column", alignItems: "center" }}>
					<DashboardIcon />
				</ListItemIcon>
			</ListItemButton>

			<ListItemButton component={Link} to="create/" selected={path === "/create/"}>
				<ListItemIcon sx={{  display: "flex", flexDirection: "column", alignItems: "center" }}>
					<AddBoxIcon />
				</ListItemIcon>
				
			</ListItemButton>
				
		</List>
        </>
	);
}
