const inpMarsRover = document.getElementById("marsRover")
const roverImage = document.getElementById("roverImage")
const inpmarsSolCuriosity = document.getElementById("marsSolCuriosity")
const btnRoverMars = document.getElementById("btnRoverMars")
const roverInfo = document.getElementById("roverInfo")
const API_KEY = "ofbQMci1sz9eiBeEzTY3YO1TfzWinksoVhbZ1YjJ"
const maxSolSpirit = document.getElementById("maxSolSpirit")
const roverInfoOpportunity = document.getElementById("roverInfoOpportunity")
const roverInfoCuriosity = document.getElementById("roverInfoCuriosity")
const roverInfoPerseverance = document.getElementById("roverInfoPerseverance")
const avanti = document.getElementById("destra")
const indietro = document.getElementById("sinistra")

let roverImgArray = []
let currentIndex = 0

window.addEventListener("DOMContentLoaded", () => {
    fetchSpiritRover()
    fetchOpportunityRover()
    fetchCuriosityRover()
    fetchPerseveranceRover()
});

//Spirit
function fetchSpiritRover() {
    const API_BASE_SPIRIT_NASA = `https://api.nasa.gov/mars-photos/api/v1/manifests/spirit?api_key=`
    const API_SPIRIT_NASA = API_BASE_SPIRIT_NASA + API_KEY
    fetch(API_SPIRIT_NASA)
    .then(res => res.json())
    .then(data => renderSpirit(data)) 
    .catch(err => console.log("errore :", err))
}

function renderSpirit(data) {
    const info = data.photo_manifest
        roverInfo.innerHTML = `
            <p>Nome: <strong>${info.name}</strong></p>
            <p>Data di lancio: <strong>${info.launch_date}</strong></p>
            <p>Atterrato su marte il <strong>${info.landing_date}</strong></p>
            <p>Stato: <strong>${info.status}</strong></p>
            <p>Giorni di attività su Marte (Sol): <strong>${info.max_sol}</strong></p>
            <p>Foto scattate: <strong>${info.total_photos}</strong></p>
            <p>Max-date(placeholder): <strong>${info.max_date}</strong></p>
        `
}
//Opportunity
function fetchOpportunityRover() {
    const API_BASE_OPPORTUNITY_NASA = `https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=`
    const API_OPPORTUNITY_NASA = API_BASE_OPPORTUNITY_NASA + API_KEY
    fetch(API_OPPORTUNITY_NASA)
    .then(res => res.json())
    .then(data => renderOpportunity(data)) 
    .catch(err => console.log("errore :", err))
}

function renderOpportunity(data) {
    const info = data.photo_manifest
        roverInfoOpportunity.innerHTML = `
            <p>Nome: <strong>${info.name}</strong></p>
            <p>Data di lancio: <strong>${info.launch_date}</strong></p>
            <p>Atterrato su marte il <strong>${info.landing_date}</strong></p>
            <p>Stato: <strong>${info.status}</strong></p>
            <p>Giorni di attività su Marte (Sol): <strong>${info.max_sol}</strong></p>
            <p>Foto scattate: <strong>${info.total_photos}</strong></p>
            <p>Max-date(placeholder): <strong>${info.max_date}</strong></p>
        `
}

//Curiosity
function fetchCuriosityRover() {
    const API_BASE_CURIOSITY_NASA = `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=`
    const API_CURIOSITY_NASA = API_BASE_CURIOSITY_NASA + API_KEY
    fetch(API_CURIOSITY_NASA)
    .then(res => res.json())
    .then(data => renderCuriosity(data)) 
    .catch(err => console.log("errore :", err))
}

