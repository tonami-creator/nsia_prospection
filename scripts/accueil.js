/* =====================================================
   NSIA – Script principal (Accueil)
===================================================== */

/* =========================
   SIMULATION UTILISATEUR CONNECTÉ
   (À supprimer après page Connexion)
========================= */
if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify({
        id: "NSIA-DIR-001",
        role: "DIRECTEUR", // DIRECTEUR | SUPERVISEUR | CE | CC
        statut: "ACTIF"
    }));
}

const user = JSON.parse(localStorage.getItem("user"));

/* =========================
   DOM
========================= */
const menuEmploye = document.getElementById("menuEmploye");
const employeModal = document.getElementById("employeModal");
const closeModal = document.getElementById("closeModal");
const employeForm = document.getElementById("employeForm");
const generatedId = document.getElementById("generatedId");
const roleSelect = document.getElementById("role");

/* =========================
   CONTRÔLE ACCÈS
========================= */
if (user && user.role === "DIRECTEUR") {
    menuEmploye.classList.remove("hidden");
}

/* =========================
   OUVERTURE / FERMETURE MODAL
========================= */
menuEmploye.addEventListener("click", () => {
    employeModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
    employeModal.classList.add("hidden");
    employeForm.reset();
});

/* =========================
   GÉNÉRATION ID
========================= */
function genererIdEmploye(role) {
    const prefix = {
        SUPERVISEUR: "SUP",
        CE: "CE",
        CC: "CC"
    };
    const random = Math.floor(1000 + Math.random() * 9000);
    return `NSIA-${prefix[role]}-${random}`;
}

roleSelect.addEventListener("change", () => {
    if (roleSelect.value) {
        generatedId.value = genererIdEmploye(roleSelect.value);
    } else {
        generatedId.value = "";
    }
});

/* =========================
   CRÉATION EMPLOYÉ
========================= */
employeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const employe = {
        id: generatedId.value,
        nom: document.getElementById("nom").value,
        dateNaissance: document.getElementById("dob").value,
        telephone: document.getElementById("tel").value,
        email: document.getElementById("email").value,
        role: roleSelect.value,
        statut: "ACTIF",
        creePar: user.id,
        dateCreation: new Date().toISOString()
    };

    const employes = JSON.parse(localStorage.getItem("employes")) || [];
    employes.push(employe);
    localStorage.setItem("employes", JSON.stringify(employes));

    alert("Employé créé avec succès");

    employeForm.reset();
    employeModal.classList.add("hidden");
});
