async function showStudents() {
  try {
    const studentsDiv = document.getElementById("studentsList");
    studentsDiv.replaceChildren();
    const responseStudents = await fetch("http://localhost:3000/students");
    const students = await responseStudents.json();
    const responseCourses = await fetch("http://localhost:3000/courses");
    const courses = await responseCourses.json();
    students.forEach((stu) => {
      const newDiv = document.createElement("div");
      const stuCourse = courses.find((c) => c.id === stu.courseId);
      newDiv.textContent = `${stu.name} ${stu.lastName} ${stu.age} anos ${stuCourse.courseName}`;
      const deleteButton = document.createElement("button");
      const editButton = document.createElement("button");
      deleteButton.textContent = "Apagar";
      editButton.textContent = "Editar";
      editButton.addEventListener("click", () => openEditStudent(stu));
      deleteButton.addEventListener("click", () => deleteStudent(stu.id));
      newDiv.appendChild(editButton);
      newDiv.appendChild(deleteButton);
      studentsDiv.appendChild(newDiv);
    });
  } catch (e) {
    console.error("Fetch operation failed:", e);
    alert("Erro ao processar o pedido. Tente novamente.");
  }
}

async function showCourses() {
  try {
    const coursesDiv = document.getElementById("coursesList");
    coursesDiv.replaceChildren();
    const response = await fetch("http://localhost:3000/courses");
    const students = await response.json();
    students.forEach((c) => {
      const newDiv = document.createElement("div");
      newDiv.textContent = `${c.courseName}`;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Apagar";
      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      deleteButton.addEventListener("click", () => deleteCourse(c.id));
      editButton.addEventListener("click", () => openEditCourse(c));
      newDiv.appendChild(editButton);
      newDiv.appendChild(deleteButton);
      coursesDiv.appendChild(newDiv);
    });
  } catch (e) {
    console.error("Fetch operation failed:", e);
    alert("Erro ao processar o pedido. Tente novamente.");
  }
}

async function showCoursesOptions() {
  const courseSelect = document.getElementById("cursosSelect");
  courseSelect.replaceChildren();
  try {
    const response = await fetch("http://localhost:3000/courses");
    const courses = await response.json();
    courses.forEach((c) => {
      const newOption = document.createElement("option");
      newOption.textContent = c.courseName;
      newOption.value = c.id;
      courseSelect.appendChild(newOption);
    });
  } catch (e) {
    console.error("Fetch operation failed:", e);
    alert("Erro ao processar o pedido. Tente novamente.");
  }
}

async function deleteStudent(idStudent) {
  try {
    await fetch(`http://localhost:3000/students/${idStudent}`, {
      method: "DELETE",
    });
    showStudents();
  } catch (e) {
    console.error("Fetch operation failed:", e);
    alert("Erro ao processar o pedido. Tente novamente.");
  }
}

async function deleteCourse(idCourse) {
  try {
    await fetch(`http://localhost:3000/courses/${idCourse}`, {
      method: "DELETE",
    });
    showCourses();
  } catch (e) {
    console.error("Fetch operation failed:", e);
    alert("Erro ao processar o pedido. Tente novamente.");
  }
}

function openEditStudent(student) {
  document.getElementById("newStudentForm").reset();
  showCoursesOptions();
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
    const payload = Object.fromEntries(formData.entries());
    try {
      if (payload.id) {
        await fetch(`http://localhost:3000/courses/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:3000/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      newCourseDialog.close();
      showCourses();
    } catch (e) {
      console.error("Fetch operation failed:", e);
      alert("Erro ao processar o pedido. Tente novamente.");
    }
  });

  newStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(newStudentForm);
    const payload = Object.fromEntries(formData.entries());
    try {
      if (payload.id) {
        await fetch(`http://localhost:3000/students/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`http://localhost:3000/students/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      newStudentDialog.close();
      showStudents();
    } catch (e) {
      console.error("Fetch operation failed:", e);
      alert("Erro ao processar o pedido. Tente novamente.");
    }
  });

  newStudentButton.addEventListener("click", () => {
    newStudentForm.reset();
    showCoursesOptions();
    document.getElementById("studentId").value = "";
    document.getElementById("studentModalTitle").textContent = "Criação Aluno";
    document.getElementById("studentSubmitButton").textContent = "Criar";
    newStudentDialog.showModal();
  });

  newCourseButton.addEventListener("click", () => {
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
