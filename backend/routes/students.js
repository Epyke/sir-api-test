import express from "express";
import data from "../../mock-data/bd.json" with { type: "json" };
const router = express.Router();

/**
 * GET /students
 */
router.get("/", (req, res) => {
  res.json(data.students);
});

/**
 * GET /students/:id
 */
router.get("/:id", (req, res) => {
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
router.post("/", (req, res) => {
  const { name, lastName, courseId, year, age } = req.body;
  //Review later
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
router.delete("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = data.students.findIndex((s) => s.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with id:${paramId}` });
    return;
  }
  res.json(...data.students.splice(index, 1));
});

/**
 * PUT /students/:id
 */
router.put("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = data.students.findIndex((stu) => stu.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with id:${paramId}` });
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
router.patch("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = data.students.findIndex((stu) => stu.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found student with id:${paramId}` });
    return;
  }
  //Review later
  const updatedStudent = {
    ...data.students[index],
    ...req.body,
    id: data.students[index].id,
  };
  data.students[index] = updatedStudent;
  res.json(updatedStudent);
});
export default router;
