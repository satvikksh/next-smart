import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IGuideSession extends Document {
  guide: mongoose.Types.ObjectId | string;
  token: string; // access or session token (short-lived)
  refreshToken?: string; // optional refresh token
  createdAt: Date;
  expiresAt: Date;
  revoked?: boolean;
  ip?: string;
  userAgent?: string;
}

const GuideSessionSchema = new Schema<IGuideSession>(
  {
    guide: { type: Schema.Types.ObjectId, ref: 'Guide', required: true, index: true },
    token: { type: String, required: true, unique: true },
    refreshToken: { type: String, default: null },
    revoked: { type: Boolean, default: false },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    expiresAt: { type: Date, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'guide_sessions' }
);

// TTL index: MongoDB will automatically remove expired sessions when expiresAt passes
GuideSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Prevent model overwrite during hot reloads in development
const GuideSessionModel = (models as any).GuideSession || model<IGuideSession>('GuideSession', GuideSessionSchema);

export default GuideSessionModel;
