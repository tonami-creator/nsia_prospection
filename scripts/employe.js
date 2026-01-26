const API_URL = "http://localhost:5000/api/employes";
const token = localStorage.getItem("token"); // Si tu as un login/token

async function fetchEmployes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    employes = data;
    displayEmployes();
  } catch (err) {
    console.error("Erreur fetchEmployes:", err);
  }
}

function displayEmployes() {
  employeTableBody.innerHTML = "";
  employes.forEach(emp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.nom}</td>
      <td>${emp.prenom}</td>
      <td>${emp.dateNaissance}</td>
      <td>${emp.telephone}</td>
      <td>${emp.email}</td>
      <td>${emp.role}</td>
      <td>
          <button class="action-btn edit-btn" onclick="editEmploye('${emp.id}')">Modifier</button>
          <button class="action-btn delete-btn" onclick="deleteEmploye('${emp.id}')">Supprimer</button>
      </td>`;
    employeTableBody.appendChild(row);
  });
}

// Create a new employee
employeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const dateNaissance = document.getElementById("dateNaissance").value;
  const telephone = document.getElementById("telephone").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value;

  const id = generateID();

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nom, prenom, dateNaissance, telephone, email, role })
  });

  fetchEmployes();
  employeForm.reset();
});

async function deleteEmploye(id) {
  if (!confirm("Voulez vraiment supprimer ?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchEmployes();
}

function editEmploye(id) {
  const emp = employes.find(emp => emp.id === id);
  document.getElementById("nom").value = emp.nom;
  document.getElementById("prenom").value = emp.prenom;
  document.getElementById("dateNaissance").value = emp.dateNaissance;
  document.getElementById("telephone").value = emp.telephone;
  document.getElementById("email").value = emp.email;
  document.getElementById("role").value = emp.role;

  employeForm.setAttribute("data-edit-id", id);
}
fetchEmployes();
