import mongoose from "mongoose";
import request from "supertest";
// import { connect } from "../utils/mongoose";
import User from "../models/User";
import "dotenv/config";
import app from "../app";

describe("Auth API", () => {
	beforeEach(async () => {
		await mongoose.connect(process.env.MONGO_URI!);
	});

	afterAll(async () => {
		await User.deleteMany({});
		await mongoose.connection.close();
	});

	it("should return all users", async () => {
		const res = await request(app).get("/auth");
		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBeGreaterThan(0);
	});

	it("should register a user", async () => {
		const res = await request(app).post("/auth/register").send({
			email: "test1@test.com",
			password: "test1",
			username: "test1",
			firstName: "test",
			lastName: "1",
			middleInitial: "",
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.ok).toBe(true);
	});

	it("should authenticate a user", async () => {
		const res = await request(app).post("/auth/login").send({
			email: "test1@test.com",
			password: "test1",
		});

		expect(res.status).toBe(200);
		expect(res.body.user).toBeDefined();
		expect(res.body.token).toBeDefined();
	});

	// get current user
	it("should get current user", async () => {
		const res = await request(app)
			.get("/auth/me")
			.set(
				"Authorization",
				`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzhmMzZmOTk2MzNmZmEwZDhhOWNkYmQiLCJpYXQiOjE2NzAzMzAxMTgsImV4cCI6MTY3MDkzNDkxOH0.PfcKvmU3kez3E0RUILwfhN84NBEc7ffbuTVYAeyWQoY`
			);
		expect(res.status).toBe(200);
		expect(res.body.user).toBeDefined();
	});
});
