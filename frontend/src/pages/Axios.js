
import axios from "axios";

const baseUrl = "http://localhost:8000/api";
const isDevelopment = import.meta.env.MODE === "development";
const baseUrl2 = isDevelopment
	? import.meta.env.VITE_API_BASE_URL_LOCAL
	: import.meta.env.VITE_API_BASE_URL_PROD;


const createAxiosInstance = (isFileUpload = false) => {
	console.log("Local URL:", import.meta.env.VITE_API_BASE_URL_LOCAL);
	console.log("Prod URL:", import.meta.env.VITE_API_BASE_URL_PROD);
	console.log(" Mode: ", import.meta.env.MODE)

	const config = {
		baseURL: baseUrl2,
		timeout: 30000,
		headers: {
			Accept: "application/json"
		}
	};

	// Only set Content-Type for non-file uploads (JSON)
	if (!isFileUpload) {
		config.headers["Content-Type"] = "application/json";
	}

	return axios.create(config);
};

export default createAxiosInstance;
