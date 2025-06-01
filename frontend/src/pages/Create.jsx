import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import axiosInstance from "./Axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Typography } from "@mui/material";
import TextField from "../components/Form/TextField";
import SingleItemSelector from "../components/Form/SingleItemSelector";
import MultiItemSelector from "../components/Form/MultiItemSelector";
import NumericField from "../components/Form/NumericField";
import TextArea from "../components/Form/TextArea";
import MyToasterBox from "../components/Form/MyToasterBox";

export default function Create() {
	const [countries, setCountries] = useState([]);
	const [leagues, setLeagues] = useState([]);
	const [characteristics, setCharacteristics] = useState([]);
	const [toastMessage, setToastMessage] = useState(null);
	const navigate = useNavigate();

	const getData = async () => {
		try {
			const countriesRes = await axiosInstance.get(`/country/`);
			setCountries(countriesRes.data);
			console.log("received data - countries: ", countriesRes.data);

			const leaguesRes = await axiosInstance.get(`/league/`);
			setLeagues(leaguesRes.data);
			console.log("received data - leagues: ", leaguesRes.data);

			const characteristicsRes = await axiosInstance.get(
				`/characteristics/`
			);
			setCharacteristics(characteristicsRes.data);
			console.log(
				"received data - characteristics: ",
				characteristicsRes.data
			);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const validationSchema = Yup.object({
		name: Yup.string()
			.required("Name is required")
			.max(100, "Name cannot exceed 100 characters"),
		league: Yup.string().required("League is required"),

		country: Yup.string().required("Country is required"),
		city: Yup.string()
			.required("City is required")
			.max(100, "City cannot exceed 100 characters")
			.min(3, "At least 3 characters are required")
			.matches(/^[a-zA-Z\s,]+$/,
            "City name can only contain letters, spaces, and commas"),
		characteristics: Yup.array().min(
			1,
			"At least one characteristic is required"
		),
		attendance: Yup.number()
			.required("Attendance is required")
			.positive("Attendance must be a positive number")
			.integer("Attendance must be an integer"),
		description: Yup.string().max(
			500,
			"Description cannot exceed 500 characters"
		)
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			league: "",
			country: "",
			city: "",
			characteristics: [],
			attendance: "",
			description: ""
		},
		validationSchema: validationSchema,
		validateOnBlur: true,
		onSubmit: async (values) => {
			console.log("Form values:", values);
			try {
				const postRes = await axiosInstance.post(
					`/football-club/`,
					values
				);
				console.log("Post response:", postRes);
				if (postRes.status === 201) {
					setToastMessage(
						<MyToasterBox
							message="Club created successfully!"
							severity="success"
						/>
					)
					setTimeout(() => {
						navigate("/", { state: { created: true } });
					}, 5000);
					
					
					
				} else {
					setToastMessage(
						<MyToasterBox
							message={`Failed to create club. Error from backend is ${JSON.stringify(
								postRes.data
							)}`}
							severity="error"
						/>
					);
				}

				// After setting toast message
				setTimeout(() => {
					setToastMessage(null);
				}, 3000); // Hide after 3 seconds
			} catch (error) {
				console.error("Error creating club:", error);
				setToastMessage(
					<MyToasterBox
						message="Failed to create club. Network error."
						severity="error"
					/>
				);
			}
		}
	});

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
			<form onSubmit={formik.handleSubmit}>
				<Row className="mb-4">
					<Col xs={12}>
						<Box className="TopBar">
							<AddBoxIcon />
							<Typography
								sx={{ marginLeft: "10px", fontWeight: "bold" }}
								variant="subtitle2">
								Welcome to the Create Page
							</Typography>
						</Box>
					</Col>
				</Row>

				<Row className="mb-4">
					<Col xs={12}>{toastMessage}</Col>
				</Row>

				<Row>
					{/* Left side - 3 rows with 2 fields each */}
					<Col
						xs={12}
						lg={8}>
						{/* Row 1: Name and League */}
						<Row className="mb-3">
							<Col
								xs={12}
								md={6}
								className="mb-3">
								<TextField
									id="name"
									label="Name"
									name="name"
									value={formik.values.name}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.name &&
										Boolean(formik.errors.name)
									}
									helperText={
										formik.touched.name &&
										formik.errors.name
									}
								/>
							</Col>
							<Col
								xs={12}
								md={6}>
								<SingleItemSelector
									id="league"
									label="League"
									name="league"
									value={formik.values.league}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.league &&
										Boolean(formik.errors.league)
									}
									helperText={
										formik.touched.league &&
										formik.errors.league
									}
									options={leagues.map((league) => ({
										value: league.id,
										label: league.name
									}))}
									emptyOption={false}
								/>
							</Col>
						</Row>

						{/* Row 2: Country and City */}
						<Row className="mb-3">
							<Col
								xs={12}
								md={6}
								className="mb-3">
								<SingleItemSelector
									id="country"
									label="Country"
									name="country"
									value={formik.values.country}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.country &&
										Boolean(formik.errors.country)
									}
									helperText={
										formik.touched.country &&
										formik.errors.country
									}
									options={countries.map((country) => ({
										value: country.id,
										label: country.name
									}))}
									emptyOption={false}
								/>
							</Col>
							<Col
								xs={12}
								md={6}>
								<TextField
									id="city"
									label="City"
									name="city"
									value={formik.values.city}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.city &&
										Boolean(formik.errors.city)
									}
									helperText={
										formik.touched.city &&
										formik.errors.city
									}
								/>
							</Col>
						</Row>

						{/* Row 3: Characteristics and Attendance */}
						<Row>
							<Col
								xs={12}
								md={6}
								className="mb-3">
								<MultiItemSelector
									id="characteristics"
									label="Characteristics"
									name="characteristics"
									value={formik.values.characteristics}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.characteristics &&
										Boolean(formik.errors.characteristics)
									}
									helperText={
										formik.touched.characteristics &&
										formik.errors.characteristics
									}
									options={characteristics.map(
										(characteristic) => ({
											value: characteristic.id,
											label: characteristic.name
										})
									)}
									emptyOption={false}
								/>
							</Col>
							<Col
								xs={12}
								md={6}>
								<NumericField
									id="attendance"
									label="Attendance"
									name="attendance"
									value={formik.values.attendance}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.attendance &&
										Boolean(formik.errors.attendance)
									}
									helperText={
										formik.touched.attendance &&
										formik.errors.attendance
									}
								/>
							</Col>
						</Row>
					</Col>

					{/* Right side - Full height textarea */}
					<Col
						xs={12}
						lg={4}>
						<TextArea
							id="description"
							label="Description"
							name="description"
							value={formik.values.description}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.description &&
								Boolean(formik.errors.description)
							}
							helperText={
								formik.touched.description &&
								formik.errors.description
							}
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
								onClick={() => navigate("/")}>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={formik.isSubmitting}>
								{formik.isSubmitting && (
									<span
										className="spinner-border spinner-border-sm me-2"
										role="status"
										aria-hidden="true"></span>
								)}
								{formik.isSubmitting ? "Creating..." : "Create"}
							</button>
						</div>
					</Col>
				</Row>
			</form>
		</Container>
	);
}
