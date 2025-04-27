const containerCountdown = document.getElementById("containerCountdown")
const countdownFilter = document.getElementById("countdownFilter")

const ULR_BASE = "http://localhost:5010"
const URL_COUNTDOWN = ULR_BASE + "/countdowns"

let countdownArray = []



window.addEventListener("DOMContentLoaded", () => {
    fetchCountdown();
    countdownFilter.addEventListener("change", updatedView);
  });

function fetchCountdown() {
    const token = localStorage.getItem("token");
    fetch(URL_COUNTDOWN, {
        headers: { 
          "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(countdowns => {
        console.log(countdowns);
        const futureCountdown = countdowns.filter(countdown => new Date(countdown.launchDate) > new Date())
        countdownArray = futureCountdown
        updatedView()
    })
    .catch(err => console.log("Errore: ", err))
}

function renderCountdowns(countdowns) {
    countdowns.forEach(countdown => {
        const timerId = `timer-${countdown._id}`
        const countdownBox = document.createElement("div")
        countdownBox.classList.add("container-countdown-box")
        countdownBox.innerHTML = `
            <div class="container-info-countdown">
                <p>Razzo: <strong>${countdown.rocket.name}</strong></p>
                <p>Azienda: <strong>${countdown.rocket.company.name}</strong></p>
            </div>
            <div class="container-info-countdown">
                <p>Giorno del lancio: <strong>${new Date(countdown.launchDate).toLocaleString()}</strong></p>
                <p>Descrizione del lancio: ${countdown.description}</p>
                <p>Link alla <a href="${countdown.liveStreamUrl}">live</a></p>
                <div class="container-difference-time-countdown">
                    <p>Mancano:</p>
                    <strong><div id="${timerId}" class="countdown-timer"></div></strong>
                </div>
            </div>
            <div class="container-interact-reaction">
                <button class="btn-reaction-toggle">Aggiungi una reazione</button>
                <div class="container-reactions hidden-reaction">
                    <p class="reactions" data-reaction="launch">🚀 No problem <span class="reaction-count">0</span></p>
                    <p class="reactions" data-reaction="explosion">💥 Esplode <span class="reaction-count">0</span></p>
                    <p class="reactions" data-reaction="delay">🕒 Rimandato <span class="reaction-count">0</span></p>
                    <p class="reactions" data-reaction="weather">⛈️ problemi meteo <span class="reaction-count">0</span></p>
                </div>
            </div>
        `
        
        containerCountdown.appendChild(countdownBox)
        startCountdown(`#${timerId}`, countdown.launchDate)

        const btnToggle = countdownBox.querySelector(".btn-reaction-toggle")
        const reactionContainer = countdownBox.querySelector(".container-reactions");
        btnToggle.addEventListener("click", () => {
            reactionContainer.classList.toggle("show");
        })

        const reactionButtons = countdownBox.querySelectorAll(".reactions")
        reactionButtons.forEach(btn => {
            const type = btn.dataset.reaction

            if (!btn.querySelector(".reaction-count")) {
                btn.innerHTML += ` <span class="reaction-count">0</span>`;
              }
              const span = btn.querySelector(".reaction-count");

              const reactionCount = countdown.reactions?.filter(reaction => reaction.type === type).length || 0;
              span.textContent = reactionCount

            btn.addEventListener("click", () => {
                sendReaction(countdown._id, type)
            })
        })
    });
}

let activeIntervals = [];

function clearAllIntervals() {
    activeIntervals.forEach(id => clearInterval(id))
    activeIntervals = []
}

function startCountdown(id, launchDate) {
   const container = document.querySelector(id)
   if (!container) {
    return
   }
   const targetDate = new Date(launchDate)

   function differenceTimeCountdown() {
    const diffTime = targetDate - new Date()
    const day = Math.floor(diffTime / (1000*60*60*24))
    const hour = Math.floor((diffTime / (1000*60*60)) % 24)
    const minute = Math.floor((diffTime / (1000*60)) % 60)
    const second = Math.floor((diffTime / 1000) % 60)

    container.textContent = `${day} Giorni ` + `${hour} Ore ` + `${minute} Minuti ` + `${second} Secondi `
   }

   differenceTimeCountdown()
   const intervall = setInterval(differenceTimeCountdown, 1000)
   activeIntervals.push(intervall)
}

function updatedView() {
    clearAllIntervals()
    containerCountdown.innerHTML = "";
    let filteredCountdown = [...countdownArray]
    
    const ordinaSecondo = countdownFilter.value
    switch (ordinaSecondo) {
        case "launchDate":
            filteredCountdown.sort((a, b) => 
                new Date(a.launchDate) - new Date(b.launchDate)
            );
        break;
    
        case "rocket":
            filteredCountdown.sort((a, b) => 
            a.rocket.name.localeCompare(b.rocket.name)
          );
        break;
      }
      renderCountdowns(filteredCountdown)
}

function sendReaction(id, type) {
    const token = localStorage.getItem("token");
    console.log("Token usato:", token);
    fetch(`${URL_COUNTDOWN}/${id}/reactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ type })
    })
    .then(res => res.json())
    .then(reactions => {
        const countIndex = countdownArray.findIndex(countdown => countdown._id === id)
        if (countIndex > 0) {
            countdownArray[countIndex].reactions = reactions
        }
        updatedView()
    })
    .catch(err => console.log("Errore nella reazione:", err));
}



