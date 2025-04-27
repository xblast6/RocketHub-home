const NASA_API_KEY = `ofbQMci1sz9eiBeEzTY3YO1TfzWinksoVhbZ1YjJ`
const NASA_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
const nasaImageDay = document.getElementById("nasaImageDay")
async function nasaImage() {
    try {
        const res = await fetch(NASA_URL)
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const cardImageNasa = document.createElement("div")
        cardImageNasa.classList.add("container-nasa-image")
        cardImageNasa.innerHTML = `
            <img src="${data.hdurl || data.url}" alt="foto del giorno nasa">
        `
        nasaImageDay.appendChild(cardImageNasa)
    } catch (err) {
        console.error('Errore caricando NASA APOD:', err);
      }
}

document.addEventListener('DOMContentLoaded', nasaImage);