function renderCuriosity(data) {
    const info = data.photo_manifest
        roverInfoCuriosity.innerHTML = `
            <p>Nome: <strong>${info.name}</strong></p>
            <p>Data di lancio: <strong>${info.launch_date}</strong></p>
            <p>Atterrato su marte il <strong>${info.landing_date}</strong></p>
            <p>Stato: <strong>${info.status}</strong></p>
            <p>Giorni di attività su Marte (Sol): <strong>${info.max_sol}</strong></p>
            <p>Foto scattate: <strong>${info.total_photos}</strong></p>
            <p>Max-date(placeholder): <strong>${info.max_date}</strong></p>
        `
}

//Perseverance
function fetchPerseveranceRover() {
    const API_BASE_PERSERVERANCE_NASA = `https://api.nasa.gov/mars-photos/api/v1/manifests/perseverance?api_key=`
    const API_PERSERVERANCE_NASA = API_BASE_PERSERVERANCE_NASA + API_KEY
    fetch(API_PERSERVERANCE_NASA)
    .then(res => res.json())
    .then(data => renderPerseverance(data)) 
    .catch(err => console.log("errore :", err))
}

function renderPerseverance(data) {
    const info = data.photo_manifest
        roverInfoPerseverance.innerHTML = `
            <p>Nome: <strong>${info.name}</strong></p>
            <p>Data di lancio: <strong>${info.launch_date}</strong></p>
            <p>Atterrato su marte il <strong>${info.landing_date}</strong></p>
            <p>Stato: <strong>${info.status}</strong></p>
            <p>Giorni di attività su Marte (Sol): <strong>${info.max_sol}</strong></p>
            <p>Foto scattate: <strong>${info.total_photos}</strong></p>
            <p>Max-date(placeholder): <strong>${info.max_date}</strong></p>
        `
}

btnRoverMars.addEventListener("click", () => {
    roverImage.innerHTML = `<div class="spinner"></div>`
    const marsSolCuriosity = parseInt(inpmarsSolCuriosity.value)
    const URL_SPIRIT_CAMERA_NASA = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${marsSolCuriosity}&api_key=${API_KEY}`
    fetch(URL_SPIRIT_CAMERA_NASA)
    .then(res => res.json())
    .then(data => {
        if (data.photos.length > 0) {
            let maxImageRover = data.photos.slice(0, 35)
            renderMarsRoverImage(maxImageRover)
            avanti.style.opacity = "1"
            indietro.style.opacity = "1"
        } else {
            roverImage.innerHTML = `
                <p>Nessuna foto trovata nella data selezionata, seleziona un altro giorno</p>
            `
        }
    })
    .catch(err => console.log("Errore: ", err))
})

function renderMarsRoverImage(data) {
    roverImage.innerHTML = "";
    roverImgArray = data;         
    currentIndex = 0;           
    
    data.forEach((img, i) => {
      let src = img.img_src.replace(/^http:/, "https:");
      const card = document.createElement("div");
      card.className = "card-rover-image";
      if (i === 0) card.classList.add("active"); 
      card.innerHTML = `
        <p>Camera ${img.camera.name}, sol ${img.sol}</p>
        <img src="${src}" alt="Marte ${img.earth_date}">
      `;
      roverImage.appendChild(card);
    });
    aggiornaFreccie();            
  }
  
  function aggiornaFreccie() {
    if (currentIndex === 0) {
        indietro.style.display = "none";
      } else {
        indietro.style.display = "block";
      }
      
      if (currentIndex === roverImgArray.length - 1) {
        avanti.style.display = "none";
      } else {
        avanti.style.display = "block";
      }
  }
  
  avanti.addEventListener("click", () => {
    if (currentIndex < roverImgArray.length - 1) {
      const cards = roverImage.querySelectorAll(".card-rover-image");
      cards[currentIndex].classList.remove("active");
      currentIndex++;
      cards[currentIndex].classList.add("active");
      aggiornaFreccie();
    }
  });
  
  indietro.addEventListener("click", () => {
    if (currentIndex > 0) {
      const cards = roverImage.querySelectorAll(".card-rover-image");
      cards[currentIndex].classList.remove("active");
      currentIndex--;
      cards[currentIndex].classList.add("active");
      aggiornaFreccie();
    }
  });

