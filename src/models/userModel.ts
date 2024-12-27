import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  contact: number;
  password: string;
  role: "owner" | "accountant";
  associatedBusinesses: mongoose.Types.ObjectId[];
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: {type: Number , required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "accountant"], default: "owner" },
  associatedBusinesses: [{ type: mongoose.Types.ObjectId, ref: "Business" }],
  forgotPasswordToken: { type: String },
  forgotPasswordTokenExpiry: { type: Date },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },
});

export default models.User || model<IUser>("User", userSchema);
