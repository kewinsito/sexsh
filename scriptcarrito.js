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