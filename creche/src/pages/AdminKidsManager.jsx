import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/AdminKidsManager.css';

function AdminKidsManager() {
  const [kids, setKids] = useState([])
  const [parents, setParents] = useState([])
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    date_de_naissance: '',
    classe: '3eme',
    numero: '',
    paiement: 'non_payé',
    remarques: '',
    parent_id: ''
  })

  const [editingKid, setEditingKid] = useState(null)
  const [formData, setFormData] = useState({
  nom: '',
  prenom: '',
  date_de_naissance: '',
  classe: '',
  numero: '',
  paiement: '',
  remarques: '',
  parent_id: ''          
});

  const token = JSON.parse(localStorage.getItem('user'))?.token

  const fetchKids = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/kids/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setKids(res.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des enfants :', error);
  }
};

  useEffect(() => {
  fetchKids();

  axios.get('http://localhost:5000/api/parents', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setParents(res.data));
}, []);


const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({
    ...form,
    [name]: name === 'numero' ? (value ? parseInt(value, 10) : null) : value
  });
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: name === 'numero' ? (value ? parseInt(value, 10) : null) : value
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        console.log('Formulaire envoyé :', form)

      await axios.post('http://localhost:5000/api/kids', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Enfant ajouté !')
      window.location.reload()
    } catch (err) {
      alert('Erreur ajout enfant')
    }
  }

  const handleEditClick = (kid) => {
  setEditingKid(kid.id);
  setFormData({
    nom: kid.nom,
    prenom: kid.prenom,
    date_de_naissance: kid.date_de_naissance?.slice(0, 10) || '', // pour input type date
    numero: kid.numero,
    classe: kid.classe,
    paiement: kid.paiement,
    remarques: kid.remarques,
    parent_id: kid.parent_id
  });
};


const handleUpdateSubmit = async (e) => {
  e.preventDefault()
  try {
    await axios.put(`http://localhost:5000/api/kids/${editingKid}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    alert('Enfant mis à jour !')
    window.location.reload()
  } catch (err) {
    alert('Erreur lors de la mise à jour de l’enfant')
    console.error(err)
  }
}



const handleDelete = async (kidId) => {
  if (!window.confirm("Es-tu sûr(e) de vouloir supprimer cet enfant ?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/kids/${kidId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchKids();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
};



const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};


  return (
  <div className="admin-container">
    <h2>Ajouter un enfant</h2>
    <form className="admin-form" onSubmit={handleSubmit}>
      <p>Nom :</p>
      <input name="nom" placeholder="Nom" onChange={handleChange} required />
      <p>Prénom :</p>
      <input name="prenom" placeholder="Prénom" onChange={handleChange} required />
      <p>Date de naissance :</p>
      <input name="date_de_naissance" type="date" onChange={handleChange} required />
      <p>Classe :</p>
      <select name="classe" onChange={handleChange}>
        <option value="3eme">3ème</option>
        <option value="4eme">4ème</option>
        <option value="5eme">5ème</option>
      </select>
      <p>Numéro :</p>
      <input name="numero" placeholder="Numéro" onChange={handleChange} required />
      <p>Paiement :</p>
      <select name="paiement" value={form.paiement} onChange={handleChange}>
        <option value="payé">Payé</option>
        <option value="non_payé">Non payé</option>
      </select>
      <p>Remarques :</p>
      <textarea name="remarques" placeholder="Remarques" onChange={handleChange} />
      <p>Parent :</p>
      <select name="parent_id" onChange={handleChange} required>
        <option value="">Choisir un parent</option>
        {parents.map(p => (
          <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
        ))}
      </select>

      <button type="submit">Ajouter</button>
    </form>

    <h2>Liste des enfants par classe</h2>
        {['3eme', '4eme', '5eme'].map((classe) => {
        const kidsInClasse = kids
            .filter(k => k.classe === classe)
            .sort((a, b) => a.nom.localeCompare(b.nom)); // tri A → Z

        return (
            <div key={classe} style={{ marginBottom: '40px' }}>
            <h3 style={{ marginTop: '30px' }}>Classe {classe.replace('eme', 'ème')}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={thStyle}>Nom</th>
                    <th style={thStyle}>Prénom</th>
                    <th style={thStyle}>Date de naissance</th>
                    <th style={thStyle}>Classe</th>
                    <th style={thStyle}>Numéro</th>
                    <th style={thStyle}>Paiement</th>
                    <th style={thStyle}>Remarques</th>
                    <th style={thStyle}>Action</th>
                </tr>
                </thead>
                <tbody>
                {kidsInClasse.map(kid => (
                    <tr key={kid.id} style={{ backgroundColor: kid.paiement === 'payé' ? '#e0ffe0' : '#ffe0e0' }}>
                    <td style={tdStyle}>{kid.nom}</td>
                    <td style={tdStyle}>{kid.prenom}</td>
                    <td style={tdStyle}>{new Date(kid.date_de_naissance).toLocaleDateString()}</td>
                    <td style={tdStyle}>{kid.classe}</td>
                    <td style={tdStyle}>{kid.numero}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: kid.paiement === 'payé' ? 'green' : 'red' }}>
                        {kid.paiement === 'payé' ? '✅ Payé' : '❌ Non payé'}
                    </td>
                    <td style={tdStyle}>{kid.remarques || '-'}</td>
                    <td style={tdStyle}>
                    <div className="table-actions">
                        <button className="btn-edit" onClick={() => handleEditClick(kid)}>✏️ Modifier</button>
                        <button className="btn-delete" onClick={() => handleDelete(kid.id)}>🗑️ Supprimer</button>
                    </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )
        })}
        {editingKid && (
            <form onSubmit={handleUpdateSubmit} className="edit-form">
                <h3>Modifier l’enfant</h3>
                <input
                type="text"
                placeholder="Nom"
                value={formData.nom}
                onChange={e => setFormData({ ...formData, nom: e.target.value })}
                />
                <input
                type="text"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                />
                <input
                type="date"
                name="date_de_naissance"
                value={formData.date_de_naissance}
                onChange={handleEditChange}
                />
                <input
                type="text"
                placeholder="Numéro de téléphone"
                value={formData.numero}
                onChange={e => setFormData({
                  ...formData,
                  numero: e.target.value 
                })}
                />
                <select
                value={formData.classe}
                onChange={e => setFormData({ ...formData, classe: e.target.value })}>
                <option value="">Choisir une classe</option>
                <option value="3eme">3ème</option>
                <option value="4eme">4ème</option>
                <option value="5eme">5ème</option>
                </select>
                <select
                value={formData.paiement}
                onChange={e => setFormData({ ...formData, paiement: e.target.value })}
                >
                <option value="">Statut de paiement</option>
                <option value="payé">✅ Payé</option>
                <option value="non payé">❌ Non payé</option>
                </select>
                <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleEditChange}
                >
                <option value="">Choisir un parent</option>
                {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                    {p.nom} {p.prenom}
                    </option>
                ))}
                </select>
                <input
                type="text"
                placeholder="Remarques"
                value={formData.remarques}
                onChange={e => setFormData({ ...formData, remarques: e.target.value })}
                />
                <button type="submit">✅ Enregistrer</button>
                <button type="button" onClick={() => setEditingKid(null)}>❌ Annuler</button>
            </form>
            )}
    </div>
    )
}

export default AdminKidsManager;
