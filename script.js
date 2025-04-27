const btnMenu = document.getElementById("btnMenu")
const menuSection = document.getElementById("menuSection")
const navButtons = document.querySelectorAll(".container-navbar");

const countdownEl = document.getElementById("countdown");
const ULR_BASE = "http://localhost:5010"
const URL_COUNTDOWN = ULR_BASE + "/countdowns"


console.log("btnMenu:", btnMenu);
console.log("btnMenu.addEventListener:", btnMenu && btnMenu.addEventListener);

  (function handleOAuthToken() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  })();


window.addEventListener("scroll", () => {
  const scrolledBeyond300 = window.scrollY > 300;
  navButtons.forEach(btnNav => {
    btnNav.classList.toggle("white", scrolledBeyond300);
  });
});




function fetchNextCountdown() {
  fetch(URL_COUNTDOWN + "/nextCountdown")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      renderNextCountdown(data)
    })
    .catch(err => console.log("Errore: ", err))
}

function renderNextCountdown(data) {
  countdownDifferenceTime(data.launchDate)

}

// script.js
window.addEventListener("DOMContentLoaded", () => {
  const btnMenu     = document.getElementById("btnMenu");
  const menuSection = document.getElementById("menuSection");
  const daysSpan    = document.getElementById("days");
  const hoursSpan   = document.getElementById("hours");
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");

  if (!btnMenu || !menuSection) {
    console.error("❌ Mancano #btnMenu o #menuSection");
    return;
  }

  btnMenu.addEventListener("click", () =>
    menuSection.classList.toggle("aperto")
  );

  function countdownDifferenceTime(dateString) {
    const targetDate = new Date(dateString);
    let timerId;

    function tick() {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        clearInterval(timerId);
        return fetchNextCountdown(); 
      }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4)  / 1000);

      daysSpan.textContent    = String(d).padStart(2, "0");
      hoursSpan.textContent   = String(h).padStart(2, "0");
      minutesSpan.textContent = String(m).padStart(2, "0");
      secondsSpan.textContent = String(s).padStart(2, "0");
    }

    tick();
    timerId = setInterval(tick, 1000);
  }

  function renderNextCountdown(data) {
    if (!data?.launchDate) {
      console.warn("Nessun launchDate");
      return;
    }
    countdownDifferenceTime(data.launchDate);
  }

  function fetchNextCountdown() {
    fetch("http://localhost:5010/countdowns/nextCountdown")
      .then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(renderNextCountdown)
      .catch(err => console.error("❌ fetchNextCountdown:", err));
  }

  // E finalmente
  fetchNextCountdown();
});


const navLinks = Array.from(document.querySelectorAll('.container-navbar a'))
  .filter(a => a.getAttribute('href') !== 'login.html');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      window.location.href = 'login.html';
    }
  });
});


if (countdownEl) {
  const daySpan     = document.getElementById("days");
  const hoursSpan   = document.getElementById("hours");
  const minutesSpan = document.getElementById("minutes");
  const secondSpan = document.getElementById("seconds");
  function countdownDifferenceTime(dateString) {
    const targetDate = new Date(dateString);
  
  
    function tick() {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        clearInterval(timerId);
        fetchNextCountdown();
        return;
      }
  
      const days = Math.floor(diff / 864e5);
      const hours = Math.floor((diff % 864e5) / 36e5);
      const minutes = Math.floor((diff % 36e5) / 6e4);
      const seconds = Math.floor((diff % 6e4) / 1000);
  
      daySpan.textContent = String(days)
      hoursSpan.textContent = String(hours)
      minutesSpan.textContent = String(minutes)
      secondSpan.textContent = String(seconds)
    }
  
    tick();
    const timerId = setInterval(tick, 1000);
  }
  window.addEventListener("DOMContentLoaded", () => {
    fetchNextCountdown();
  });
}


const protectedPages = ['countdown.html', 'razzi.html'];
const current = window.location.pathname.split('/').pop();
if (protectedPages.includes(current) && !localStorage.getItem('token')) {
  window.location.replace('login.html');
}

document.querySelectorAll('a[href="countdown.html"], a[href="razzi.html"]')
  .forEach(link => {
    link.addEventListener('click', e => {
      if (!localStorage.getItem('token')) {
        e.preventDefault();
        window.location.href = 'login.html';
      }
    });
  });
