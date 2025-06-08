import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "./Axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
	MaterialReactTable,
	useMaterialReactTable
} from "material-react-table";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography, Box, Chip, IconButton } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";

function Home() {
	const location =
		useLocation(); /* This parameter is to understand if the user has been redirected after successful creation*/
	// Get the country from the navigation state
	const selectedCountry = location.state?.selectedCountry || null;

	const [isLoading, setIsLoading] = useState(true);
	const [clubsData, setClubsData] = useState([]);
	const navigate = useNavigate(); // For navigation if needed

	const getData = async () => {
		setIsLoading(true);
		try {
			const ClubsRes = await axiosInstance.get(`/football-club/`);
			setClubsData(ClubsRes.data);
		} catch (error) {
			console.error("Error fetching data:", error);
			toast.error("Failed to fetch data. Please try again later.", {
				style: {
					backgroundColor: "red",
					padding: "16px",
					color: "white"
				}
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Check if redirected after successful creation
		if (location.state?.created) {
			toast.success("Item created successfully!", {
				style: {
					backgroundColor: "green",
					padding: "16px",
					color: "white"
				}
			});

			// Clear the state to avoid showing the toast again on refresh
			window.history.replaceState({}, "");
		}

		if (location.state?.updated) {
			toast.success("Item updated successfully!", {
				style: {
					backgroundColor: "green",
					padding: "16px",
					color: "white"
				}
			});

			// Clear the state to avoid showing the toast again on refresh
			window.history.replaceState({}, "");
		}
	}, [location.state]);

	useEffect(() => {
		getData();
	}, []);

	//should be memoized or stable
	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Club Name"
			},
			{
				accessorKey: "description",
				header: "Description"
			},
			{
				accessorKey: "city", //normal accessorKey
				header: "City"
			},
			{
				accessorKey: "country.name", //access nested data with dot notation
				header: "Country"
			},
			{
				accessorKey: "league.name", //access nested data with dot notation
				header: "League"
			},
			{
				accessorKey: "characteristics_names", //access nested data with dot notation
				header: "Characteristics",
				Cell: ({ cell }) => {
					const club_characteristics = cell.getValue();
					return (
						<Box
							sx={{
								display: "flex",
								gap: "5px",
								flexWrap: "wrap"
							}}>
							{club_characteristics.map((char, index) => (
								<Chip
									key={index}
									label={char}
									variant="outlined"
									sx={{
										marginRight: "5px",
										marginBottom: "5px"
									}}
								/>
							))}
						</Box>
					);
				}
			}
		],
		[]
	);

	// Filter the data based on the state (Method 2)
	const filteredData = useMemo(() => {
		if (!selectedCountry) {
			console.log("No selected country:", selectedCountry);
			return clubsData; // Show all clubs when no country selected
		}
		console.log("There is a selected country. Selected country:", selectedCountry);

		const filteredClubs = clubsData.filter(
			(club) =>
				club.country?.name?.toLowerCase() ===
				selectedCountry.toLowerCase()
		)

		console.log("Filtered clubs:", filteredClubs);

		return filteredClubs
	}, [clubsData, selectedCountry]);

	const table = useMaterialReactTable({
		columns,
		data: filteredData,
		enableRowActions: true,
		renderRowActions: ({ row, table }) => (
			<Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
				{/* <IconButton
					color="primary"
					onClick={() =>
						window.open(
							`mailto:kevinvandy@mailinator.com?subject=Hello ${row.original.firstName}!`
						)
					}>
					<EmailIcon />
				</IconButton> */}
				<IconButton
					color="primary"
					onClick={() => {
						navigate(`/edit/${row.original.id}`, {
							state: { rowData: row.original }
						});
					}}>
					<EditIcon />
				</IconButton>
				<IconButton
					color="error"
					component={Link}
					to={`/delete/${row.original.id}`}>
					<DeleteIcon />
				</IconButton>
			</Box>
		)
	});

	return (
		<Container fluid>
			<Row className="mb-4">
				<Col xs={12}>
					<Box className="TopBar">
						<CalendarViewMonthIcon />
						<Typography
							sx={{ marginLeft: "10px", fontWeight: "bold" }}
							variant="subtitle2">
							View all Football Clubs
						</Typography>
					</Box>
				</Col>
			</Row>

			<Row className="mb-4">
				<Col xs={12}>
					<MaterialReactTable table={table} />
				</Col>
			</Row>
		</Container>
	);
}

export default Home;
