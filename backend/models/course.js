import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export const Courses = model("courses", courseSchema);
