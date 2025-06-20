import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import createAxiosInstance from "./Axios";
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from "@mui/material";
import MyToasterBox from "../components/Form/MyToasterBox";

export default function Delete() {
	const [club, setClub] = useState({
		name: "",
		league: "",
		country: "",
		city: "",
		characteristics: [],
		attendance: 0,
		description: ""
	});
	const [toastMessage, setToastMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const axiosInstance = createAxiosInstance();

	const navigate = useNavigate();
	const params = useParams();
	const clubId = params.id; // Assuming the URL is like /edit/:id
	if (!clubId) {
		console.error("Club ID is not provided in the URL");
		return <div> no id found</div>;
	}

	const getData = async () => {
		setIsLoading(true);
		try {
			const clubRes = await axiosInstance.get(
				`/football-club/${clubId}/`
			);
			setClub(clubRes.data);
			console.log("Club data fetched:", clubRes.data);
		} catch (error) {
			console.error("Error fetching data:", error);
			setToastMessage(
				<MyToasterBox
					message="Failed to load form data. Please refresh the page."
					severity="error"
				/>
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		console.log("Club - use effect data", club);
	}, [club]);

    const handleDelete = async (event) => {

        event.preventDefault(); // ✅ prevents page reload
        
        try {    
            await axiosInstance.delete(`/football-club/${clubId}/`);    
            navigate("/", { state: { deleted: true } });    
        } catch (error) {
            console.error("Error deleting club:", error);
            setToastMessage(
                <MyToasterBox
                    message="Failed to delete club. Please try again."
                    severity="error"
                />
            );
        }
    }

	return (
		<Container fluid>
			<form onSubmit={handleDelete}>
				<Row className="mb-4">
					<Col xs={12}>
						<Box className="TopBar">
							<DeleteIcon />
							<Typography
								sx={{ marginLeft: "10px", fontWeight: "bold" }}
								variant="subtitle2">
								Delete Football Club
							</Typography>
						</Box>
					</Col>
				</Row>

				<Row className="mb-4">
					<Col xs={12}>{toastMessage}</Col>
				</Row>

				<Row>
                    {<Typography>
                        Are you sure you want to delete <strong> {club.name} </strong> the club from  <strong> {club.city},</strong> <strong> {club.country.name} </strong> ?
                    </Typography> }
				</Row>

				{/* Action buttons */}
				<Row className="mt-4">
					<Col xs={12}>
						<div className="d-flex justify-content-between">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => navigate("/")}>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-warning">
								Delete Club
							</button>
						</div>
					</Col>
				</Row>
			</form>
		</Container>
	);
}
