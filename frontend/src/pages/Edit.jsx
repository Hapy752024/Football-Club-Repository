import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import createAxiosInstance from "./Axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import { Typography } from "@mui/material";
import AlphaNumericField from "../components/Form/AlphaNumericField";
import SingleItemSelector from "../components/Form/SingleItemSelector";
import MultiItemSelector from "../components/Form/MultiItemSelector";
import NumericField from "../components/Form/NumericField";
import TextArea from "../components/Form/TextArea";
import MyToasterBox from "../components/Form/MyToasterBox";
import ImageUpload from "../components/Image/ImageUpload";

export default function Edit() {
	const [club, setClub] = useState({
		name: "",
		league: "",
		country: "",
		city: "",
		characteristics: [],
		attendance: 0,
		description: "",
		images: [] // Initialize images state
	});
	const [countries, setCountries] = useState([]);
	const [leagues, setLeagues] = useState([]);
	const [characteristics, setCharacteristics] = useState([]);
	const [toastMessage, setToastMessage] = useState(null);
	const [images, setImages] = useState([]); // State to hold newly uploaded images for upload
	const [imagesToDelete, setImagesToDelete] = useState([]); // State to hold images to delete
	const [isLoading, setIsLoading] = useState(true);

	const axiosInstance = createAxiosInstance(); // Create an instance of axios with the base URL and headers

	const params = useParams();
	const clubId = params.id; // Assuming the URL is like /edit/:id

	const navigate = useNavigate();

	const getImageUrls = (images) => {
		if (!Array.isArray(images)) return []; // Handle non-array inputs

		return images
			.map((image) => {
				if (!image?.image) return null; // Skip if missing

				// If already a full URL (starts with http/https)
				if (
					typeof image.image === "string" &&
					/^https?:\/\//.test(image.image)
				) {
					return image.image;
				}

				// If it's a relative path, prepend your media URL (adjust based on your backend)
				if (typeof image.image === "string") {
					return `${process.env.REACT_APP_MEDIA_URL || ""}${
						image.image
					}`;
				}

				return null; // Fallback
			})
			.filter(Boolean); // Remove null/undefined values
	};

	const handleImagesChange = (newImages) => {
		console.log("Images received from ImageUpload:", newImages);
		setImages(newImages);
	};

	// Parent passes this handler to ImageUpload
	const handleDeleteImage = async (imageId) => {
		setImagesToDelete((prev) => [...prev, imageId]);
		// Optimistic UI update
		setClub((prev) => ({
			...prev,
			images: prev.images.filter((img) => img.id !== imageId)
		}));
	};

	const deleteMarkedImages = async () => {
		// Sequential deletion with error collection
		const results = [];
		for (const imageId of imagesToDelete) {
			try {
				await axiosInstance.delete(`/club-images/${imageId}/`);
				results.push({ success: true, imageId });
			} catch (error) {
				results.push({ success: false, imageId, error });
			}
		}
		return results;
	};

	const getData = async () => {
		setIsLoading(true);
		try {
			const clubRes = await axiosInstance.get(
				`/football-club/${clubId}/`
			);
			setClub(clubRes.data);
			console.log("Club data fetched:", clubRes.data);

			const countriesRes = await axiosInstance.get(`/country/`);
			setCountries(countriesRes.data);

			const leaguesRes = await axiosInstance.get(`/league/`);
			setLeagues(leaguesRes.data);

			const characteristicsRes = await axiosInstance.get(
				`/characteristics/`
			);
			setCharacteristics(characteristicsRes.data);
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
			.matches(
				/^[\p{L}\s,.-]+$/u,
				"City name can only contain letters, spaces, commas, periods, and hyphens"
			),
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
			name: club.name || "",
			league: club.league?.id || "",
			country: club.country?.id || "",
			city: club.city || "",
			characteristics: club.characteristics || [],
			attendance: club.attendance || 0,
			description: club.description || ""
		},
		enableReinitialize: true,
		validationSchema: validationSchema,
		validateOnBlur: true,
		onSubmit: async (values) => {
			try {
				// 1. Prepare FormData
				const formData = new FormData();

				// Append simple fields
				formData.append("name", values.name);
				formData.append("league", values.league);
				formData.append("country", values.country);
				formData.append("city", values.city);
				formData.append("attendance", values.attendance);
				formData.append("description", values.description || "");

				// Append array fields
				values.characteristics.forEach((item) => {
					formData.append("characteristics", item);
				});

				// Append uploaded images with validation
				if (images && images.length > 0) {
					images.forEach((image) => {
						if (image instanceof File || image instanceof Blob) {
							formData.append("newly_uploaded_images", image);
						} else {
							console.warn(
								"Skipping invalid image format:",
								image
							);
						}
					});
				}

				// 2. First update club data
				const postRes = await axiosInstance.put(
					`/football-club/${clubId}/`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data"
						}
					}
				);
				console.log("Post response:", postRes);

				// 3. Then delete marked images
				if (imagesToDelete.length > 0) {
					await deleteMarkedImages(imagesToDelete);
					// Clear deletion queue on success
					setImagesToDelete([]);
				}

				if (postRes.status === 201 || postRes.status === 200) {
					setToastMessage(
						<MyToasterBox
							message="Club data successfully!"
							severity="success"
						/>
					);
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

				setTimeout(() => {
					navigate("/", { state: { created: true } });
				}, 3000);
			} catch (error) {
				// Handle rollback if needed
				console.error("Submission failed:", error);
			}
		}
	});

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		console.log("Club - use effect data", club);
	}, [club]);

	return (
		<Container fluid>
			<form onSubmit={formik.handleSubmit}>
				<Row className="mb-4">
					<Col xs={12}>
						<Box className="TopBar">
							<EditIcon />
							<Typography
								sx={{ marginLeft: "10px", fontWeight: "bold" }}
								variant="subtitle2">
								Welcome to the Edit Page
							</Typography>
						</Box>
					</Col>
				</Row>

				<Row className="mb-4">
					<Col xs={12}>{toastMessage}</Col>
				</Row>

				<Row className="mb-4">
					<Col xs={12}>
						{
							<ImageUpload
								existingImages={club.images || []}
								onImagesChange={handleImagesChange}
								onDeleteImage={handleDeleteImage}
								maxImages={5}
							/>
						}
					</Col>
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
								<AlphaNumericField
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
								<AlphaNumericField
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
								{formik.isSubmitting
									? "Saving changes ..."
									: "Save changes"}
							</button>
						</div>
					</Col>
				</Row>
			</form>
		</Container>
	);
}
