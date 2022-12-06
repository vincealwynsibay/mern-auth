import { Request, Response } from "express";
import ExpressError from "../utils/ExpressError";
import User from "../models/User";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import { IGetUserAuthRequest } from "../types";

const register = async (req: Request, res: Response) => {
	const {
		email,
		password,
		username,
		firstName,
		lastName,
		middleInitial = "",
	} = req.body;

	const user = await User.findOne({ email });

	if (user) {
		throw new ExpressError("Email already taken", 400);
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const avatar = await gravatar.url(
		email,
		{ s: "100", r: "x", d: "retro" },
		true
	);

	const newUser = new User({
		firstName,
		middleInitial,
		lastName,
		username,
		email,
		password: passwordHash,
		avatar,
	});

	await newUser.save();
	return res.json({ ok: true });
};

const authenticate = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		throw new ExpressError(`User not found`, 400);
	}

	console.log("user ", user);

	const isValid = await bcrypt.compare(password, user.password);

	console.log("isValid ", isValid);
	if (!isValid) {
		throw new ExpressError(`Invalid email or password`, 400);
	}

	const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});
	console.log("token ", token);

	return res.json({ user, token });
};

const getCurrent = async (req: IGetUserAuthRequest, res: Response) => {
	return res.json({ user: req.user });
};

const getAll = async (_req: Request, res: Response) => {
	const users = await User.find({});
	return res.json(users);
};

const getById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = await User.findById(id);
	return res.json(user);
};

const _delete = async (req: Request, res: Response) => {
	const { id } = req.params;
	await User.findByIdAndDelete(id);
	return res.json({ ok: true });
};

const update = async (req: Request, res: Response) => {
	const { id } = req.params;

	const user = await User.findById(id);

	if (!user) {
		throw new ExpressError(`User ${id} does not exist`, 400);
	}

	const userParams = req.body;

	if (await User.findOne({ username: userParams.username })) {
		throw new ExpressError(` ${userParams.username} already taken`, 400);
	}

	if (await User.findOne({ email: userParams.email })) {
		throw new ExpressError(` ${userParams.username} already taken`, 400);
	}

	if (userParams.password) {
		userParams.password = await bcrypt.hash(userParams.password, 10);
	}

	Object.assign(user, userParams);

	await user.save();

	return res.json(user);
};

export default {
	register,
	authenticate,
	getAll,
	getById,
	getCurrent,
	_delete,
	update,
};
