
// import { Schema, model, models, Document } from 'mongoose';

// export interface DayPlan {
//   day: number;
//   title: string;
//   reading: string;
//   mcq: {
//     question: string;
//     options: string[];
//     answer: string;
//   }[];
// }

// export interface CurrentPlan {
//   topic: string;
//   currentDay: number;
//   plan: DayPlan[];
// }



// export interface IUser extends Document {
//   email: string;
//   name?: string;
//   occupation?: string;
//   currPlan?: CurrentPlan;
//   completedMcqs: Map<number, number>;
//   milestones: string;
//   league: 'Ivory' | 'Silver' | 'Gold' | 'Platinum' | 'None';
//   createdAt: Date;
//   updatedAt: Date;
// }

// const userSchema = new Schema<IUser>(
//   {
//     email: { type: String, required: true, unique: true },
//     name: { type: String },
//     occupation: { type: String },
//     currPlan: {
//       topic: String,
//       currentDay: { type: Number, default: 1 },
//       plan: [
//         {
//           day: Number,
//           title: String,
//           reading: String,
//           mcq: [
//             {
//               question: String,
//               options: [String],
//               answer: String,
//             },
//           ],
//         },
//       ],
//     },
//     completedMcqs: {
//       type: Map,
//       of: Number,
//       default: {},
//     },
//     milestones: [
//       {
//         title: String,
//         number: Number,
//       },
//     ],
//     league: {
//       type: String,
//       enum: ['Ivory', 'Silver', 'Gold', 'Platinum', 'None'],
//       default: 'None',
//     },
//   },
//   { timestamps: true }
// );

// export default models.User || model<IUser>('User', userSchema);
import { Schema, model, models, Document } from 'mongoose';

export interface DayPlan {
  day: number;
  title: string;
  reading: string;
  mcq: {
    question: string;
    options: string[];
    answer: string;
  }[];
  isCompleted: boolean;
}

export interface CurrentPlan {
  topic: string;
  currentDay: number;
  plan: DayPlan[];
}

export interface IUser extends Document {
  email: string;
  name?: string;
  occupation?: string;
  currPlan?: CurrentPlan;
  milestones: string;
  league: 'Ivory' | 'Silver' | 'Gold' | 'Platinum' | 'None';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    occupation: { type: String },
    currPlan: {
      topic: String,
      currentDay: { type: Number, default: 1 },
      plan: [
        {
          day: Number,
          title: String,
          reading: String,
          mcq: [
            {
              question: String,
              options: [String],
              answer: String,
            },
          ],
          isCompleted: { type: Boolean, default: false },
        },
      ],
    },
    milestones: { type: String, default: '' },
    league: {
      type: String,
      enum: ['Ivory', 'Silver', 'Gold', 'Platinum', 'None'],
      default: 'None',
    },
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', userSchema);