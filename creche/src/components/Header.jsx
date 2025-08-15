import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Header.css'
import logo from '/images/logo.png'

function Header() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/Login')
  }

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo crèche" />
        </div>
        <nav>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/About">À propos</Link></li>
            <li><Link to="/Gallery">Galerie</Link></li>
            <li><Link to="/News">Actualités</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            {!user && ( <>
            <li><Link to="/Login">Connexion</Link></li>
            <li><Link to="/Signup">Inscription</Link></li>
            </>)}
            {user && (<>
                <li><Link to="/Dashboard">Tableau de bord</Link></li>
                {user?.role === 'admin' && (
                  <li><Link to="/AdminKids">Gérer les enfants</Link></li>
                )}
                {user?.role === 'admin' && (
                  <li><Link to="/Payments">Paiements</Link></li>
                )}
                {user?.role === 'parent' && (
                  <li><Link to="/MesEnfants">Mes enfants</Link></li>
                )}
                <li className='welcome_message'>Bienvenue {user.prenpm || user.nom || user.email} !</li>
                <li><button onClick={handleLogout} style={{ background: 'black', border: 'none', color: 'yellow', cursor: 'pointer' }}>
                  Déconnexion</button>
                </li>
            </>)}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
