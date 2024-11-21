function updateTotal(element) {
    // Obtener la fila del producto
    const row = element.closest('tr');
    
    // Obtener el precio base del producto
    const price = parseInt(row.querySelector('.price').getAttribute('data-price'));

    // Obtener la cantidad ingresada por el usuario
    const quantity = parseInt(element.value);

    // Calcular el total para este producto
    const total = price * quantity;

    // Actualizar el campo de total en la fila
    row.querySelector('.total').innerText = total.toLocaleString('es-CO');

    // Actualizar el subtotal general
    updateSubtotal();
}

function updateSubtotal() {
    let subtotal = 0;

    // Obtener todos los totales de productos
    document.querySelectorAll('.total').forEach(function(totalElement) {
        subtotal += parseInt(totalElement.innerText.replace(/\./g, ''));
    });

    // Actualizar el subtotal
    document.getElementById('subtotal').innerText = subtotal.toLocaleString('es-CO');
}

function mostrarCarrito(uid) {
    const tableBody = document.getElementById('carrito');
    tableBody.innerHTML = ''; // Limpiar carrito antes de actualizar
    let subtotal = 0; // Inicializar el subtotal

    db.collection('carrito').doc(uid).collection('productos').get().then(snapshot => {
        const productoPromises = [];

        snapshot.forEach(doc => {
            const productoId = doc.data().productoId;
            const quitar = doc.id;
            const colecciones = ['Toys', 'Lenceria', 'Novedades'];

            colecciones.forEach(coleccion => {
                // Agregar cada consulta a un array de promesas
                productoPromises.push(
                    db.collection(coleccion).doc(productoId).get().then(productoDoc => {
                        if (productoDoc.exists) {
                            const producto = productoDoc.data();
                            const tr = document.createElement('tr');
                            subtotal += parseInt(producto.precioProduct);

                            tr.innerHTML = `
                                <td>
                                    <div class="product-name">${producto.nameProduct}</div>
                                    <div><span class="remove-link" onclick="quitarDelCarrito('${uid}', '${quitar}')">Quitar</span></div>
                                </td>
                                <td>$<span class="price" data-price="${producto.precioProduct}">${producto.precioProduct.toLocaleString()}</span></td>
                                <td>
                                    <input type="number" class="quantity-input" value="1" min="1" onchange="updateTotal(this)">
                                </td>
                                <td>$<span class="total">${producto.precioProduct.toLocaleString()}</span></td>
                            `;
                            tableBody.appendChild(tr);
                        }
                    }).catch(error => {
                        console.error("Error al obtener detalles del producto:", error);
                    })
                );
            });
        });

        // Esperar a que todas las promesas de productos se resuelvan
        Promise.all(productoPromises).then(() => {
            // Actualizar el subtotal después de cargar todos los productos
            document.getElementById('subtotal').innerText = subtotal.toLocaleString('es-CO');
        });
    }).catch(error => {
        console.error("Error al cargar el carrito:", error);
    });
}

function quitarDelCarrito(uid, quitar) {
    db.collection('carrito').doc(uid).collection('productos').doc(quitar).delete().then(() => {
        alert('Producto eliminado del carrito');
        mostrarCarrito(uid); // Recargar carrito
    }).catch(error => {
        alert("Error al eliminar producto:", error);
    });
}
function irPagar() {
    const subtotalElement = document.getElementById('subtotal');
    const subtotal = parseInt(subtotalElement.textContent, 10); // Convierte el valor del subtotal a entero
    if (isNaN(subtotal)) {
        alert('El subtotal no es un número válido');
        return;
    }
    window.location.href = `Pago.html?total=${subtotal}`;
}
