import { Link } from "react-router-dom";
import '../styles/Home.css';

const pdfFile_link = '../files/dossier_creche_poussins_genies_biskra.pdf';

function Home() {
  const DonwloadFile = (url) => {
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  return (
    <div className="FullPage">
      <section id="hero">
        <div className="hero-text">
          <h1>روضة الكتاكيت العباقرة بسكرة</h1>
          <h3>Crèche les poussins génies Biskra</h3>
        </div>
      </section>

      <div className="container">
        <section id="about">
          <h2>À propos de notre Crèche</h2>
          <p>
            Bienvenue à la Crèche les poussins génies ! Nous offrons un
            environnement chaleureux et éducatif pour vos enfants.
          </p>
          <p>
            مرحبًا بكم في روضة الكتاكيت العباقرة، نحن نقدم بيئة دافئة وتعليمية
            لأطفالكم.
          </p>
        </section>

        <section id="Download">
          <h2>Dossier d'inscription / ملف التسجيل</h2>
          <p>
            Les inscriptions seront ouvertes à partir du{" "}
            <span className="highlight">27 août 2025</span>. Vous pouvez
            télécharger{" "}
            <button
              onClick={() => DonwloadFile(pdfFile_link)}
              className="btnDownload"
            >
              ICI
            </button>{" "}
            le dossier à remplir et nous l'envoyer par email ou depuis la page
            de contact.
          </p>
          <p>
            ستُفتح التسجيلات ابتداءً من{" "}
            <span className="highlight">27 أغسطس 2025</span>. يمكنكم تحميل الملف
            من{" "}
            <button
              onClick={() => DonwloadFile(pdfFile_link)}
              className="btnDownload"
            >
              هنا
            </button>{" "}
            وتعبئته وإرساله إلينا عبر البريد الإلكتروني أو من خلال صفحة الاتصال.
          </p>
        </section>

        <section id="gallery">
          <h2>Galerie photos</h2>
          <p>
            Découvrez <Link to="Gallery">ici</Link> nos activités - اكتشف{" "}
            <Link to="Gallery">هنا</Link> أنشطتنا
          </p>
        </section>

        <section id="contact">
          <h2>Contactez-nous</h2>
          <p>
            Vous pouvez nous contacter en remplissant le formulaire de contact
            ici :
          </p>
          <Link className="link_to_contact" to="Contact">Contact</Link>
          <p>يمكنكم الاتصال بنا من خلال ملء استمارة الاتصال هنا :</p>
          <Link to="Contact">الاتصال</Link>
        </section>
      </div>

      <footer>
        <p className="footerTextcolor">
          &copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

export default Home;
