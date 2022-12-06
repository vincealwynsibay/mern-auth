import { Request, Response, NextFunction } from "express";
import ExpressError from "./ExpressError";
import jwt from "jsonwebtoken";
import User from "../models/User";

async function verifyAuth(req: Request, _res: Response, next: NextFunction) {
	try {
		let token = req.headers.authorization;

		if (!token) {
			throw new ExpressError("Token not found", 401);
		}

		token = token.split(" ")[1];

		const decoded = await jwt.verify(token, process.env.JWT_SECRET!);

		if (!decoded) {
			throw new ExpressError("Invalid Token", 401);
		}

		(req as any).user = await User.findById(decoded.sub);
		next();
	} catch (err) {
		next(err);
	}
}

export default verifyAuth;
