/* =====================================================
   NSIA – Connexion via Backend
===================================================== */

const connexionForm = document.getElementById("connexionForm");

connexionForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userID = document.getElementById("userID").value.trim();
    const password = document.getElementById("password").value;

    // Appel à l'API backend pour login
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: userID,
                motDePasse: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // On reçoit un token et infos utilisateur depuis le backend
            const token = data.token;
            const userInfo = data.user;

            // Stocker le token pour les appels futurs
            localStorage.setItem("token", token);

            alert(`Connexion réussie ! Bienvenue ${userInfo.nom}`);

            // Redirection selon rôle
            if (userInfo.role === "Directeur") {
                window.location.href = "employe.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            // Erreur retournée par le backend
            alert(data.message || "ID ou mot de passe incorrect !");
        }
    } catch (err) {
        console.error("Erreur connexion :", err);
        alert("Erreur réseau ou serveur indisponible.");
    }
});
