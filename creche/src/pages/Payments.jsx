import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/Payments.css'

function Payments() {
  const [kids, setKids] = useState([])
  const [parents, setParents] = useState([])
  const [selectedMonth, setSelectedMonth] = useState({})
  const [amounts, setAmounts] = useState({})

  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const token = JSON.parse(localStorage.getItem('user'))?.token

  const fetchKids = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/payments/kids', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setKids(res.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants :', error)
    }
  }

  useEffect(() => {
    fetchKids()
    axios.get('http://localhost:5000/api/parents', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setParents(res.data))
  }, [])

  const handlePayment = async (kid_id) => {
    if (!selectedMonth[kid_id] || !amounts[kid_id]) 
      return alert("Sélectionner le mois et le montant")

    try {
      await axios.post('http://localhost:5000/api/payments', {
        kid_id,
        month: selectedMonth[kid_id],
        amount: amounts[kid_id]
      }, { headers: { Authorization: `Bearer ${token}` } })

      alert("Paiement enregistré et mail envoyé !")
      fetchKids()
    } catch(err) {
      console.error(err)
      alert(err.response?.data?.message || "Erreur lors du paiement")
    }
  }

  return (
    <div>
    <div className="admin-container">
      <section id="payments">
        <h2>Page de Paiements</h2>
        <p className="subtitle">قائمة المدفوعات</p>
        <p>Cette page est réservée aux administrateurs pour gérer les paiements des parents.</p>
      </section>

      {['3eme', '4eme', '5eme'].map(classe => {
        const kidsInClasse = kids
          .filter(k => k.classe === classe)
          .sort((a, b) => a.nom.localeCompare(b.nom))

        return (
          <div key={classe} className="class-container">
            <h3>Classe {classe.replace('eme', 'ème')}</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Date de naissance</th>
                    <th>Classe</th>
                    <th>Numéro</th>
                    <th>Paiements</th>
                    <th>Remarques</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {kidsInClasse.map(kid => (
                    <tr key={kid.id} className={kid.paiements.length > 0 ? 'row-paid' : 'row-unpaid'}>
                      <td>{kid.nom}</td>
                      <td>{kid.prenom}</td>
                      <td>{kid.date_de_naissance ? new Date(kid.date_de_naissance).toLocaleDateString() : '-'}</td>
                      <td>{kid.classe}</td>
                      <td>{kid.numero}</td>
                      <td>
                        {kid.paiements.length > 0 ? (
                          kid.paiements.map(p => (
                            <div key={p.month} className="paid-month">
                              ✅ {p.month} ({p.amount}€)
                            </div>
                          ))
                        ) : (
                          <div className="unpaid-month">Aucun mois payé</div>
                        )}
                      </td>
                      <td>{kid.remarques || '-'}</td>
                      <td>
                        <div className="payment-actions">
                          <select
                            value={selectedMonth[kid.id] || ''}
                            onChange={e => setSelectedMonth({ ...selectedMonth, [kid.id]: e.target.value })}
                          >
                            <option value="">Mois</option>
                            {months
                              .filter(m => !kid.paiements.some(p => p.month === m))
                              .map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <input
                            type="number"
                            placeholder="Montant"
                            value={amounts[kid.id] || ''}
                            onChange={e => setAmounts({ ...amounts, [kid.id]: e.target.value })}
                          />
                          <button
                            onClick={() => handlePayment(kid.id)}
                            disabled={!selectedMonth[kid.id] || !amounts[kid.id]}
                          >
                            ✅ Payer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
      </div>
      <footer>
        <p className="footerTextcolor">&copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default Payments
