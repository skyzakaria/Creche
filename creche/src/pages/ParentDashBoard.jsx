import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import '../styles/ParentDashBoard.css'

export default function ParentDashBoard() {
  const { user } = useContext(AuthContext)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    password: ''
  })

  const token = JSON.parse(localStorage.getItem('user'))?.token

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/parents/${user.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Informations mises à jour avec succès')
      setEditing(false)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la mise à jour')
    }
  }

  return (
    <div>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Bienvenue, {user?.prenom || 'Parent'} !</h1>
          <p>Heureux de vous revoir sur votre espace personnel.</p>
        </header>

        <section className="user-info-card">
          <h2>Vos Informations</h2>

          {!editing ? (
            <>
              <p><strong>ID :</strong> {user?.id}</p>
              <p><strong>Nom :</strong> {user?.nom}</p>
              <p><strong>Prénom :</strong> {user?.prenom}</p>
              <p><strong>Email :</strong> {user?.email}</p>
              <p><strong>Rôle :</strong> {user?.role}</p>
              <button onClick={() => setEditing(true)}>Modifier mes infos</button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Nom"
              />
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="Prénom"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nouveau mot de passe (laisser vide si inchangé)"
              />
              <button onClick={handleSave}>Enregistrer</button>
              <button onClick={() => setEditing(false)}>Annuler</button>
            </>
          )}
        </section>
      </div>

      <footer>
        <p className="footTextColor">
          &copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.
        </p>
      </footer>
    </div>
  )
}
