import express, { type Response, type Request } from "express";
import data from "../../mock-data/bd.json" with { type: "json" };
import type Student from "../models/students.js";
const router = express.Router();

/**
 * GET /students
 */
router.get("/", (req: Request, res: Response): void => {
  res.json(data.students);
});

/**
 * GET /students/:id
 */
router.get("/:id", (req: Request<{ id: string }>, res: Response): void => {
  const paramId = Number(req.params.id);
  const stu = data.students.find((stu) => stu.id === paramId);
  if (stu) {
    res.json(stu);
    return;
  }
  res.status(404).json({ error: `Didn't found student with id:${paramId}` });
});

/**
 * POST /students
 */
router.post("/", (req: Request, res: Response): void => {
  const { name, lastName, courseId, year, age } = req.body;
  const nextid =
    data.students.length > 0
      ? Math.max(...data.students.map((s) => s.id)) + 1
      : 1;
  const newStudent = {
    id: nextid,
    name,
    lastName,
    courseId,
    year,
    age,
  };
  data.students.push(newStudent);
  res.status(201).json(newStudent);
});

/**
 * DELETE /students/:id
 */
router.delete("/:id", (req: Request<{ id: string }>, res: Response): void => {
  const paramId = Number(req.params.id);
  const index = data.students.findIndex((s) => s.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with ${paramId}` });
    return;
  }
  res.json(...data.students.splice(index, 1));
});

/**
 * PUT /students/:id
 */
router.put("/:id", (req: Request<{ id: string }>, res: Response): void => {
  const paramId = Number(req.params.id);
  const index = data.students.findIndex((stu) => stu.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with ${paramId}` });
    return;
  }
  const { name, lastName, courseId, year, age } = req.body;
  data.students[index] = {
    id: paramId,
    name,
    lastName,
    courseId,
    year,
    age,
  };
  res.json(data.students[index]);
});

/**
 * PATCH /students/:id
 */
router.patch("/:id", (req: Request<{ id: string }>, res: Response): void => {
  const paramId = Number(req.params.id);
  const index = data.students.findIndex((stu) => stu.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with ${paramId}` });
    return;
  }
  const updatedStudent: Student = {
    ...data.students[index],
    ...req.body,
    id: data.students[index]!.id,
  };
  data.students[index] = updatedStudent;
  res.json(updatedStudent);
});
export { router as default };
