import  { Schema, Document, models, model } from 'mongoose';

export interface DayPlan {
  day: number;
  title: string;
  reading: string;
  ytLinks: string[];
  mcq: string[];
}

export interface CurrentPlan {
  topic: string;
  currentDay: number;
  plan: DayPlan[];
}

export interface IUser extends Document {
  email: string;
  verified: boolean;
  name?: string;
//   age?: number;
  occupation?: string;
  currPlan?: CurrentPlan;
  milestones: number;
  league: 'Ivory' | 'Silver' | 'Gold' | 'Platinum' | 'None';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    // verified: { type: Boolean, default: false },
    name: { type: String },
    // age: { type: Number },
    occupation: { type: String },
    currPlan: {
      topic: { type: String },
      currentDay: { type: Number, default: 1 },
      plan: [
        {
          day: { type: Number },
          title: { type: String },
          reading: { type: String },
          ytLinks: [{ type: String }],
          mcq: [{ type: String }],
        },
      ],
    },
    milestones: { type: Number, default: 0 },
    league: {
      type: String,
      enum: ['Ivory', 'Silver', 'Gold', 'Platinum', 'None'],
      default: 'None',
    },
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', userSchema);
