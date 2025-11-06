// Import Firebase depuis le CDN officiel
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// 🔥 Configuration Firebase (remplace par la tienne)
const firebaseConfig = {
  apiKey: "TA_CLE_API_ICI",
  authDomain: "reservation-materiel.firebaseapp.com",
  projectId: "reservation-materiel",
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fonction pour afficher le matériel
async function afficherMateriel() {
  const listContainer = document.getElementById("materiel-list");
  listContainer.innerHTML = "<p>Chargement...</p>";

  const querySnapshot = await getDocs(collection(db, "materiel"));
  listContainer.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "materiel";
    div.innerHTML = `
      <h3>${data.nom}</h3>
      <p>Disponibilité : ${data.dispo ? "✅ Disponible" : "❌ Réservé"}</p>
      <button ${!data.dispo ? "disabled" : ""}>Réserver</button>
    `;

    const button = div.querySelector("button");
    button.addEventListener("click", async () => {
      await updateDoc(doc(db, "materiel", docSnap.id), { dispo: false });
      alert(`${data.nom} réservé avec succès !`);
      afficherMateriel(); // rafraîchir
    });

    listContainer.appendChild(div);
  });
}

// Affiche les données dès le chargement
afficherMateriel();
