document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize any header-specific functionality
            initializeHeader();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            // Initialize any footer-specific functionality
            initializeFooter();
        })
        .catch(error => console.error('Error loading footer:', error));
});

function initializeHeader() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Search functionality
    const searchForm = document.querySelector('.search-bar');
    if (searchForm) {
        const searchInput = searchForm.querySelector('input');
        const searchButton = searchForm.querySelector('button');
        
        searchButton.addEventListener('click', () => {
            if (searchInput.value.trim()) {
                window.location.href = `catalog.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.location.href = '../pages/cart.html';
        });
    }
}

function initializeFooter() {
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value.trim()) {
                // Here you would typically send the email to your backend
                alert('¡Gracias por suscribirte!');
                emailInput.value = '';
            }
        });
    }

    // Social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            // Here you would typically handle social media platform redirection
            alert(`Redirigiendo a ${platform}`);
        });
    });
} 