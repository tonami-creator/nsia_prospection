document.addEventListener("DOMContentLoaded", function () {

    const inscriptionForm = document.getElementById("inscriptionForm");

    if (!inscriptionForm) {
        console.error("Formulaire inscription introuvable");
        return;
    }

    inscriptionForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nomComplet = document.getElementById("nomComplet").value.trim();
        const idEmploye = document.getElementById("idEmploye").value.trim();
        const telephone = document.getElementById("telephone").value.trim();
        const email = document.getElementById("email").value.trim();
        const sexe = document.getElementById("sexe").value;
        const lieu = document.getElementById("lieu").value.trim();
        const motDePasse = document.getElementById("motDePasse").value;
        const confirmMotDePasse = document.getElementById("confirmMotDePasse").value;

        if (motDePasse !== confirmMotDePasse) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        // Préparer le body de la requête
        const body = {
            nomComplet,
            idEmploye,
            telephone,
            email,
            sexe,
            lieu,
            motDePasse
        };

        try {
            const response = await fetch("http://localhost:5000/api/inscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Inscription réussie. Vous pouvez maintenant vous connecter.");
                inscriptionForm.reset();
                window.location.href = "connexion.html";
            } else {
                alert(data.message || "Erreur lors de l'inscription.");
            }
        } catch (err) {
            console.error("Erreur réseau ou serveur :", err);
            alert("Erreur réseau ou serveur indisponible.");
        }
    });

});
