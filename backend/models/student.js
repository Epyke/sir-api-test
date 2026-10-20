import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      default: null,
    },
    year: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Students = model("students", studentSchema);
