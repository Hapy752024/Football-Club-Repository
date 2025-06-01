import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

function Home() {
	const location = useLocation();

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
	}, [location.state]);

	return (
		<div>
			<h1>Welcome to the Home Page</h1>
			<p>This is the home page of our application.</p>
		</div>
	);
}

export default Home;
