import React from 'react';
import '../styles/Contact.css'

function Contact() {
    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending...");
        const formData = new FormData(event.target);

        formData.append("access_key", "910fb75e-cb61-4a05-88e7-6456590b94fe");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        
        if(data.success){
            alert("Message sent successfully");
            setResult("Message sent");
            event.target.reset();
        } else {
            alert("Failed to send message");
            console.log("Error", data)
            setResult(data.message);
        }
    };

    return(
        <div>
            <section className='Contact'>
            <form onSubmit={onSubmit}>
                <p> Formulaire de contact et d'inscription - استمارة الاتصال والتسجيل :</p>
                <div className='input-box'>
                    <label>Nom prénom :</label>
                    <input type="text" className="field" placeholder='Enter your name' name='name' required/>
                </div>

                <div className='input-box'>
                    <label>E-mail :</label>
                    <input type="text" className="field" placeholder='Enter your E-mail address' name='email' required/>
                </div>

                <div className='input-box'>
                    <label>Numéro de téléphone :</label>
                    <input type="text" className="field" placeholder='Enter your phone number' name='phone' required/>
                </div>

                <div className='input-box'>
                    <label>Objet :</label>
                    <input type="text" className="field" placeholder='Enter the subject' name='subject' required/>
                </div>
                
                <div className='input-box'>
                    <label>Message :</label>
                    <textarea id=''className='field_message' placeholder='Write your message here..' name='message' required/>
                </div>
                <button type='submit'>Send Message</button>
            </form>

            </section>
            <footer>
                <p className='footTextColor'>&copy; 2025 روضة الكتاكيت العباقرة بسكرة. Tous droits réservés.</p>
            </footer>

        </div>
    )
}

export default Contact