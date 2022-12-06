import mongoose, { Schema } from "mongoose";

interface IUser {
	firstName: string;
	lastName: string;
	middleInitial?: string;
	email: string;
	password: string;
	username: string;
	createdAt?: string;
	avatar: string;
}

const userSchema = new Schema<IUser>({
	firstName: {
		type: String,
		required: true,
	},
	middleInitial: {
		type: String,
	},
	lastName: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		required: true,
	},
	createdAt: {
		type: String,
		default: Date(),
	},
});

userSchema.virtual("fullName").get(function () {
	return `${
		this.firstName
	} ${this.middleInitial ? this.middleInitial + "." : ""} ${this.lastName}`;
});

userSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (_doc, ret) {
		delete ret._id;
		delete ret.password;
	},
});

const User = mongoose.model("User", userSchema);
export default User;
