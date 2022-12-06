import { Request } from "express";

export interface IGetUserAuthRequest extends Request {
	user?: any;
}
