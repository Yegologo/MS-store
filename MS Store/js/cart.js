document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartSummary();
});

function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-items');
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <a href="/" class="continue-shopping">Continuar comprando</a>
            </div>
        `;
        return;
    }

    cartContainer.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantityInput(${index}, this.value)">
                <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <i class="fas fa-times remove-item" onclick="removeItem(${index})"></i>
        </div>
    `).join('');
}

function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newQuantity = (cart[index].quantity || 1) + change;
    
    if (newQuantity < 1) return;
    
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartSummary();
}

function updateQuantityInput(index, value) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newQuantity = parseInt(value);
    
    if (newQuantity < 1) {
        loadCart();
        return;
    }
    
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartSummary();
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartSummary();
    updateCartCount();
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.16; // 16% IVA
    const shipping = subtotal > 1000 ? 0 : 150; // Envío gratis en compras mayores a $1000
    const total = subtotal + tax + shipping;

    document.querySelector('.cart-summary').innerHTML = `
        <h3>Resumen del Pedido</h3>
        <div class="summary-item">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>IVA (16%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Envío</span>
            <span>${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-total">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">Proceder al pago</button>
        <a href="/" class="continue-shopping">Continuar comprando</a>
    `;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

function proceedToCheckout() {
    // Implementar la lógica de checkout aquí
    alert('Redirigiendo al proceso de pago...');
} 