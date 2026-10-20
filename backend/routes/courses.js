import express from "express";
import { Courses } from "../models/course.js";
const router = express.Router();

/**
 * GET /courses
 */
router.get("/", (req, res) => {
  res.json(Courses);
});

/**
 * GET /courses/:id
 */
router.get("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const targetCourse = Courses.find((c) => c.id === paramId);
  if (targetCourse) {
    res.json(targetCourse);
    return;
  }
  res.status(404).json({ error: `Didn't found course with id:${paramId}` });
});

/**
 * POST /courses
 */
router.post("/", (req, res) => {
  const { courseName } = req.body;
  const nextid =
    Courses.length > 0 ? Math.max(...Courses.map((s) => s.id)) + 1 : 1;
  const newCourse = {
    id: nextid,
    courseName,
  };
  Courses.push(newCourse);
  res.status(201).json(newCourse);
});

/**
 * DELETE /courses/:id
 */
router.delete("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = Courses.findIndex((s) => s.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found course with id:${paramId}` });
    return;
  }
  res.json(...Courses.splice(index, 1));
});

/**
 * PUT /courses/:id
 */
router.put("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = Courses.findIndex((c) => c.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found course with id:${paramId}` });
    return;
  }
  const { courseName } = req.body;
  Courses[index] = {
    id: paramId,
    courseName,
  };
  res.json(Courses[index]);
});

/**
 * PATCH /courses/:id
 */
router.patch("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = Courses.findIndex((c) => c.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found courses with id:${paramId}` });
    return;
  }
  const updatedCourse = {
    ...Courses[index],
    ...req.body,
    id: Courses[index].id,
  };
  Courses[index] = updatedCourse;
  res.json(updatedCourse);
});

export default router;
