async function showStudents() {
  try {
    const studentsDiv = document.getElementById("studentsList");
    studentsDiv.replaceChildren();
    const response = await fetch("http://localhost:3000/students");
    const students = await response.json();
    students.forEach((stu) => {
      const newDiv = document.createElement("div");
      newDiv.textContent = `${stu.name} ${stu.lastName} ${stu.age}`;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Apagar";
      deleteButton.addEventListener("click", () => deleteStudent(stu.id));
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
      deleteButton.addEventListener("click", () => deleteCourse(c.id));
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

  newStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(newStudentForm);
    const payload = Object.fromEntries(formData.entries());
    try {
      await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      newStudentDialog.close();
      showStudents();
    } catch (e) {
      console.error("Fetch operation failed:", e);
      alert("Erro ao processar o pedido. Tente novamente.");
    }
  });

  newCourseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(newCourseForm);
    const payload = Object.fromEntries(formData.entries());
    try {
      await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      newCourseDialog.close();
      showCourses();
    } catch (e) {
      console.error("Fetch operation failed:", e);
      alert("Erro ao processar o pedido. Tente novamente.");
    }
  });

  newStudentButton.addEventListener("click", () => {
    newStudentDialog.showModal();
    showCoursesOptions();
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
