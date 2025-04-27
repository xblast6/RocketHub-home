const BASE_URL      = "http://localhost:5010";
const LOGIN_URL     = `${BASE_URL}/auth/login`;
const GOOGLE_URL    = `${BASE_URL}/auth/google`;
const loginForm     = document.getElementById("loginForm");
const googleButton  = document.getElementById("googleLogin");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email    = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login fallito");
    }

    const { token } = await res.json();

    localStorage.setItem("token", token);

    window.location.href = "index.html";
  } catch (err) {
    alert("Errore: " + err.message);
  }
});

googleButton.addEventListener("click", () => {
  window.location.href = GOOGLE_URL;
});
