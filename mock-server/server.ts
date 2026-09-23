import express from "express";
import studentsRoutes from "./routes/students.js";
import coursesRoutes from "./routes/courses.js";

const app = express();
const PORT = 5001;

app.use("/students", studentsRoutes);
app.use("/courses", coursesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
