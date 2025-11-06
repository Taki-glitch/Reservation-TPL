// Import Firebase depuis le CDN officiel
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// 🔥 Configuration Firebase (remplace par la tienne)
const firebaseConfig = {
  apiKey: "AIzaSyANsJqWUkmvYGo5Y5N9-xXp6HE2XyyDwVM",
  authDomain: "presentoir-e915d.firebaseapp.com",
  projectId: "presentoir-e915d",
  storageBucket: "presentoir-e915d.firebasestorage.app",
  messagingSenderId: "772898567381",
  appId: "1:772898567381:web:6a09f17ab79b2391f3de5c",
  measurementId: "G-HH46H8FNW6",
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fonction pour afficher le matériel
async function afficherpresentoir() {
  const listContainer = document.getElementById("presentoir-list");
  if (!listContainer) {
    console.error("Erreur : aucun élément avec l'ID 'presentoir-list' trouvé dans le HTML.");
    return;
  }

  listContainer.innerHTML = "<p>Chargement...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "presentoir"));
    listContainer.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = "presentoir";

      // Créer le HTML selon la disponibilité
      if (data.dispo) {
        div.innerHTML = `
          <h3>${data.nom}</h3>
          <p>Disponibilité : ✅ Disponible</p>
          <button>Réserver</button>
        `;
      } else {
        div.innerHTML = `
          <h3>${data.nom}</h3>
          <p>Disponibilité : ❌ Réservé</p>
          <button>Libérer</button>
        `;
      }

      // Gérer le clic sur le bouton
      const button = div.querySelector("button");
      button.addEventListener("click", async () => {
        const newDispo = !data.dispo; // true si libérer, false si réserver
        await updateDoc(doc(db, "presentoir", docSnap.id), { dispo: newDispo });
        alert(`${data.nom} ${newDispo ? "libéré" : "réservé"} avec succès !`);
        afficherpresentoir(); // rafraîchir la liste
      });

      listContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    listContainer.innerHTML = "<p>Impossible de charger les présentoirs.</p>";
  }
}

// Affiche les données dès que le DOM est prêt
document.addEventListener("DOMContentLoaded", afficherpresentoir);
