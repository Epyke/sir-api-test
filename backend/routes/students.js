import express from "express";
import { Students } from "../models/student.js";
const router = express.Router();

/**
 * GET /students
 */
router.get("/", (req, res) => {
  res.json(Students.find());
});

/**
 * GET /students/:id
 */
router.get("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const stu = Students.findById(paramId);
  if (stu) {
    res.json(stu);
    return;
  }
  res.status(404).json({ error: `Didn't found student with id:${paramId}` });
});

/**
 * POST /students
 */
router.post("/", (req, res) => {
  const { name, lastName, courseId, year, age } = req.body;
  //Review later
  const nextid =
    Students.length > 0 ? Math.max(...Students.map((s) => s.id)) + 1 : 1;
  const newStudent = {
    id: nextid,
    name,
    lastName,
    courseId,
    year,
    age,
  };
  Students.create(newStudent);
  res.status(201).json(newStudent);
});

/**
 * DELETE /students/:id
 */
router.delete("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = Students.findByIdAndDelete(paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with id:${paramId}` });
    return;
  }
  res.json(...Students.splice(index, 1));
});

/**
 * PUT /students/:id
 */
router.put("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = Students.findIndex((stu) => stu.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with id:${paramId}` });
    return;
  }
  const { name, lastName, courseId, year, age } = req.body;
  Students[index] = {
    id: paramId,
    name,
    lastName,
    courseId,
    year,
    age,
  };
  res.json(Students.findOneAndReplace(paramId));
});

/**
 * PATCH /students/:id
 */
router.patch("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = Students.findIndex((stu) => stu.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with id:${paramId}` });
    return;
  }
  //Review later
  const updatedStudent = {
    ...Students[index],
    ...req.body,
    id: Students[index].id,
  };
  res.json(findByIdAndUpdate(paramId, updatedStudent));
});
export default router;
