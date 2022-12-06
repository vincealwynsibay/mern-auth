import mongoose from "mongoose";

function connectDB() {
	const MONGO_URI =
		process.env.NODE_ENV === "production"
			? process.env.MONGO_PROD_URI
			: process.env.MONGO_URI;

	mongoose
		.connect(MONGO_URI!)
		.then(() => {
			console.log("[server] Database connection established");
		})
		.catch(() => {
			console.log("[server] Database connection error");
		});
}

export default connectDB;
