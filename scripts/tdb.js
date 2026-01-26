/* =====================================================
   NSIA – Tableau de bord avancé
===================================================== */

const API_PROSPECTS = "http://localhost:5000/api/prospects";
const API_SUIVIS = "http://localhost:5000/api/suivis";
const API_EQUIPE = "http://localhost:5000/api/equipes";
const API_USERS = "http://localhost:5000/api/utilisateurs";

async function fetchAllData() {
  const [prospectsR, suivisR, equipesR, usersR] = await Promise.all([
    fetch(API_PROSPECTS).then(r => r.json()),
    fetch(API_SUIVIS).then(r => r.json()),
    fetch(API_EQUIPE).then(r => r.json()),
    fetch(API_USERS).then(r => r.json())
  ]);

  prospects.splice(0, prospects.length, ...prospectsR);
  suivis.splice(0, suivis.length, ...suivisR);
  equipes.splice(0, equipes.length, ...equipesR);
  utilisateurs.splice(0, utilisateurs.length, ...usersR);

  remplirFiltres();
  updateDashboard();
}

fetchAllData();


// DOM
const totalProspectsEl = document.getElementById("totalProspects");
const typeCtx = document.getElementById("typeEnginChart").getContext("2d");
const contratsCtx = document.getElementById("contratsChart").getContext("2d");
const performanceContainer = document.getElementById("performanceContainer");

const filterZone = document.getElementById("filterZone");
const filterEquipe = document.getElementById("filterEquipe");
const filterCC = document.getElementById("filterCC");

let typeChart, contratsChart;

// =========================
// Remplir les filtres
// =========================
function remplirFiltres() {
    const zones = [...new Set(equipes.map(e => e.zone))];
    filterZone.innerHTML = '<option value="">Toutes les zones</option>';
    zones.forEach(z => filterZone.innerHTML += `<option value="${z}">${z}</option>`);

    const nomsEquipes = [...new Set(equipes.map(e => e.nomEquipe))];
    filterEquipe.innerHTML = '<option value="">Toutes les équipes</option>';
    nomsEquipes.forEach(eq => filterEquipe.innerHTML += `<option value="${eq}">${eq}</option>`);

    const cc = utilisateurs.filter(u => u.role === 'CC').map(u => u.nom + ' ' + u.prenom);
    filterCC.innerHTML = '<option value="">Tous les CC</option>';
    cc.forEach(c => filterCC.innerHTML += `<option value="${c}">${c}</option>`);
}
remplirFiltres();

// =========================
// Filtrer prospects selon filtres
// =========================
function getFilteredProspects() {
    return prospects.filter(p => {
        let ok = true;

        if (filterZone.value) {
            const equipe = equipes.find(eq => eq.nomEquipe === p.equipe);
            ok = ok && equipe && equipe.zone === filterZone.value;
        }

        if (filterEquipe.value) {
            ok = ok && p.equipe === filterEquipe.value;
        }

        if (filterCC.value) {
            ok = ok && p.cc === filterCC.value;
        }

        return ok;
    });
}

// =========================
// Mettre à jour les statistiques
// =========================
function updateDashboard() {
    const filteredProspects = getFilteredProspects();

    // Total prospects
    totalProspectsEl.innerText = filteredProspects.length;

    // Prospects par type d'engin
    const typeCounts = {};
    filteredProspects.forEach(p => {
        typeCounts[p.typeEngin] = (typeCounts[p.typeEngin] || 0) + 1;
    });

    if (typeChart) typeChart.destroy();
    typeChart = new Chart(typeCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: [
                    '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8', '#fd7e14'
                ]
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // Contrats
    const contratsEnCours = suivis.filter(s => filteredProspects.some(p => p.id === s.prospectId) &&
        (s.observation === 'En cours' || s.observation === 'Contrat valide')).length;

    const contratsPerdus = suivis.filter(s => filteredProspects.some(p => p.id === s.prospectId) &&
        s.observation === 'Perdu').length;

    if (contratsChart) contratsChart.destroy();
    contratsChart = new Chart(contratsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Contrats actifs', 'Contrats perdus'],
            datasets: [{ data: [contratsEnCours, contratsPerdus], backgroundColor: ['#28a745', '#dc3545'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    updatePerformance();
}

// =========================
// BARRES DE PROGRESSION CC / ÉQUIPE
// =========================
function updatePerformance() {
    performanceContainer.innerHTML = '';

    const filteredProspects = getFilteredProspects();

    // Par CC
    const ccList = [...new Set(filteredProspects.map(p => p.cc))];
    ccList.forEach(cc => {
        const ccProspects = filteredProspects.filter(p => p.cc === cc);
        const suivisCC = suivis.filter(s => ccProspects.some(p => p.id === s.prospectId));
        const moyenneProgression = suivisCC.length ? Math.round(suivisCC.reduce((a,b)=>a+b.progression,0)/suivisCC.length) : 0;

        const card = document.createElement("div");
        card.className = 'performance-card';
        card.innerHTML = `
            <h4>CC: ${cc}</h4>
            <p>Total prospects: ${ccProspects.length}</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width:${moyenneProgression}%; background-color:${getProgressColor(moyenneProgression)}">${moyenneProgression}%</div>
            </div>
        `;
        performanceContainer.appendChild(card);
    });

    // Par Équipe
    const equipeList = [...new Set(filteredProspects.map(p => p.equipe))];
    equipeList.forEach(eq => {
        const eqProspects = filteredProspects.filter(p => p.equipe === eq);
        const suivisEq = suivis.filter(s => eqProspects.some(p => p.id === s.prospectId));
        const moyenneProgression = suivisEq.length ? Math.round(suivisEq.reduce((a,b)=>a+b.progression,0)/suivisEq.length) : 0;

        const card = document.createElement("div");
        card.className = 'performance-card';
        card.innerHTML = `
            <h4>Équipe: ${eq}</h4>
            <p>Total prospects: ${eqProspects.length}</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width:${moyenneProgression}%; background-color:${getProgressColor(moyenneProgression)}">${moyenneProgression}%</div>
            </div>
        `;
        performanceContainer.appendChild(card);
    });
}

// =========================
// Couleur dynamique selon progression
// =========================
function getProgressColor(progress) {
    if (progress >= 70) return '#28a745'; // vert
    else if (progress >= 40) return '#ffc107'; // orange
    else return '#dc3545'; // rouge
}

// =========================
// Événements filtres
// =========================
[filterZone, filterEquipe, filterCC].forEach(f => {
    f.addEventListener('change', updateDashboard);
});

// Initialisation
updateDashboard();
