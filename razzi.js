const containerCatalogo = document.getElementById("containerCatalogo")
const inpSearch = document.getElementById("inpSearch")
const filterSelect = document.getElementById("filterRocket");
const searchFilter = document.getElementById("searchFilter");

const ULR_BASE = "http://localhost:5010"
const URL_CATALOGO = ULR_BASE + "/rockets"

let rocketArray = []

window.addEventListener("DOMContentLoaded", () => {
    fetchCatalogo();
    inpSearch.addEventListener("input", updatedView)
    filterSelect.addEventListener("change", updatedView)
  });

function fetchCatalogo() {
    const token = localStorage.getItem("token");
    fetch(URL_CATALOGO, {
        headers: { 
          "Authorization": "Bearer " + token
        }
      })
      .then(res => {
        console.log("HTTP status:", res.status, res.statusText);
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        return res.json();
      })
      .then(rockets => {
        rocketArray = rockets
        updatedView()
      })
      .catch(err => console.error("Fetch error:", err));
}

function updatedView() {
    containerCatalogo.innerHTML = "";
    let filteredRocket = rocketArray.slice()
    let inpSearchLowerCase = inpSearch.value.trim().toLowerCase()
    if (inpSearchLowerCase) {
        filteredRocket = filteredRocket.filter(rocket =>
            rocket.name.toLowerCase().includes(inpSearchLowerCase) || rocket.company.name.toLowerCase().includes(inpSearchLowerCase)
        )
    }
    const ordinaSecondo = filterSelect.value
    switch (ordinaSecondo) {
        case "name":
          filteredRocket.sort((a, b) => 
            a.name.localeCompare(b.name));
          break;
    
        case "company":
          filteredRocket.sort((a, b) => 
            a.company.name.localeCompare(b.company.name)
          );
          break;
    
        case "height":
          filteredRocket.sort((a, b) =>
            b.height.value - a.height.value
          );
          break;
    
        case "stageNumber":
          filteredRocket.sort((a, b) =>
            a.stages.stageNumber - b.stages.stageNumber
          );
          break;
    
        default:
          filteredRocket.sort((a, b) => a.name.localeCompare(b.name));
      }
    renderCatalogo(filteredRocket)
}

function renderCatalogo(rockets) {
    rockets.forEach(rocket => {
        const cardCatalogo = document.createElement("div")
        cardCatalogo.classList.add("card-catalogo")
        cardCatalogo.innerHTML = `
            <div class="container-rocket-info">
                <div class="rocket-name">
                    <p class="card-rocket-name">${rocket.name} - </p>
                    <p class="card-rocket-company">${rocket.company.name}</p>
                </div>
                <div class="container-img-rocket">
                    <img src="${rocket.image}" alt="${rocket.name}">
                </div>
            </div>
            <div class="rocket-name">
                <p class="info">Altezza: ${rocket.height.value} ${rocket.height.unit}</p>
                <p class="info">Diametro: ${rocket.diameter.value} ${rocket.diameter.unit}</p>
                <p class="info">Massa: ${rocket.mass.value} ${rocket.mass.unit}</p>
            </div>
        `
        cardCatalogo.addEventListener("click", () => RenderRocketInfo(rocket))
        containerCatalogo.appendChild(cardCatalogo)
    });
}

inpSearch.addEventListener("input", () => {
})

function RenderRocketInfo(rocket) {
    searchFilter.classList.add("hidden")
    containerCatalogo.innerHTML = ""
    const rocketDetailCard = document.createElement("div")
    rocketDetailCard.classList.add("rocket-card-detail")
    rocketDetailCard.innerHTML = `
        <button id="btnBack">
            <ion-icon name="arrow-back-outline"></ion-icon>
            torna indietro
        </button>
        <div class="container-rocket-info">
            <div class="rocket-name">
                <p class="card-rocket-detail">${rocket.name}</p>
                
            </div>
            <div class="card-rocket-company">
              <p class="card-rocket-detail"> ${rocket.company.name}</p>
              <div class="container-logo-card">
                <img src="${rocket.company.logo}" alt="Logo di: ${rocket.company.name}">
              </div>
            </div>
            <div class="container-img-rocket">
                <img src="${rocket.image}" alt="${rocket.name}">
            </div>
        </div>
        <div class="rocket-name">
            <p class="info">Altezza: ${rocket.height.value} ${rocket.height.unit}</p>
            <p class="info">Diametro: ${rocket.diameter.value} ${rocket.diameter.unit}</p>
            <p class="info">Massa: ${rocket.mass.value} ${rocket.mass.unit}</p>
        </div>
    `
    const divStages = document.createElement("div")
        divStages.classList.add("rocket-stages")
        divStages.innerHTML = `
            <p class="stages">Numero di stadi: ${rocket.stages.stageNumber}</p>
        `
        const { stageNumber, firstStageEngine, secondStageEngine, thirdStageEngine } = rocket.stages;
        
        divStages.innerHTML += `
            <p class="stage-number"><strong>Primo stadio: </strong></p>
            <div class="stage-info">
              <p class="info">Numero motori:<strong> ${rocket.stages.firstStageEngine.engineCount}</strong></p>
              <p class="info">Nome motore: <strong> ${rocket.stages.firstStageEngine.engineName}</strong></p>
            </div>
        `

        if (stageNumber >= 2) {
            divStages.innerHTML += `
        <p class="stage-number"><strong>Secondo stadio</strong></p>
        <div class="stage-info">
          <p class="info">Numero motori: <strong> ${rocket.stages.secondStageEngine.engineCount}</strong></p>
          <p class="info">Nome motore: <strong> ${rocket.stages.secondStageEngine.engineName}</strong></p>
        </div>
      `;
    }
    
    if (stageNumber >= 3) {
        divStages.innerHTML += `
        <p class="stage-number"><strong>Terzo stadio</strong></p>
        <div class="stage-info">
          <p class="info">Numero motori: <strong> ${rocket.stages.thirdStageEngine.engineCount}</strong></p>
          <p class="info">Nome motore: <strong> ${rocket.stages.thirdStageEngine.engineName}</strong></p>
        </div>
          `;
    }
    containerCatalogo.appendChild(rocketDetailCard)
    rocketDetailCard.appendChild(divStages)

    document.getElementById("btnBack").addEventListener("click", () => {
        searchFilter.classList.remove("hidden")
        updatedView()
    })
    
}
