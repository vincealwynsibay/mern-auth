import express from "express";
import catchAsync from "../utils/catchAsync";
import userController from "../controllers/user";
import verifyAuth from "../utils/jwt";
const router = express.Router();

// auth
router.get("/", (_req, res) => {
	res.json("pong");
});
router.get("/", catchAsync(userController.getAll));
router.post("/register", catchAsync(userController.register));
router.post("/login", catchAsync(userController.authenticate));
router.get("/me", verifyAuth, catchAsync(userController.getCurrent));

export default router;
