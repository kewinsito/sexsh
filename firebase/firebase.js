// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHMEaDhtxixycfamuEMC64t6Uy1GA5xoo",
  authDomain: "sexshopweb-c934a.firebaseapp.com",
  projectId: "sexshopweb-c934a",
  storageBucket: "sexshopweb-c934a.firebasestorage.app",
  messagingSenderId: "604810062898",
  appId: "1:604810062898:web:f0f41ce212544c5da3a02b"
};

// Inicialización de Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

//inicio sesion
const loginForm = document.getElementById('signin-form');
const pushMessage = document.getElementById('pushMessage');
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Mensaje de éxito
        pushMessage.innerText = '¡Has iniciado sesión con éxito!';
        pushMessage.style.display = 'block';

        // Redirigir después de un breve retraso
        setTimeout(() => {
            pushMessage.style.display = 'none';
            window.location.href = 'PanAdmin.html';
        }, 1000);
        })
        .catch(error => alert(error.message));
}
function logout() {
  auth.signOut()
      .then(() => {
        window.location.href = 'index.html';
      })
      .catch(error => alert(error.message));
}
