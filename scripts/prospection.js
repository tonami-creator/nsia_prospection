/* =====================================================
   NSIA – Gestion des Prospects avec Backend
===================================================== */

// DOM
const prospectForm = document.getElementById("prospectForm");
const prospectTable = document.getElementById("prospectTable").querySelector("tbody");

// Liste de prospects (sera remplie depuis le backend)
let prospects = [];

// =========================
// Générer ID Prospect
// =========================
function genererIdProspect() {
    return 'PRO-' + Math.floor(1000 + Math.random() * 9000);
}

// =========================
// AFFICHER les prospects dans le tableau
// =========================
function renderProspects() {
    prospectTable.innerHTML = '';
    prospects.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nom}</td>
            <td>${p.telephone}</td>
            <td>${p.typeEngin}</td>
            <td>${p.dateDebut}</td>
            <td>${p.dateFin}</td>
            <td>${p.lieu}</td>
            <td>${p.details}</td>
            <td>
                <button class="edit-btn" onclick="editProspect('${p.id}')">Modifier</button>
                <button class="delete-btn" onclick="deleteProspect('${p.id}')">Supprimer</button>
            </td>
        `;
        prospectTable.appendChild(tr);
    });
}

// =========================
// CHARGER tous les prospects depuis le backend
// =========================
async function fetchProspects() {
    try {
        const response = await fetch("http://localhost:5000/api/prospects");
        const data = await response.json();
        prospects = data;
        renderProspects();
    } catch (err) {
        console.error("Erreur chargement prospects :", err);
    }
}

// =========================
// AJOUTER un prospect
// =========================
prospectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dateDebut = document.getElementById("dateDebut").value;
    const dateFin = document.getElementById("dateFin").value;

    if (new Date(dateFin) < new Date(dateDebut)) {
        alert("La Date Fin ne peut pas être antérieure à la Date Début.");
        return;
    }

    const nouveauProspect = {
        id: genererIdProspect(),
        nom: document.getElementById("nomProspect").value.trim(),
        telephone: document.getElementById("telProspect").value.trim(),
        typeEngin: document.getElementById("typeEngin").value,
        dateDebut: dateDebut,
        dateFin: dateFin,
        lieu: document.getElementById("lieu").value.trim(),
        details: document.getElementById("details").value.trim()
    };

    try {
        const res = await fetch("http://localhost:5000/api/prospects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nouveauProspect)
        });

        if (res.ok) {
            await fetchProspects(); // recharge la liste après ajout
            prospectForm.reset();
        } else {
            console.error("Erreur création prospect :", await res.text());
        }
    } catch (err) {
        console.error("Erreur création prospect :", err);
    }
});

// =========================
// SUPPRIMER un prospect
// =========================
async function deleteProspect(id) {
    if (!confirm("Confirmer la suppression ?")) return;

    try {
        const res = await fetch(`http://localhost:5000/api/prospects/${id}`, {
            method: "DELETE"
        });
        if (res.ok) {
            await fetchProspects(); // recharge la liste après suppression
        } else {
            console.error("Erreur suppression prospect :", await res.text());
        }
    } catch (err) {
        console.error("Erreur suppression prospect :", err);
    }
}

// =========================
// Modifier un prospect (pré-remplir form)
// =========================
function editProspect(id) {
    const prospect = prospects.find(p => p.id === id);
    if (!prospect) return;

    document.getElementById("nomProspect").value = prospect.nom;
    document.getElementById("telProspect").value = prospect.telephone;
    document.getElementById("typeEngin").value = prospect.typeEngin;
    document.getElementById("dateDebut").value = prospect.dateDebut;
    document.getElementById("dateFin").value = prospect.dateFin;
    document.getElementById("lieu").value = prospect.lieu;
    document.getElementById("details").value = prospect.details;

    // Supprimer l’ancien prospect avant réinsertion
    fetch(`http://localhost:5000/api/prospects/${id}`, { method: "DELETE" })
        .then(() => fetchProspects())
        .catch(err => console.error("Erreur suppression temporaire :", err));
}

// =========================
// INITIALISATION
// =========================
fetchProspects();
