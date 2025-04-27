const inpUserMoonWeight = document.getElementById("userMoonWeight")
const btnCalcWeightMoon = document.getElementById("btnCalcWeightMoon")
const responseUserWeight = document.getElementById("responseUserWeight")
const dateInput = document.getElementById('date');
const slider = document.getElementById('slider');
const moonImg = document.getElementById('moonPhase');
const metaTxt = document.getElementById('meta');
const tipTxt = document.getElementById('tip');
const galleryNasa = document.getElementById("galleryNasa")
const avanti = document.getElementById("destra")
const indietro = document.getElementById("sinistra")


function moonWeight() {
  let userHearthweight = parseFloat(inpUserMoonWeight.value)
  let calcMoonWeight = (userHearthweight / 9.81) * 1.622
  let responseCalc = calcMoonWeight.toFixed(2)
  responseUserWeight.innerHTML = `
        <p>Il tuo peso lunare è di:<br> ${responseCalc} Kg</p>
    `
}

window.addEventListener("DOMContentLoaded", () => {
  fetchGalleryNasa()
});

btnCalcWeightMoon.addEventListener("click", () => {
  moonWeight()
})


const today = new Date();
dateInput.value = today.toISOString().slice(0,10);
fetchPhase(today);

dateInput.addEventListener('change', e => {
  slider.value = 0;                     
  fetchPhase(new Date(e.target.value));
});

slider.addEventListener('input', e => {
  const delta = Number(e.target.value);  
  const base  = new Date(dateInput.value);
  const moved = new Date(+base + delta*864e5);
  fetchPhase(moved);
});

async function fetchPhase(dateObj){
  let isoDate = dateObj.toISOString().slice(0,16);   
  let cacheKey = 'moon-'+isoDate;
  const cached = sessionStorage.getItem(cacheKey);
  const data = cached ? JSON.parse(cached)
                      : await fetch(`https://svs.gsfc.nasa.gov/api/dialamoon/${isoDate}`).then(r=>r.json()).then(j => {
                          sessionStorage.setItem(cacheKey, JSON.stringify(j));
                          return j;
                        });

  moonImg.src = data.image.url;
  moonImg.alt = `Moon illuminated ${data.phase.toFixed(1)} %`;
  metaTxt.textContent = `Illuminazione: ${data.phase.toFixed(1)} %  –  Giorni da inizio mese: ${data.age.toFixed(1)} gg`;

  tipTxt.textContent  = moonPhase(data.phase);
}

function moonPhase(phase){
  if (phase < 10)   return "🌑 Luna Nuova: buio totale, perfetta per osservare le stelle, meno per gli atterraggi.";
  if (phase < 45)   return "🌓 Luna Crescente: classica fase lunare scelta dagli astronauti Apollo per atterrare, con ombre nette che facilitano la navigazione.";
  if (phase < 55)   return "🌕 Luna Piena: superficie altamente riflettente e temperature elevate riducono notevolmente la praticità di effettuare atterraggi sicuri;";
  if (phase < 90)   return "🌗 Luna Calante: condizioni ideali per pianificare traiettorie orbitali con rientro libero.";
  return "🌑 Luna quasi Nuova: ottima per test ottici satellitari nel buio assoluto.";
}

function fetchGalleryNasa() {
  fetch("https://images-api.nasa.gov/search?q=moon&media_type=image&page=1")
    .then(res => res.json())
    .then(data => {
      let arrayData = data.collection.items.slice(0, 30)
      renderGalleryNasa(arrayData)
    })
    .catch(err => console.log("Errore ", err))
}

function renderGalleryNasa(arrayData) {
  arrayData.forEach(data => {
    const cardGalleryNasa = document.createElement("div")
    cardGalleryNasa.classList.add("card-gallery-nasa")
    cardGalleryNasa.innerHTML = `
      <p>${data.data[0].title}</p>
      <img src="${data.links[1].href}" alt="${data.data[0].title}">
    `
    galleryNasa.appendChild(cardGalleryNasa)
  });
}

avanti.addEventListener("click", () => {
  galleryNasa.scrollBy({
    left: galleryNasa.clientWidth * 0.6
  })
})

indietro.addEventListener("click", () => {
  galleryNasa.scrollBy({
    left: -galleryNasa.clientWidth * 0.6
  })
})