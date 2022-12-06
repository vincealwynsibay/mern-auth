import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import authRoute from "./routes/auth";
import errorHandler from "./utils/errorHandler";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/ping", (_req, res) => {
	res.json("pong");
});

app.use("/auth", authRoute);

app.use(errorHandler);
export default app;
