import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

function Signup() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        nom,
        prenom,
        email,
        password,
        role: 'parent'
      });

      alert('Compte créé avec succès ! Vous pouvez vous connecter.');
      navigate('/Login');
    } catch (err) {
      console.error('Erreur inscription:', err);
      alert("Échec de l'inscription");
    }
  };

  return (
    <div>
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <h2>Inscription</h2>
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" required />
        <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" type="email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" type="password" required />
        {/* 
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
        </select> 
        */}
        <button type="submit">S'inscrire</button>
      </form>
      </div>
      <footer>
        <p className="footTextColor">
          &copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

export default Signup;
