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
  listContainer.innerHTML = "<p>Chargement...</p>";

  const querySnapshot = await getDocs(collection(db, "presentoir"));
  listContainer.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "presentoir";
    div.innerHTML = `
      <h3>${data.nom}</h3>
      <p>Disponibilité : ${data.dispo ? "✅ Disponible" : "❌ Réservé"}</p>
      <button ${!data.dispo ? "disabled" : ""}>Réserver</button>
    `;

    const button = div.querySelector("button");
    button.addEventListener("click", async () => {
      await updateDoc(doc(db, "materiel", docSnap.id), { dispo: false });
      alert(`${data.nom} réservé avec succès !`);
      afficherpresentoir(); // rafraîchir
    });

    listContainer.appendChild(div);
  });
}

// Affiche les données dès le chargement
afficherpresentoir();
