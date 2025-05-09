// DOM Elements
const catalogProducts = document.getElementById('catalogProducts');
const viewButtons = document.querySelectorAll('.view-btn');
const sortSelect = document.querySelector('.sort-select');
const priceSlider = document.querySelector('.price-slider');
const minPriceInput = document.querySelector('.min-price');
const maxPriceInput = document.querySelector('.max-price');
const applyFiltersBtn = document.querySelector('.apply-filters');
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
const shippingCheckboxes = document.querySelectorAll('input[name="shipping"]');


// Sample Products Data (Replace with your actual data)
const products = [
    {
        id: 1,
        name: "Harina de Trigo Premium",
        price: 19.99,
        description: "Harina de trigo de alta calidad para repostería",
        image: "../img/product1.jpg",
        category: "harinas",
        shipping: "free",
        location: "Ciudad de México"
    },
    {
        id: 2,
        name: "Chocolate para Repostería",
        price: 29.99,
        description: "Chocolate negro 70% cacao para coberturas",
        image: "../img/product2.jpg",
        category: "chocolates",
        shipping: "express",
        location: "Guadalajara"
    },
    {
        id: 3,
        name: "Set de Boquillas",
        price: 24.99,
        description: "Set de boquillas profesionales para decoración",
        image: "../img/product3.jpg",
        category: "decoracion",
        shipping: "free",
        location: "Monterrey"
    },
    {
        id: 4,
        name: "Molde para Cupcakes",
        price: 15.99,
        description: "Molde de silicona para 12 cupcakes",
        image: "../img/product4.jpg",
        category: "moldes",
        shipping: "express",
        location: "Puebla"
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // View Toggle
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            catalogProducts.classList.toggle('list-view', button.dataset.view === 'list');
        });
    });

    // Sort Products
    sortSelect.addEventListener('change', () => {
        const sortedProducts = [...products];
        switch (sortSelect.value) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => b.id - a.id);
                break;
        }
        displayProducts(sortedProducts);
    });

    // Price Range
    priceSlider.addEventListener('input', () => {
        maxPriceInput.value = priceSlider.value;
    });

    minPriceInput.addEventListener('change', () => {
        if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
            minPriceInput.value = maxPriceInput.value;
        }
    });

    maxPriceInput.addEventListener('change', () => {
        if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
            maxPriceInput.value = minPriceInput.value;
        }
        priceSlider.value = maxPriceInput.value;
    });

    // Apply Filters
    applyFiltersBtn.addEventListener('click', applyFilters);
}

// Display Products
function displayProducts(productsToShow) {
    catalogProducts.innerHTML = productsToShow.map(product => `
        <div class="catalog-product">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-shipping">
                    <i class="fas fa-truck"></i>
                    ${product.shipping === 'free' ? 'Envío gratis' : 'Envío express'}
                </p>
                <p class="product-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${product.location}
                </p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar
                </button>
            </div>
        </div>    
    `).join('');
}

// Apply Filters
function applyFilters() {
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || 1000;
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const selectedShipping = Array.from(shippingCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const filteredProducts = products.filter(product => {
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const shippingMatch = selectedShipping.length === 0 || selectedShipping.includes(product.shipping);
        return priceMatch && categoryMatch && shippingMatch;
    });

    displayProducts(filteredProducts);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Producto agregado al carrito');
    }
}

// Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 