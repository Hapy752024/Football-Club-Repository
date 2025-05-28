import { React, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Menu from "./Menu";
import ShrunkMenu from "./ShrunkMenu";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import IconButton from '@mui/material/IconButton';
import logo from "../../assets/Logo CBI App.png";

const drawerWidth = 240;
const shrunkDrawerWidth = 80;

export default function Navbar({ content }) {
	//  All hooks and variables declared before return
	const [isShrunkMenu, setIsShrunkMenu] = useState(false);

	const handleDrawerToggle = () => {
		setIsShrunkMenu(!isShrunkMenu);
	}

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<IconButton onClick={handleDrawerToggle} sx={{marginRight: 3, color: "white" }} >
						{isShrunkMenu ? <MenuOpenIcon  /> : <MenuIcon  /> }
					</IconButton>
					<img src={logo} alt="Logo" style={{ width: "200px" }} />
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				sx={{
					width: isShrunkMenu?shrunkDrawerWidth:drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: isShrunkMenu?shrunkDrawerWidth:drawerWidth,
						boxSizing: "border-box"
					}
				}}
			>
				<Toolbar />
				{isShrunkMenu ? <ShrunkMenu /> : <Menu />}
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				{content}
			</Box>
		</Box>
	);
}
