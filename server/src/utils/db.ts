import mongoose from "mongoose";
import "dotenv/config";

export const connect = async () => {
	mongoose.connect("mongodb://localhost:27017/JestDB");
};

export const disconnect = async () => {
	mongoose.connection.close();
};

export const cleanUp = async (model: any) => {
	await model.deleteMany({});
};
