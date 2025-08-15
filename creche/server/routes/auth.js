import express from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';

const JWT_SECRET = '3325'; // à mettre dans .env plus tard

const router = express.Router();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Accès refusé, token manquant' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
}

const handleUpdateSubmit = async (e) => {
  e.preventDefault()
  try {
    await axios.put(`http://localhost:5000/api/kids/${editingKid}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // Recharge les données après maj :
    const res = await axios.get('http://localhost:5000/api/kids', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setKids(res.data)
    setEditingKid(null) // Ferme le formulaire
  } catch (err) {
    console.error('Erreur de mise à jour', err)
  }
}


router.post('/signup', async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'parent';
    const sql = 'INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nom, prenom, email, hashedPassword, role], (err) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
      res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    });
  } catch {
    res.status(500).json({ message: 'Erreur serveur lors du hash' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (results.length === 0) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Inclure le role et id dans le token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Renvoie token, role et id explicitement
    res.json({ token, role: user.role, id: user.id, nom: user.nom, prenom: user.prenom, email: user.email });
  });
});

// POST /api/kids
router.post('/kids', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Seul un admin peut ajouter un enfant' });
  }

  const { nom, prenom, date_de_naissance, classe, numero, paiement, remarques, parent_id } = req.body;

  const sql = `
    INSERT INTO kids (nom, prenom, date_de_naissance, classe, numero, paiement, remarques, parent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nom, prenom, date_de_naissance, classe, numero, paiement, remarques, parent_id], (err) => {
    if (err) return res.status(500).json({ message: 'Erreur ajout enfant', error: err });
    res.status(201).json({ message: 'Enfant ajouté avec succès' });
  });
});


// GET /api/kids/all
router.get('/kids/all', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès interdit' });

  db.query(`SELECT * FROM kids`, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur récupération', error: err });
    res.json(results);
  });
});

// GET /api/kids
router.get('/kids', verifyToken, (req, res) => {
  const parent_id = req.user.id;

  const sql = `SELECT * FROM kids WHERE parent_id = ?`;
  db.query(sql, [parent_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur récupération', error: err });
    res.json(results);
  });
});

router.get('/parents', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });

  const sql = `SELECT id, nom, prenom, email FROM users WHERE role = 'parent'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.json(results);
  });
});

router.get('/profil', verifyToken,(req, res) => {
  res.json({ message: 'Bienvenue dans votre profil', user: req.user });
});

router.get('/test', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) return res.status(500).send('Erreur base de données.');
    res.send('Connexion à la BD OK');
  });
});

router.get('/users', verifyToken, (req, res) => {
  const q = "SELECT id, nom, prenom, email FROM users";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// PUT /api/kids/:id - mise à jour des infos d’un enfant
router.put('/kids/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Seul un admin peut modifier un enfant' });
  }

  const kidId = req.params.id;
  const { nom, prenom, date_de_naissance, classe, numero, paiement, remarques, parent_id } = req.body;

  const sql = `
    UPDATE kids 
    SET nom = ?, prenom = ?, date_de_naissance = ?, classe = ?, numero = ?, paiement = ?, remarques = ?, parent_id = ?
    WHERE id = ?
  `;

  db.query(sql, [nom, prenom, date_de_naissance, classe, numero, paiement, remarques, parent_id, kidId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur de mise à jour', error: err });
    res.json({ message: 'Enfant mis à jour avec succès' });
  });
});

// Suppression d'un enfant
router.delete('/kids/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Seul un admin peut supprimer un enfant' });
  }

  const kidId = req.params.id;

  const sql = 'DELETE FROM kids WHERE id = ?';
  db.query(sql, [kidId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la suppression', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enfant non trouvé' });
    }

    res.status(200).json({ message: 'Enfant supprimé avec succès' });
  });
});

// Mise à jour des infos d’un parent
// PUT /api/parents/:id - mise à jour des infos d'un parent
router.put('/parents/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  // Autoriser uniquement si l'utilisateur est lui-même ou un admin
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  const { nom, prenom, email, password } = req.body;

  try {
    let sql, params;

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = `UPDATE users SET nom = ?, prenom = ?, email = ?, password = ? WHERE id = ?`;
      params = [nom, prenom, email, hashedPassword, id];
    } else {
      sql = `UPDATE users SET nom = ?, prenom = ?, email = ? WHERE id = ?`;
      params = [nom, prenom, email, id];
    }

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur de mise à jour', error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'Informations mises à jour avec succès' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Envoi d'un email de confirmatio
router.post('/payments', verifyToken, async (req, res) => {
  console.log('POST /payments reçu', req.body, 'Utilisateur:', req.user);

  if (req.user.role !== 'admin') {
    console.log('Accès refusé pour', req.user);
    return res.status(403).json({ message: 'Accès refusé' });
  }

  const { kid_id, month, amount } = req.body;

  try {
    // 1️⃣ Vérifier l'enfant
    const [kid] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM kids WHERE id = ?', [kid_id], (err, results) => err ? reject(err) : resolve(results));
    });
    if (!kid) return res.status(400).json({ message: 'Enfant introuvable' });

    // 2️⃣ Vérifier le parent
    const [parent] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [kid.parent_id], (err, results) => err ? reject(err) : resolve(results));
    });
    if (!parent) return res.status(400).json({ message: 'Parent introuvable' });

    // 3️⃣ Vérifier si paiement existe déjà
    const [existing] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM payments WHERE kid_id = ? AND month = ?', [kid_id, month], (err, results) => err ? reject(err) : resolve(results));
    });
    if (existing) {
      return res.status(400).json({ message: 'Paiement déjà enregistré pour ce mois.' });
    }

    // 4️⃣ Insérer paiement
    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO payments (kid_id, month, amount) VALUES (?, ?, ?)',
        [kid_id, month, amount],
        (err, results) => err ? reject(err) : resolve(results)
      );
    });

    console.log(`✅ Paiement inséré pour ${kid.nom} ${kid.prenom}, montant ${amount}€`);

    // 5️⃣ Envoi d'email
    console.log(`📧 Envoi d'email à ${parent.email}...`);
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou smtp
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

