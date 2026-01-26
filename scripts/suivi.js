/* =====================================================
   NSIA – Gestion des Suivis avec Backend
===================================================== */

const prospectSelect = document.getElementById("prospectSelect");
const suiviForm = document.getElementById("suiviForm");
const suiviTable = document.getElementById("suiviTable").querySelector("tbody");

// Données chargées depuis le backend
let prospects = [];
let suivis = [];

// =========================
// Charger prospects pour le select
// =========================
async function fetchProspectsForSelect() {
    try {
        const res = await fetch("http://localhost:5000/api/prospects");
        prospects = await res.json();

        prospectSelect.innerHTML = '<option value="">Sélectionner un prospect</option>';
        prospects.forEach(p => {
            prospectSelect.innerHTML += `<option value="${p.id}">${p.nom} (${p.typeEngin})</option>`;
        });
    } catch (err) {
        console.error("Erreur chargement prospects :", err);
    }
}

// =========================
// Charger tous les suivis
// =========================
async function fetchSuivis() {
    try {
        const res = await fetch("http://localhost:5000/api/suivis");
        suivis = await res.json();
        renderSuivis();
    } catch (err) {
        console.error("Erreur chargement suivis :", err);
    }
}

// =========================
// Affichage des suivis
// =========================
function renderSuivis() {
    suiviTable.innerHTML = '';

    suivis.forEach(s => {
        const prospect = prospects.find(p => p.id === s.prospect_id);
        if (!prospect) return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.prospect_id}</td>
            <td>${prospect.nom}</td>
            <td>${prospect.typeEngin}</td>
            <td>${prospect.dateDebut}</td>
            <td>${prospect.dateFin}</td>
            <td>${s.action}</td>
            <td>${s.observation}</td>
            <td>${s.progression}%</td>
            <td>
                <button class="edit-btn" onclick="editSuivi('${s.prospect_id}', '${s.action}')">Modifier</button>
                <button class="delete-btn" onclick="deleteSuivi('${s.prospect_id}', '${s.action}')">Supprimer</button>
            </td>
        `;
        suiviTable.appendChild(tr);
    });
}

// =========================
// Ajouter / Modifier suivi
// =========================
suiviForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prospectId = prospectSelect.value;
    const action = document.getElementById("actionSuivi").value;
    const observation = document.getElementById("observationSuivi").value;
    const progression = parseInt(document.getElementById("progressionSuivi").value);

    if (!prospectId) {
        alert("Veuillez sélectionner un prospect.");
        return;
    }

    const body = { prospect_id: prospectId, action, observation, progression };

    try {
        const res = await fetch("http://localhost:5000/api/suivis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            await fetchSuivis(); // recharge après ajout/modification
            suiviForm.reset();
        } else {
            console.error("Erreur ajout/modif suivi :", await res.text());
        }
    } catch (err) {
        console.error("Erreur réseau ajout/modif suivi :", err);
    }
});

// =========================
// Supprimer un suivi
// =========================
async function deleteSuivi(prospectId, action) {
    if (!confirm("Confirmer la suppression ?")) return;

    try {
        const res = await fetch(`http://localhost:5000/api/suivis/${prospectId}/${action}`, {
            method: "DELETE"
        });

        if (res.ok) {
            await fetchSuivis(); // recharge après suppression
        } else {
            console.error("Erreur suppression suivi :", await res.text());
        }
    } catch (err) {
        console.error("Erreur réseau suppression suivi :", err);
    }
}

// =========================
// Préremplir suivi pour modification
// =========================
function editSuivi(prospectId, action) {
    const suivi = suivis.find(s => s.prospect_id === prospectId && s.action === action);
    if (!suivi) return;

    prospectSelect.value = suivi.prospect_id;
    document.getElementById("actionSuivi").value = suivi.action;
    document.getElementById("observationSuivi").value = suivi.observation;
    document.getElementById("progressionSuivi").value = suivi.progression;

    // Supprimer l’ancien suivi avant réinsertion
    deleteSuivi(prospectId, action);
}

// =========================
// INITIALISATION
// =========================
fetchProspectsForSelect();
fetchSuivis();
