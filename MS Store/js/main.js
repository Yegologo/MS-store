// Variables globales
let cart = [];
let products = [
    {
        id: 1,
        name: "Harina de Trigo Premium",
        price: 19.99,
        description: "Harina de trigo de alta calidad para repostería",
        image: "img/product1.jpg",
        category: "harinas"
    },
    {
        id: 2,
        name: "Chocolate para Repostería",
        price: 29.99,
        description: "Chocolate negro 70% cacao para coberturas",
        image: "img/product2.jpg",
        category: "chocolates"
    },
    {
        id: 3,
        name: "Set de Boquillas",
        price: 24.99,
        description: "Set de boquillas profesionales para decoración",
        image: "img/product3.jpg",
        category: "decoracion"
    },
    {
        id: 4,
        name: "Molde para Cupcakes",
        price: 15.99,
        description: "Molde de silicona para 12 cupcakes",
        image: "img/product4.jpg",
        category: "moldes"
    }
];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const cartModal = document.getElementById('cartModal');
const loginModal = document.getElementById('loginModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTax = document.getElementById('cartTax');
const cartCount = document.querySelector('.cart-count');
const closeButtons = document.querySelectorAll('.close');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navContainer = document.querySelector('.nav-container');
const categoryButtons = document.querySelectorAll('.category-filter button');
const loginTabs = document.querySelectorAll('.login-tabs button');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupModalListeners();
    setupSearchFunctionality();
    setupFormListeners();
    setupMobileMenu();
    setupCategoryFilter();
    setupLoginTabs();
});

// Mobile Menu
function setupMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        mobileMenuBtn.innerHTML = navContainer.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Category Filter
function setupCategoryFilter() {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Actualizar botones activos
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrar productos
            const filteredProducts = category === 'todos' 
                ? products 
                : products.filter(product => product.category === category);
            
            displayProducts(filteredProducts);
        });
    });
}

// Login Tabs
function setupLoginTabs() {
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Actualizar tabs activos
            loginTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mostrar formulario correspondiente
            if (tabName === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });
}

// Funciones de productos
function displayProducts(productsToShow) {
    productsContainer.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        showNotification('Producto agregado al carrito');
    }
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">×</button>
            </div>
        </div>
    `).join('');

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function updateItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Funciones de búsqueda
function setupSearchFunctionality() {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Funciones de modal
function setupModalListeners() {
    // Abrir modales
    document.querySelector('.cart-btn').addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
    });

    document.querySelector('.login-btn').addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    // Cerrar modales
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartModal.style.display = 'none';
            loginModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal || e.target === loginModal) {
            cartModal.style.display = 'none';
            loginModal.style.display = 'none';
        }
    });
}

// Funciones de formularios
function setupFormListeners() {
    const contactForm = document.getElementById('contactForm');
    const loginForm = document.getElementById('loginForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario de contacto
    showNotification('Mensaje enviado correctamente');
    e.target.reset();
}

function handleLoginSubmit(e) {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    showNotification('Inicio de sesión exitoso');
    loginModal.style.display = 'none';
}

// Utilidades
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

// Smooth Scroll Handler
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80; // Height of fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
}); 