import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IGuide extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
 aadhaar: { type: String, required: true }
 pan: { type: String, required: true }
  city?: string;
  state?: string;
  country?: string;
  languages: string[];
  specialty: string[];
  pricePerDay: number;
  experienceYears?: number;
  bio?: string;
  verified: boolean;
  rating: number;
  createdAt: Date;
}

const GuideSchema = new Schema<IGuide>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    aadhaar: { type: String, required: true },
    pan: { type: String, required: true },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },

    languages: { type: [String], default: [] },
    specialty: { type: [String], default: [] },

    pricePerDay: { type: Number, default: 0 },
    experienceYears: { type: Number, default: 0 },
    bio: { type: String, default: '' },

    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'guides' }
);

// Prevent model overwrite during hot reloads
export default models.Guide || model<IGuide>('Guide', GuideSchema);
