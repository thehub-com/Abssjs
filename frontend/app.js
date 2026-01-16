const API_URL = "https://absai-hd6q.onrender.com/api/chat";

/* ---------- FIREBASE ---------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDq3tDQnBFXrKW-66JxFPaWG3uso_3XXYY",
  authDomain: "abs-ai-ec395.firebaseapp.com",
  projectId: "abs-ai-ec395",
  appId: "1:333050406333:web:51bb5db3c08a75e0e8ded4"
};

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);

/* ---------- UI ---------- */
const authBox = document.getElementById("auth");
const appBox = document.getElementById("app");
const chat = document.getElementById("chat");
const input = document.getElementById("prompt");

/* ---------- STORAGE ---------- */
let messages = JSON.parse(localStorage.getItem("abs_chat") || "[]");
messages.forEach(m => addMsg(m.text, m.role));

function save() {
  localStorage.setItem("abs_chat", JSON.stringify(messages));
}

/* ---------- AUTH ---------- */
onAuthStateChanged(auth, u => {
  if (u) {
    authBox.classList.add("hidden");
    appBox.classList.remove("hidden");
  }
});

login.onclick = () =>
  signInWithEmailAndPassword(auth, email.value, password.value);

register.onclick = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value);

google.onclick = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

/* ---------- CHAT ---------- */
send.onclick = send;
input.onkeydown = e => e.key === "Enter" && send();
newChat.onclick = () => {
  messages = [];
  chat.innerHTML = "";
  save();
};

async function send() {
  const text = input.value.trim();
  if (!text) return;

  addMsg(text, "user");
  messages.push({ role: "user", text });
  save();
  input.value = "";

  const botDiv = addMsg("", "bot");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: text })
  });

  const data = await res.json();

  // ПСЕВДО-СТРИМИНГ
  let i = 0;
  const txt = data.answer || "Ошибка";
  const timer = setInterval(() => {
    botDiv.textContent += txt[i++];
    chat.scrollTop = chat.scrollHeight;
    if (i >= txt.length) {
      clearInterval(timer);
      messages.push({ role: "bot", text: txt });
      save();
    }
  }, 15);
}

function addMsg(text, role) {
  const d = document.createElement("div");
  d.className = `msg ${role}`;
  d.textContent = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return d;
}
