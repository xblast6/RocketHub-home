// signup.js
const BASE_URL     = "http://localhost:5010";
const SIGNUP_URL   = `${BASE_URL}/auth/signup`;
const GOOGLE_URL   = `${BASE_URL}/auth/google`;
const form         = document.getElementById("signupForm");
const googleBtn    = document.getElementById("googleSignup");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch(SIGNUP_URL, {
      method: "POST",
      body: formData
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.error || body.message || "Registrazione fallita");
    }

    alert(body.message || "Registrazione avvenuta con successo!");
    window.location.href = "index.html";

  } catch (err) {
    alert("Errore: " + err.message);
  }
});

googleBtn.addEventListener("click", () => {
  window.location.href = GOOGLE_URL;
});
