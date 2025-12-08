// src/models/session.ts
import mongoose, { Schema, Model } from "mongoose";

const SessionSchema = new Schema({
  sid: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deviceKey: { type: String, default: null },
  ua: { type: String, default: "" },
  ip: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  meta: { type: Schema.Types.Mixed, default: {} },
}, { versionKey: false });

const Session = (mongoose.models.Session as Model<any>) || mongoose.model("Session", SessionSchema);
export default Session;
