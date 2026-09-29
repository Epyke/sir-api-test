async function showStudents() {
  const alunosDiv = document.getElementById("alunos");
  alunosDiv.replaceChildren();
  const response = await fetch("http://localhost:3000/students");
  const students = await response.json();
  students.forEach((stu) => {
    const newDiv = document.createElement("div");
    newDiv.textContent = `${stu.name} ${stu.lastName} ${stu.age}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Apagar";
    deleteButton.addEventListener("click", () => deleteStudents(stu.id));
    newDiv.appendChild(deleteButton);
    alunosDiv.appendChild(newDiv);
  });
}

async function deleteStudents(idStudent) {
  await fetch(`http://localhost:3000/students/${idStudent}`, {
    method: "DELETE",
  });
  showStudents();
}

showStudents();
