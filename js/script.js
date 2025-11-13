document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Cart toggle
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // Sample product data (in a real app, this would come from a backend)
    const products = [
        {
            id: 1,
            name: 'NLV Bible',
            price: 499.99,
            image: 'media/4.jpg',
            category: 'bibles',
            featured: true,
            badge: 'New Arrival'
        },
        {
            id: 2,
            name: 'Creative Illustrators Bible',
            price: 949.99,
            image: 'media/9.jpg',
            category: 'bibles',
            featured: true,
            badge: 'Bestseller'
        },
        {
            id: 3,
            name: 'Rooted in Faith Tee – White',
            price: 529.99,
            image: 'media/1.jpg',
            category: 'apparel',
            featured: true,
            badge: 'Staff Pick'
        },
        {
            id: 4,
            name: 'Faith Wooden Coaster Set',
            price: 479.99,
            image: 'media/8.jpg',
            category: 'decor',
            featured: true
        }
    ];

    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Display products
    function displayProducts() {
        const productsGrid = document.querySelector('.products-grid');
        
        if (!productsGrid) return;
        
        // Filter featured products
        const featuredProducts = products.filter(product => product.featured);
        
        // Clear existing content
        productsGrid.innerHTML = '';
        
        // Add products to the grid
        featuredProducts.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.animationDelay = `${index * 0.1}s`;
            
            // Add badge if exists
            const badge = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badge}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <span class="product-price">R${product.price.toFixed(2)}</span>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners to the new buttons
        addProductEventListeners();
    }
    
    // Add event listeners to product buttons
    function addProductEventListeners() {
        // Add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
        
        // View details buttons have been removed
    }
    
    // Add to cart function
    function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // Update cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI
        updateCartUI();
        
        // Show added to cart feedback
        const button = e.target;
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
        
        // Update cart items in sidebar
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.querySelector('.total-amount');
        const checkoutButton = document.querySelector('.checkout-btn');
        
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            if (cartTotalElement) cartTotalElement.textContent = '$0.00';
            if (checkoutButton) checkoutButton.disabled = true;
            return;
        }
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart items
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">R${item.price.toFixed(2)} x ${item.quantity}</span>
                    <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update total
        if (cartTotalElement) {
            cartTotalElement.textContent = `R${total.toFixed(2)}`;
        }
        
        // Enable/disable checkout button
        if (checkoutButton) {
            checkoutButton.disabled = cart.length === 0;
        }
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
    
    // Remove from cart
    function removeFromCart(e) {
        const productId = parseInt(e.target.dataset.id);
        cart = cart.filter(item => item.id !== productId);
        
        // Update cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI
        updateCartUI();
    }
    
    // Initialize the page
    function init() {
        displayProducts();
        updateCartUI();
        
        // Add scroll event for navbar
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Animate elements on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.product-card, .slide-left, .slide-right, .slide-up');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.style.opacity = '1';
                    element.style.transform = 'translate(0, 0)';
                }
            });
        };
        
        // Initial check for elements in viewport
        animateOnScroll();
        
        // Check on scroll
        window.addEventListener('scroll', animateOnScroll);
        
        // Testimonial slider
        const testimonials = document.querySelectorAll('.testimonial');
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                if (i === index) {
                    testimonial.classList.add('active');
                } else {
                    testimonial.classList.remove('active');
                }
            });
        }
        
        // Auto-rotate testimonials
        if (testimonials.length > 1) {
            setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            }, 5000);
        }
    }
    
    // Run initialization
    init();
});
