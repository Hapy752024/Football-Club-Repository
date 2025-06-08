import React, { useState, useEffect } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../pages/Axios"; // Adjust the import path as necessary

export default function Menu() {
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(true);
	const [countries, setCountries] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState("");

	const getData = async () => {
		try {
			const countriesRes = await axiosInstance.get(`/country/`);
			setCountries(countriesRes.data);
		} catch (error) {
			console.error("Error fetching data:", error);
			setToastMessage(
				<MyToasterBox
					message="Navbar failed to load form data. Please refresh the page."
					severity="error"
				/>
			);
		} finally {
		}
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		console.log("Navbar Menu - countries loaded: ", countries);
	}, [countries]);

	const handleClick = () => {
		setOpen(!open);
	};
	const location = useLocation();
	const path = location.pathname;
	console.log(path);

	// Navigate to clubs page with country in state (not URL)
	const handleCountrySelect = (countryName) => {
		setSelectedCountry(countryName);
		navigate("/", {
			state: {
				selectedCountry: countryName,
				filterType: "country" // Optional: you can add more metadata
			}
		});
	};

	return (
		<>
			<List
				sx={{
					width: "100%",
					maxWidth: 360,
					bgcolor: "background.paper"
				}}
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader
						component="div"
						id="nested-list-subheader">
						Football clubs
					</ListSubheader>
				}>
				<ListItemButton
					onClick={()=> {
						handleClick()
						setSelectedCountry(""); // Reset selected country when clicking "All clubs"}
					}}
					component={Link}
					to="/"
					selected={path === "/"}>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="All clubs" />
					{open ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse
					in={open}
					timeout="auto"
					unmountOnExit>
					<List
						component="div"
						disablePadding>
						{countries.map((country, index) => (
							<ListItemButton
								sx={{ pl: 4, backgroundColor:country.name === selectedCountry ?  "#f0f0f0"  : null }}
								onClick={() =>
									handleCountrySelect(country.name)
								}>
								<ListItemIcon>
									<DashboardCustomizeIcon />
								</ListItemIcon>
								<ListItemText primary={country.name} />
							</ListItemButton>
						))}

						{/* <ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<DashboardCustomizeIcon />
							</ListItemIcon>
							<ListItemText primary="Netherlands" />
						</ListItemButton>

						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<DashboardCustomizeIcon />
							</ListItemIcon>
							<ListItemText primary="India" />
						</ListItemButton>

						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<DashboardCustomizeIcon />
							</ListItemIcon>
							<ListItemText primary="France" />
						</ListItemButton> */}
					</List>
				</Collapse>
			</List>

			<List
				sx={{
					width: "100%",
					maxWidth: 360,
					bgcolor: "background.paper"
				}}
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader
						component="div"
						id="nested-list-subheader">
						Managing records
					</ListSubheader>
				}>
				<ListItemButton
					component={Link}
					to="create/"
					selected={path === "/create/"}>
					<ListItemIcon>
						<AddBoxIcon />
					</ListItemIcon>
					<ListItemText primary="Create" />
				</ListItemButton>
			</List>
		</>
	);
}
