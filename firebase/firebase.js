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
const productForm = document.getElementById('product-form');
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
function añadir() {
  const UrlProduct = document.getElementById('product-image').value;
  const nameProduct = document.getElementById('product-name').value;
  const precioProduct = document.getElementById('product-price').value;

  db.collection('Novedades').add({ UrlProduct, nameProduct, precioProduct })
      .then(docRef => {
        alert("Guardado con éxito");
          // Limpiar los campos de entrada
          document.getElementById('product-image').value = '';
          document.getElementById('product-name').value = '';
          document.getElementById('product-price').value = '';
      })
      .catch(error => alert(error.message));
}
function cargarBorEdi(){
    window.location.href="PanBorrarEditar.html"
   
}
// Función para cargar tareas
function loadTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  db.collection('Novedades').get().then(snapshot => {
    snapshot.forEach(doc => {
        const li = document.createElement('li');
        
        // Asigna dos valores específicos
        li.textContent = `Nombre: ${doc.data().nameProduct}, Precio: ${doc.data().precioProduct}`;

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => deleteTask(doc.id);
        li.appendChild(deleteButton);

        // Botón de actualizar
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Actualizar';
        updateButton.onclick = () => updateTask(doc.id);
        li.appendChild(updateButton);

        taskList.appendChild(li);
    });
});
}
function deleteTask(id) {
  db.collection('Novedades').doc(id).delete()
      .then(() => loadTasks())
      .catch(error => alert(error.message));
}

// Función para actualizar una tarea
function updateTask(id) {
  const newName = prompt('Ingrese el nuevo nombre');
  const newPrice = prompt('Ingrese el nuevo precio');
  
  if (newName && newPrice) {
      db.collection('Novedades').doc(id).update({
        nameProduct: newName,
        precioProduct: parseFloat(newPrice)  // Asegúrate de que el precio sea un número
      })
      .then(() => loadTasks())
      .catch(error => alert(error.message));
      loadTasks()
  } else {
      alert("Ambos campos son obligatorios.");
  }
}
