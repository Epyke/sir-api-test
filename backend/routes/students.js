import express from "express";
import { Students } from "../models/student.js";
const router = express.Router();

/**
 * GET /students
 */
router.get("/", async (req, res) => {
  try {
    const students = await Students.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /students/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const stu = await Students.findById(req.params.id);
    if (!stu) {
      res
        .status(404)
        .json({ error: `Didn't found student with id:${req.params.id}` });
      return;
    }
    res.json(stu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /students
 */
router.post("/", async (req, res) => {
  try {
    const { name, lastName, courseId, year, age } = req.body;
    const newStudent = await Students.create({
      name,
      lastName,
      courseId,
      year,
      age,
    });
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /students/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Students.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res
        .status(404)
        .json({ error: `Didn't found student with id:${req.params.id}` });
      return;
    }
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /students/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, lastName, courseId, year, age } = req.body;
    const replaced = await Students.findOneAndReplace(
      { _id: req.params.id },
      { name, lastName, courseId, year, age },
      { new: true, runValidators: true },
    );
    if (!replaced) {
      res
        .status(404)
        .json({ error: `Didn't found student with id:${req.params.id}` });
      return;
    }
    res.json(replaced);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PATCH /students/:id
 */
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Students.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res
        .status(404)
        .json({ error: `Didn't found student with id:${req.params.id}` });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
