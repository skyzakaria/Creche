import '../styles/About.css'

function About() {
  return (
    <div>
    <div className='about_container'>
        <h2>Informations de Contact :</h2>
            <p><strong>Adresse :</strong> 20 lotissement ben Amara El haouza - Biskra, Algérie</p>
            <p><strong>Téléphone :</strong> (+213) 0773 26 79 02</p>
            <p><strong>E-mail : </strong>creche.les.poussins.genies@gmail.com</p>
        
        <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d323.50620317438995!2d5.722852309784604!3d34.8436365489331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s%20El%20haouza%20biskra!5e1!3m2!1sfr!2sfr!4v1721287882692!5m2!1sfr!2sfr" style={{ border:0, width: '100%', height: '450px' }} allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">
        </iframe>
            <h2>Horaires d'ouverture</h2>
                <ul>
                    <li>Dimanche : 7:30 - 17:00</li>
                    <li>Lundi : 7:30 - 17:00</li>
                    <li>Mardi : 7:30 - 17:00</li>
                    <li>Mercredi : 7:30 - 17:00</li>
                    <li>Jeudi : 7:30 - 17:00</li>
                    <li>Vendredi : Fermé</li>
                    <li>Samedi : Fermé</li>
                </ul>
        <img src='images/logo.jpg' alt="Logo Crèche" height="200" width="200" className="logo_about"></img>
        </div>
        <footer>
          <p className='footTextColor'>&copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.</p>
        </footer>
    </div>
  )
}

export default About