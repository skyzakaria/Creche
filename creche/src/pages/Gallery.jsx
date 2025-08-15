import { useState } from 'react'
import '../styles/Gallery.css'

function Gallery() {

        const images = ["../images/1.jpeg", "../images/2.jpeg", "../images/3.jpeg", "../images/4.jpeg", "../images/5.jpeg"] // jusqua 19
        
        const [slideIndex, setSlideIndex] = useState(0);

        const prevSlide = () => {
            setSlideIndex((prev) => (prev + 1) % images.length);
        };

        const nextSlide = () => {
            setSlideIndex((prev) => (prev - 1 + images.length ) % images.length);
        };

    return(
        <div>
            <section id="Text_Gallery">
                <p>
                    Découverez ici nos activités - اكتشفوا هنا أنشطتنا :
                </p>
            </section>

            <div className="gallery-container">
                <div className="gallery">
                    <img 
                        src={images[slideIndex]}
                        alt={`Photo ${slideIndex + 1}`}
                        className="active"
                        />
                </div>
           
            <button className="prev" onClick={prevSlide}> &#10094; </button>
            <button className="next" onClick={nextSlide}> &#10095; </button>
            </div>

            <footer>
                <p className='footerTextcolor'>&copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.</p>
            </footer>
        </div>
    )
}

export default Gallery