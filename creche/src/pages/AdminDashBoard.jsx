import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/AdminDashBoard.css'

export default function ParentDashBoard() {
  const { user } = useContext(AuthContext)

  return (
    <div>
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenue Admin</h1>
        <p>Heureux de vous revoir sur votre espace personnel.</p>
      </header>

      <section className="user-info-card">
        <h2>Vos Informations</h2>
        <p><strong>ID :</strong> {user?.id}</p>
        <p><strong>Nom :</strong> {user?.nom}</p>
        <p><strong>Prénom :</strong> {user?.prenom}</p>
        <p><strong>Email :</strong> {user?.email}</p>
        <p><strong>Rôle :</strong> {user?.role}</p>
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
