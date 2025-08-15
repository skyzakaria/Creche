import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/ParentKidsList.css'


function ParentKidsList() {
  const [kids, setKids] = useState([])
  const token = JSON.parse(localStorage.getItem('user'))?.token

  useEffect(() => {
    axios.get('http://localhost:5000/api/kids', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setKids(res.data))
  }, [])

  return (
    <div>
    <div className="parent-container">
      <h2>Mes enfants</h2>
      {kids.length === 0 ? (
        <p className="no-data">Aucun enfant trouvé.</p>
      ) : (
        <table className="kids-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Classe</th>
              <th>Numéro</th>
              <th>{`Paiement mois de ${new Date().toLocaleString('fr-FR', { month: 'long' })}`}</th>
              <th>Remarques</th>
            </tr>
          </thead>
          <tbody>
            {kids.map(kid => (
              <tr key={kid.id}>
                <td>{kid.nom}</td>
                <td>{kid.prenom}</td>
                <td>{kid.classe}</td>
                <td>{kid.numero}</td>
                <td className={kid.paiement === 'payé' ? 'status-paye' : 'status-non-paye'}>
                  {kid.paiement === 'payé' ? '✅ Payé' : '❌ Non payé'}
                </td>
                <td>{kid.remarques}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    <footer>
        <p className="footerTextcolor">&copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.</p>
    </footer>
    </div>
  )
}

export default ParentKidsList
