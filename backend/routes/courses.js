import express from "express";
import { Courses } from "../models/course.js";
const router = express.Router();

/**
 * GET /courses
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Courses.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /courses/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const targetCourse = await Courses.findById(req.params.id);
    if (!targetCourse) {
      res
        .status(404)
        .json({ error: `Didn't found course with id:${req.params.id}` });
      return;
    }
    res.json(targetCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /courses
 */
router.post("/", async (req, res) => {
  try {
    const { courseName } = req.body;
    const newCourse = await Courses.create({ courseName });
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /courses/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Courses.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res
        .status(404)
        .json({ error: `Didn't found course with id:${req.params.id}` });
      return;
    }
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /courses/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const { courseName } = req.body;
    const replaced = await Courses.findOneAndReplace(
      { _id: req.params.id },
      { courseName },
      { returnDocument: "after", runValidators: true },
    );
    if (!replaced) {
      res
        .status(404)
        .json({ error: `Didn't found course with id:${req.params.id}` });
      return;
    }
    res.json(replaced);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PATCH /courses/:id
 */
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Courses.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updated) {
      res
        .status(404)
        .json({ error: `Didn't found course with id:${req.params.id}` });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
