
const moisNoms = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const moisActuel = new Date().getMonth();

document.addEventListener("DOMContentLoaded", function () {
  const mois = new Date().toLocaleString('fr-FR', { month: 'long' })
  const moisPaiement = document.getElementById('mois-paiement')
  if (moisPaiement) {
    moisPaiement.textContent = `Paiement mois de ${mois}`
  }
})
