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

useEffect(() => {
  axios.get('http://localhost:5000/api/parents', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setParents(res.data))
}, [])
