import '../styles/News.css';

function News() {
  return (
    <div>
      <section id="news">
        <h2>Nos réseaux sociaux</h2>
        <p className="subtitle">مواقع التواصل الاجتماعي</p>

        <div className="social-links">
          <a href="https://www.facebook.com/profile.php?id=100057211729090" target="_blank" rel="noopener noreferrer">
            <img src="images/fb.png" alt="Facebook" title="Page Facebook" />
          </a>
          <a href="https://www.instagram.com/creche_les_petits_poussins/" target="_blank" rel="noopener noreferrer">
            <img src="images/insta.png" alt="Instagram" title="Page Instagram" />
          </a>
          <a href="https://www.tiktok.com/@crechelespoussins_genies?_t=8p5OXESseGH&_r=1" target="_blank" rel="noopener noreferrer">
            <img src="images/tiktok.png" alt="TikTok" title="Page TikTok" />
          </a>
        </div>
      </section>

      <footer>
        <p className="footTextColor">&copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default News;
