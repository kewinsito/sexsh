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

const loginForm = document.getElementById('signin-form');
const productForm = document.getElementById('product-form');
const pushMessage = document.getElementById('pushMessage');


//registro
function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const admin = false;

  auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
          // Usuario registrado correctamente
          const user = userCredential.user;
          alert('Usuario registrado con éxito');

          // Guardar usuario en la colección 'Usuarios' usando el uid como documento
          return db.collection('Usuarios').doc(user.uid).set({
              email: email,
              admin: admin
          });
      })
      .then(() => {
          alert("Guardado con éxito");

          // Limpiar los campos de entrada
          document.getElementById('email').value = '';
          document.getElementById('password').value = '';

          // Redirigir a la página de inicio
          window.location.href = 'index.html';
      })
      .catch(error => {
          alert(error.message);
      });
}


function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
          // Usuario autenticado con éxito
          const user = userCredential.user;

          // Referencia al documento del usuario en la colección 'Usuarios'
          return db.collection('Usuarios').doc(user.uid).get();
      })
      .then(doc => {
          if (doc.exists) {
              // Obtener el valor de admin desde el documento del usuario
              const isAdmin = doc.data().admin;
              
              // Mensaje de éxito
              const pushMessage = document.getElementById('pushMessage');
              pushMessage.innerText = '¡Has iniciado sesión con éxito!';
              pushMessage.style.display = 'block';

              // Redirigir después de un breve retraso
              setTimeout(() => {
                  pushMessage.style.display = 'none';
                  if (isAdmin) {
                      window.location.href = 'PanAdmin.html';
                  } else {
                      window.location.href = 'index.html';
                  }
              }, 1000);
          } else {
              alert("No se encontró la información del usuario");
          }
      })
      .catch(error => {
          alert(error.message);
      });
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
// Función para añadir o actualizar un producto en el carrito
function addProductoCarrito(productoId) {
    // Verificar si el usuario está autenticado
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        return;
    }

    // Referencia al carrito del usuario autenticado en Firestore
    const carritoRef = firebase.firestore().collection('carrito').doc(user.uid).collection('productos');

    // Buscar si el producto ya existe en el carrito del usuario
    carritoRef.where('productoId', '==', productoId).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Si el producto ya está en el carrito, aumenta la cantidad
                const docRef = querySnapshot.docs[0].ref;
                const currentCantidad = querySnapshot.docs[0].data().cantidad;

                docRef.update({
                    cantidad: currentCantidad + 1
                }).then(() => {
                    console.log("Cantidad actualizada en el carrito");
                }).catch((error) => {
                    console.error("Error al actualizar la cantidad en el carrito: ", error);
                });
            } else {
                // Si el producto no está en el carrito, lo agrega con cantidad inicial de 1
                carritoRef.add({
                    productoId: productoId,
                    cantidad: 1,
                    fechaAñadido: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    alert("Producto añadido al carrito");
                }).catch((error) => {
                    console.error("Error al añadir el producto al carrito: ", error);
                });
            }
        })
        .catch((error) => {
            console.error("Error al buscar el producto en el carrito: ", error);
        });
}
function añadirCarritoSS(productoId) {
    // Verificar si el usuario ha iniciado sesión
    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        return;
    }

    // Referencia al carrito del usuario autenticado en Firestore
    const carritoRef = firebase.firestore().collection('carrito').doc(user.uid).collection('productos');

    // Buscar si el producto ya existe en el carrito del usuario
    carritoRef.where('productoId', '==', productoId).get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Si el producto ya está en el carrito, aumenta la cantidad
                const docRef = querySnapshot.docs[0].ref;
                const currentCantidad = querySnapshot.docs[0].data().cantidad;

                docRef.update({
                    cantidad: currentCantidad + 1
                }).then(() => {
                    console.log("Cantidad actualizada en el carrito");
                }).catch((error) => {
                    console.error("Error al actualizar la cantidad en el carrito: ", error);
                });
            } else {
                // Si el producto no está en el carrito, lo agrega con cantidad inicial de 1
                carritoRef.add({
                    productoId: productoId,
                    cantidad: 1,
                    fechaAñadido: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    alert("Producto añadido al carrito");
                }).catch((error) => {
                    alert("Error al añadir el producto al carrito: ", error);
                });
            }
        })
        .catch((error) => {
            alert("Error al buscar el producto en el carrito: ", error);
        });
}
