const BASE_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function getStudents() {
  return request("/students");
}

async function getCourses() {
  return request("/courses");
}

async function postStudent(payload) {
  return request("/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function postCourse(payload) {
  return request("/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function putStudents(idStudent, payload) {
  return request(`/students/${idStudent}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function putCourses(idCourse, payload) {
  return request(`/courses/${idCourse}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function patchStudent(idStudent, payload) {
  return request(`/students/${idStudent}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

async function deleteStudent(idStudent) {
  return request(`/students/${idStudent}`, { method: "DELETE" });
}

async function deleteCourse(idCourse) {
  return request(`/courses/${idCourse}`, { method: "DELETE" });
}

async function showStudents() {
  const studentsDiv = document.getElementById("studentsList");
  studentsDiv.replaceChildren();
  const students = await getStudents();
  const courses = await getCourses();
  students.forEach((stu) => {
    const newDiv = document.createElement("div");
    const stuCourse = courses.find((c) => c.id == stu.courseId);
    newDiv.textContent = `${stu.name} ${stu.lastName} | ${stu.age} anos | ${stuCourse === undefined ? "Sem Curso" : stuCourse.courseName} `;
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.textContent = "Apagar";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => openEditStudent(stu));
    deleteButton.addEventListener("click", () => handleDeleteStudents(stu.id));
    newDiv.appendChild(editButton);
    newDiv.appendChild(deleteButton);
    studentsDiv.appendChild(newDiv);
  });
}

async function showCourses() {
  const coursesDiv = document.getElementById("coursesList");
  coursesDiv.replaceChildren();
  const courses = await getCourses();
  courses.forEach((c) => {
    const newDiv = document.createElement("div");
    newDiv.textContent = `${c.courseName} `;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Apagar";
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    deleteButton.addEventListener("click", () => handleDeleteCourses(c.id));
    editButton.addEventListener("click", () => openEditCourse(c));
    newDiv.appendChild(editButton);
    newDiv.appendChild(deleteButton);
    coursesDiv.appendChild(newDiv);
  });
}

async function showCoursesOptions() {
  const courseSelect = document.getElementById("cursosSelect");
  courseSelect.replaceChildren();
  const courses = await getCourses();
  if (courses.length === 0) {
    return false;
  }
  courses.forEach((c) => {
    const newOption = document.createElement("option");
    newOption.textContent = c.courseName;
    newOption.value = c.id;
    courseSelect.appendChild(newOption);
  });
  return true;
}

async function openEditStudent(student) {
  document.getElementById("newStudentForm").reset();
  await showCoursesOptions();
  document.getElementById("studentId").value = student.id;
  document.getElementById("studentName").value = student.name;
  document.getElementById("studentLastname").value = student.lastName;
  document.getElementById("studentAge").value = student.age;
  document.getElementById("cursosSelect").value = student.courseId;
  document.getElementById("studentYear").value = student.year;
  document.getElementById("studentModalTitle").textContent = "Editar Aluno";
  document.getElementById("studentSubmitButton").textContent = "Editar";
  document.getElementById("newStudentDialog").showModal();
}

function openEditCourse(course) {
  document.getElementById("newCourseForm").reset();
  document.getElementById("courseId").value = course.id;
  document.getElementById("courseName").value = course.courseName;
  document.getElementById("courseModalTitle").textContent = "Editar Curso";
  document.getElementById("courseSubmitButton").textContent = "Editar";
  document.getElementById("newCourseDialog").showModal();
}

async function handleDeleteStudents(studentId) {
  const confirmed = window.confirm(
    "Tem a certeza que deseja apagar este estudante?",
  );

  if (!confirmed) {
    return;
  }

  await deleteStudent(studentId);
  await showStudents();
}

async function handleDeleteCourses(courseId) {
  const students = await getStudents();
  let targetStudent = [];
  students.forEach((s) => {
    if (s.courseId == courseId) {
      targetStudent.push(s);
    }
  });
  const confirmed = window.confirm(
    targetStudent.length > 0
      ? `Este curso está associado com ${targetStudent.length} alunos, tem a certeza que o deseja apagar ?`
      : "Tem a certeza que deseja apagar este curso?",
  );

  if (!confirmed) {
    return;
  }

  await deleteCourse(courseId);
  if (targetStudent.length > 0) {
    //Promise.all junta as promessas do array targetStudent numa só
    await Promise.all(
      targetStudent.map((s) => patchStudent(s.id, { courseId: null })),
    );
  }
  await showCourses();
  await showStudents();
}

function initEventListeners() {
  const newStudentDialog = document.getElementById("newStudentDialog");
  const newCourseDialog = document.getElementById("newCourseDialog");

  const newStudentButton = document.getElementById("newStudentButton");
  const newCourseButton = document.getElementById("newCourseButton");

  const newStudentForm = document.getElementById("newStudentForm");
  const newCourseForm = document.getElementById("newCourseForm");

  const exitStudentDialogButton = document.getElementById(
    "exitStudentDialogButton",
  );
  const exitCourseDialogButton = document.getElementById(
    "exitCourseDialogButton",
  );

  newCourseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(newCourseForm);
    const { id, ...payload } = Object.fromEntries(formData.entries());
    try {
      if (id) {
        await putCourses(id, payload);
      } else {
        await postCourse(payload);
      }
      newCourseDialog.close();
      await showCourses();
      await showStudents();
    } catch (e) {
      console.error("Fetch operation failed:", e);
      alert("Erro ao processar o pedido. Tente novamente.");
    }
  });

  newStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(newStudentForm);
    const { id, ...payload } = Object.fromEntries(formData.entries());
    payload.age = Number(payload.age);
    try {
      if (id) {
        await putStudents(id, payload);
      } else {
        await postStudent(payload);
      }
      newStudentDialog.close();
      await showStudents();
    } catch (e) {
      console.error("Fetch operation failed:", e);
      alert("Erro ao processar o pedido. Tente novamente.");
    }
  });

  newStudentButton.addEventListener("click", async () => {
    newStudentForm.reset();
    const hasCourses = await showCoursesOptions();
    if (!hasCourses) {
      alert("Não há cursos disponiveis, crie um primeiro e tente novamente.");
      return;
    }
    document.getElementById("studentId").value = "";
    document.getElementById("studentModalTitle").textContent = "Criação Aluno";
    document.getElementById("studentSubmitButton").textContent = "Criar";
    newStudentDialog.showModal();
  });

  newCourseButton.addEventListener("click", () => {
    newCourseForm.reset();
    document.getElementById("courseId").value = "";
    document.getElementById("courseModalTitle").textContent = "Criação Curso";
    document.getElementById("courseSubmitButton").textContent = "Criar";
    newCourseDialog.showModal();
  });

  exitStudentDialogButton.addEventListener("click", () => {
    newStudentDialog.close();
  });

  exitCourseDialogButton.addEventListener("click", () => {
    newCourseDialog.close();
  });
}

initEventListeners();
showStudents();
showCourses();
