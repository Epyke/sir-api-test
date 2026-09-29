import express from "express";
import data from "../../mock-data/bd.json" with { type: "json" };
const router = express.Router();

/**
 * GET /courses
 */
router.get("/", (req, res) => {
  res.json(data.courses);
});

/**
 * GET /courses/:id
 */
router.get("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const targetCourse = data.courses.find((c) => c.id === paramId);
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
    data.courses.length > 0
      ? Math.max(...data.courses.map((s) => s.id)) + 1
      : 1;
  const newCourse = {
    id: nextid,
    courseName,
  };
  data.courses.push(newCourse);
  res.status(201).json(newCourse);
});

/**
 * DELETE /courses/:id
 */
router.delete("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = data.courses.findIndex((s) => s.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found course with id:${paramId}` });
    return;
  }
  res.json(...data.courses.splice(index, 1));
});

/**
 * PUT /courses/:id
 */
router.put("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = data.courses.findIndex((c) => c.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found course with id:${paramId}` });
    return;
  }
  const { courseName } = req.body;
  data.courses[index] = {
    id: paramId,
    courseName,
  };
  res.json(data.courses[index]);
});

/**
 * PATCH /courses/:id
 */
router.patch("/:id", (req, res) => {
  const paramId = Number(req.params.id);
  const index = data.courses.findIndex((c) => c.id === paramId);
  if (index === -1) {
    res.status(404).json({ error: `Didn't found courses with id:${paramId}` });
    return;
  }
  const updatedCourse = {
    ...data.courses[index],
    ...req.body,
    id: data.courses[index].id,
  };
  data.courses[index] = updatedCourse;
  res.json(updatedCourse);
});

export default router;
