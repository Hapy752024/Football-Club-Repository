import React, { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import axiosInstance from "./Axios";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Typography } from "@mui/material";
import TextField from "../components/Form/TextField";
import SingleItemSelector from "../components/Form/SingleItemSelector";
import MultiItemSelector from "../components/Form/MultiItemSelector";
import TextArea from "../components/Form/TextArea";

export default function Create() {
	const [countries, setCountries] = useState([]);
	const [leagues, setLeagues] = useState([]);
	const [characteristics, setCharacteristics] = useState([]);

	const getData = async () => {
		try {
			const countriesRes = await axiosInstance.get(`/country/`);
			setCountries(countriesRes.data);
			console.log("received data - countries: ", countriesRes.data);

			const leaguesRes = await axiosInstance.get(`/league/`);
			setLeagues(leaguesRes.data);
			console.log("received data - leagues: ", leaguesRes.data);

			const characteristicsRes = await axiosInstance.get(`/characteristics/`);
			setCharacteristics(characteristicsRes.data);
			console.log("received data - characteristics: ", characteristicsRes.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		console.log("countries list: ", countries);
	}, [countries]);

	useEffect(() => {
		console.log("league list: ", leagues);
	}, [leagues]);

	useEffect(() => {
		console.log("characteristics list: ", characteristics);
	}, [characteristics]);

	return (
		<Container fluid>
			<Row className="mb-4">
				<Col xs={12}>
					<Box className="TopBar">
						<AddBoxIcon />
						<Typography
							sx={{ marginLeft: "10px", fontWeight: "bold" }}
							variant="subtitle2"
						>
							Welcome to the Create Page
						</Typography>
					</Box>
				</Col>
			</Row>

			<Row>
				{/* Left side - 3 rows with 2 fields each */}
				<Col xs={12} lg={8}>
					{/* Row 1: Name and League */}
					<Row className="mb-3">
						<Col xs={12} md={6} className="mb-3">
							<TextField id="name" label="Name" />
						</Col>
						<Col xs={12} md={6}>
							<SingleItemSelector
								id="league"
								label="League"
								options={leagues.map(league => ({
									value: league.id,
									label: league.name
								}))}
								emptyOption={false}
							/>
						</Col>
					</Row>

					{/* Row 2: Country and City */}
					<Row className="mb-3">
						<Col xs={12} md={6} className="mb-3">
							<SingleItemSelector
								id="country"
								label="Country"
								options={countries.map(country => ({
									value: country.id,
									label: country.name
								}))}
								emptyOption={false}
							/>	
						</Col>
						<Col xs={12} md={6}>
							<TextField id="city" label="City" />	
						</Col>
					</Row>

					{/* Row 3: Characteristics and Attendance */}
					<Row>
						<Col xs={12} md={6} className="mb-3">
							<MultiItemSelector
								id="characteristics"
								label="Characteristics"
								options={characteristics.map(characteristic => ({
									value: characteristic.id,
									label: characteristic.name
								}))}
								emptyOption={false}
							/>	
						</Col>
						<Col xs={12} md={6}>
							<TextField id="attendance" label="Attendance" />	
						</Col>
					</Row>
				</Col>

				{/* Right side - Full height textarea */}
				<Col xs={12} lg={4}>
					<TextArea 
						id="description" 
						label="Description" 
						rows={9}
					/>
				</Col>
			</Row>

			{/* Action buttons */}
			<Row className="mt-4">
				<Col xs={12}>
					<div className="d-flex justify-content-between">
						<button 
							type="button" 
							className="btn btn-secondary"
							onClick={() => console.log('Cancel clicked')}
						>
							Cancel
						</button>
						<button 
							type="button" 
							className="btn btn-primary"
							onClick={() => console.log('Create clicked')}
						>
							Create
						</button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}