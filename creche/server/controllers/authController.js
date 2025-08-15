import db from '../db.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nom, prenom, email, hashedPassword, role], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
      }
      res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    });
  } catch {
    res.status(500).json({ message: 'Erreur serveur lors du hash' });
  }
};

export const getUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};

export const testConnection = (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) return res.status(500).send('Erreur base de données.');
    res.send('Connexion à la BD OK');
  });
};
