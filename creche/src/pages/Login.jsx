import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      })

      const { token, role, id, nom, prenom, email: emailFromServer } = response.data
      const userData = { token, role, id, nom, prenom, email: emailFromServer }

      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      if (role === 'admin') {
        navigate('/AdminDashBoard')
      } else if (role === 'parent') {
        navigate('/ParentDashBoard')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('Erreur axios login:', err)
      alert('Login échoué. Veuillez vérifier vos identifiants.')
    }
  }

  return (
    <>
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          <button type="submit">Connexion</button>
        </form>
      </div>

      <footer>
        <p className="footTextColor">
          &copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.
        </p>
      </footer>
    </>
  )
}

export default Login