// Permet d'utiliser __dirname avec ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // On remonte d'un dossier puis on va dans "images"
    const logoPath = path.join(__dirname, '..', 'media', 'logo.png');

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: parent.email,
      subject: 'Confirmation de paiement',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p>Bonjour ${parent.nom},</p>
          <p>Votre paiement pour <strong>${kid.prenom} ${kid.nom}</strong> concernant le mois de <strong>${month}</strong> a bien été enregistré.</p>
          <p>Montant : <strong>${amount} DA</strong></p>
          <p>Merci.<br>L'équipe de l'école.</p>
          <p>Mail automatique, ne pas répondre.</p>
          <img src="cid:logo" alt="Logo" style="width:120px;" />
        </div>
      `,
      attachments: [{
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo' // identifiant utilisé dans <img src="cid:logo" />
      }]
    };

    // Copie de l'email à l'administrateur
    const mailOptions2 = {
      to: process.env.MAIL_USER,
      subject: 'Paiement enregistré',
            html: `
        <div style="font-family: Arial, sans-serif;">
          <p>Paiment reçu pour <strong>${kid.prenom} ${kid.nom}</strong> concernant le mois de <strong>${month}</strong>.</p>
          <p>Montant : <strong>${amount} DA</strong></p>
          <p>Mail automatique, ne pas répondre.</p>
          <img src="cid:logo" alt="Logo" style="width:120px;" />
        </div>
      `,
      attachments: [{
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo' // identifiant utilisé dans <img src="cid:logo" />
      }]
    }

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptions2);
    console.log(`✅ Email envoyé à ${parent.email}`);
    console.log(`✅ Email de confirmation envoyé à l'administrateur ${process.env.MAIL_USER}`);

    // 6️⃣ Répondre au front
    res.json({ message: 'Paiement enregistré et email envoyé avec succès' });
    

  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.get('/payments/kids', verifyToken, async (req, res) => {
  try {
    // On récupère tous les enfants avec leurs paiements
    const query = `
      SELECT 
        k.id AS kid_id,
        k.nom,
        k.prenom,
        k.date_de_naissance,
        k.classe,
        k.numero,
        k.remarques,
        p.month,
        p.amount
      FROM kids k
      LEFT JOIN payments p ON p.kid_id = k.id
      ORDER BY k.classe, k.nom, p.month
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Erreur DB:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      // On structure par enfant avec un tableau de paiements
      const kidsMap = {};
      results.forEach(row => {
        if (!kidsMap[row.kid_id]) {
          kidsMap[row.kid_id] = {
            id: row.kid_id,
            nom: row.nom,
            prenom: row.prenom,
            date_de_naissance: row.date_de_naissance,
            classe: row.classe,
            numero: row.numero,
            remarques: row.remarques,
            paiements: []
          };
        }
        if (row.month) {
          kidsMap[row.kid_id].paiements.push({
            month: row.month,
            amount: row.amount
          });
        }
      });

      res.json(Object.values(kidsMap));
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});




export default router;
