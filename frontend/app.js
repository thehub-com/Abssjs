// 🔗 BACKEND
const API_URL = "https://absai-hd6q.onrender.com/api/chat";

// 🔥 FIREBASE
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

const appFB = initializeApp(firebaseConfig);
const auth = getAuth(appFB);

// UI
const authBox = document.getElementById("auth");
const appBox = document.getElementById("app");
const chat = document.getElementById("chat");

onAuthStateChanged(auth, user => {
  if (user) {
    authBox.classList.add("hidden");
    appBox.classList.remove("hidden");
  }
});

// AUTH
document.getElementById("login").onclick = () =>
  signInWithEmailAndPassword(auth, email.value, password.value);

document.getElementById("register").onclick = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value);

document.getElementById("google").onclick = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

// CHAT
document.getElementById("send").onclick = send;
document.getElementById("prompt").addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

async function send() {
  const input = document.getElementById("prompt");
  const text = input.value.trim();
  if (!text) return;

  addMsg(text, "user");
  input.value = "";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: text })
  });

  const data = await res.json();
  addMsg(data.answer || "Ошибка", "bot");
}

function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
