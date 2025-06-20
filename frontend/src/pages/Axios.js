import axios from "axios";

const createAxiosInstance = (isFileUpload = false) => {
	const config = {
		baseURL: "http://localhost:8000/api",
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
