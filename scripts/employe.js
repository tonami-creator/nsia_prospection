/* =====================================================
   NSIA – Gestion des Employés (Frontend)
===================================================== */

const API_URL = "https://nsiaprospection-production.up.railway.app/api/employes";
const employeForm = document.getElementById("employeForm");
const employeTableBody = document.querySelector("#employeTable tbody");

let employes = [];

// Fonction pour générer un ID unique (EMP-XXXX)
function generateID() {
    return 'EMP-' + Math.floor(1000 + Math.random() * 9000);
}

// Charger les employés
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

// Afficher dans le tableau
function displayEmployes() {
    employeTableBody.innerHTML = "";
    employes.forEach(emp => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.nom}</td>
            <td>${emp.prenom}</td>
            <td>${emp.date_naissance}</td>
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

// Soumission du formulaire (Création ou Update)
employeForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const idToEdit = employeForm.getAttribute("data-edit-id");
    
    const payload = {
        nom: document.getElementById("nom").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        date_naissance: document.getElementById("dateNaissance").value, // Mapping BDD
        telephone: document.getElementById("telephone").value.trim(),
        email: document.getElementById("email").value.trim(),
        role: document.getElementById("role").value,
        motDePasse: "Nsia2024" // Mot de passe par défaut par sécurité
    };

    try {
        let res;
        if (idToEdit) {
            // Mode Modification
            res = await fetch(`${API_URL}/${idToEdit}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } else {
            // Mode Création
            payload.id = generateID();
            res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (res.ok) {
            employeForm.reset();
            employeForm.removeAttribute("data-edit-id");
            document.querySelector(".btn-primary").innerText = "Créer Employé";
            fetchEmployes();
        }
    } catch (err) {
        console.error("Erreur lors de l'enregistrement:", err);
    }
});

async function deleteEmploye(id) {
    if (!confirm("Voulez-vous vraiment supprimer cet employé ?")) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchEmployes();
    } catch (err) {
        console.error("Erreur suppression:", err);
    }
}

function editEmploye(id) {
    const emp = employes.find(e => e.id === id);
    if (!emp) return;

    document.getElementById("nom").value = emp.nom;
    document.getElementById("prenom").value = emp.prenom;
    document.getElementById("dateNaissance").value = emp.date_naissance;
    document.getElementById("telephone").value = emp.telephone;
    document.getElementById("email").value = emp.email;
    document.getElementById("role").value = emp.role;

    employeForm.setAttribute("data-edit-id", id);
    document.querySelector(".btn-primary").innerText = "Mettre à jour l'employé";
}

// Initialisation
fetchEmployes();