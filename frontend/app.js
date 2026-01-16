// ===== BACKEND =====
const BACKEND_URL = "https://absai-hd6q.onrender.com";

// ===== FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===== UI =====
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

let messages = [
  { role: "system", text: "Ты ассистент ABS AI." }
];

// ===== AUTH =====
window.login = async () => {
  await signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  );
};

window.register = async () => {
  await createUserWithEmailAndPassword(
    auth,
    email.value,
    password.value
  );
};

window.google = async () => {
  await signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("chatbox").style.display = "block";
  }
});

// ===== CHAT =====
sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage("Ты", text);
  input.value = "";

  messages.push({ role: "user", text });

  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  const data = await res.json();
  addMessage("ABS AI", data.reply);

  messages.push({ role: "assistant", text: data.reply });
};

// ===== UI HELPERS =====
function addMessage(author, text) {
  const div = document.createElement("div");
  div.className = author === "Ты" ? "me" : "bot";
  div.innerHTML = `<b>${author}:</b> ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
