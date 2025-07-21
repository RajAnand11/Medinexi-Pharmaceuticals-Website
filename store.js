// Sample product data (in a real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        brand: "Medinexi",
        price: 5.99,
        image: "https://bsmedia.business-standard.com/_media/bs/img/article/2018-12/01/full/1543678350-4854.jpg?im=FeatureCrop,size=(826,465)",
        category: "otc",
        description: "Pain relief and fever reduction",
        inStock: true,
        rating: 4.5,
        ratingCount: 128,
        isNew: true,
        isSale: false
    },
    {
        id: 2,
        name: "Amoxicillin 250mg",
        brand: "HealthPlus",
        price: 12.99,
        image: "https://media.philstar.com/photos/2024/12/29/12_2024-12-29_22-25-28.jpg",
        category: "medicine",
        description: "Antibiotic medication",
        inStock: true,
        rating: 4.8,
        ratingCount: 256,
        isNew: false,
        isSale: true,
        salePrice: 10.99
    },
    // Add more products as needed
];

// State management
let currentCategory = 'all';
let currentPage = 1;
let itemsPerPage = 12;
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const prescriptionModal = document.getElementById('prescription-modal');

// Initialize the store
function initStore() {
    displayProducts();
    setupEventListeners();
}

// Display products
function displayProducts() {
    const filteredProducts = filterProducts();
    const paginatedProducts = paginateProducts(filteredProducts);
    
    productsGrid.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    updatePagination(filteredProducts.length);
}

// Create product card HTML with enhanced features
function createProductCard(product) {
    const ratingStars = createRatingStars(product.rating);
    const badge = createProductBadge(product);
    
    return `
        <div class="product-card">
            ${badge}
            <div class="quick-view-overlay">
                <button class="quick-view-btn" onclick="showQuickView(${product.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="brand">${product.brand}</p>
                <div class="product-rating">
                    <div class="rating-stars">${ratingStars}</div>
                    <span class="rating-count">(${product.ratingCount})</span>
                </div>
                <p class="description">${product.description}</p>
                <div class="product-footer">
                    <div class="price-container">
                        ${product.isSale 
                            ? `<span class="original-price">$${product.price.toFixed(2)}</span>
                               <span class="price sale">$${product.salePrice.toFixed(2)}</span>`
                            : `<span class="price">$${product.price.toFixed(2)}</span>`
                        }
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create rating stars HTML
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHtml = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Create product badge HTML
function createProductBadge(product) {
    if (product.isNew) {
        return '<span class="product-badge badge-new">New</span>';
    } else if (product.isSale) {
        return '<span class="product-badge badge-sale">Sale</span>';
    } else if (!product.inStock) {
        return '<span class="product-badge badge-out">Out of Stock</span>';
    }
    return '';
}

// Filter products based on current category and filters
function filterProducts() {
    let filtered = [...products];
    
    // Category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === currentCategory);
    }
    
    // Price filter
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
    
    // Brand filter
    const selectedBrands = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => selectedBrands.includes(product.brand.toLowerCase()));
    }
    
    return filtered;
}

// Paginate products
function paginateProducts(products) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
}

// Update pagination display
function updatePagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    document.querySelector('.current-page').textContent = currentPage;
    document.querySelector('.total-pages').textContent = totalPages;
    
    // Update button states
    document.querySelector('[data-page="prev"]').disabled = currentPage === 1;
    document.querySelector('[data-page="next"]').disabled = currentPage === totalPages;
}

// Cart management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification('Product added to cart');
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(productId, newQuantity) {
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
    showNotification('Product removed from cart');
}

// Quick view functionality
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quickViewHtml = `
        <div class="modal active" id="quick-view-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Quick View</h3>
                    <button class="close-modal" onclick="closeQuickView()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="quick-view-product">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                            ${createProductBadge(product)}
                        </div>
                        <div class="product-details">
                            <h2>${product.name}</h2>
                            <p class="brand">${product.brand}</p>
                            <div class="product-rating">
                                <div class="rating-stars">${createRatingStars(product.rating)}</div>
                                <span class="rating-count">(${product.ratingCount} reviews)</span>
                            </div>
                            <p class="description">${product.description}</p>
                            <div class="price-container">
                                ${product.isSale 
                                    ? `<span class="original-price">$${product.price.toFixed(2)}</span>
                                       <span class="price sale">$${product.salePrice.toFixed(2)}</span>`
                                    : `<span class="price">$${product.price.toFixed(2)}</span>`
                                }
                            </div>
                            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', quickViewHtml);
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.remove();
    }
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Checkout functionality
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const modal = document.getElementById('checkout-modal');
    modal.classList.add('active');

    // Update order summary
    updateOrderSummary();

    // Setup payment method change handler
    const paymentMethod = document.getElementById('paymentMethod');
    paymentMethod.addEventListener('change', handlePaymentMethodChange);

    // Close cart sidebar
    document.getElementById('cart-sidebar').classList.remove('active');
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('active');
    
    // Reset form
    document.getElementById('checkout-form').reset();
    document.getElementById('card-details').style.display = 'none';
    document.getElementById('upi-details').style.display = 'none';
}

function handlePaymentMethodChange() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardDetails = document.getElementById('card-details');
    const upiDetails = document.getElementById('upi-details');

    cardDetails.style.display = paymentMethod === 'card' ? 'block' : 'none';
    upiDetails.style.display = paymentMethod === 'upi' ? 'block' : 'none';

    // Update required attributes
    const cardInputs = cardDetails.querySelectorAll('input');
    const upiInput = upiDetails.querySelector('input');

    cardInputs.forEach(input => {
        input.required = paymentMethod === 'card';
    });
    if (upiInput) {
        upiInput.required = paymentMethod === 'upi';
    }
}

function updateOrderSummary() {
    const summaryItems = document.querySelector('.summary-items');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const totalAmount = document.querySelector('.total-amount');
    const shippingAmount = 5.00; // Fixed shipping cost

    // Update items
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;

    // Update total
    const total = subtotal + shippingAmount;
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

async function submitOrder() {
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const submitBtn = document.querySelector('.modal-footer .submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        const formData = {
            customerName: document.getElementById('customerName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: `${document.getElementById('address').value}, ${document.getElementById('city').value}, ${document.getElementById('state').value} ${document.getElementById('zipCode').value}`,
            paymentMethod: document.getElementById('paymentMethod').value,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: parseFloat(document.querySelector('.summary-total .total-amount').textContent.replace('$', ''))
        };

        const response = await fetch('http://localhost:5001/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (response.ok) {
            showNotification(`Order placed successfully! Order ID: ${result.orderId}`, 'success');
            // Clear cart and close modal
            cart = [];
            updateCart();
            closeCheckoutModal();
        } else {
            throw new Error(result.error || 'Failed to place order');
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Place Order';
    }
}

// Event listeners
function setupEventListeners() {
    // Category navigation
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.category-item.active').classList.remove('active');
            item.classList.add('active');
            currentCategory = item.dataset.category;
            currentPage = 1;
            displayProducts();
        });
    });
    
    // Pagination
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.page === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (btn.dataset.page === 'next') {
                currentPage++;
            }
            displayProducts();
        });
    });
    
    // Cart toggle
    document.querySelector('.cart-link').addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
    });
    
    document.querySelector('.close-cart').addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
    
    // Prescription modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        prescriptionModal.classList.remove('active');
    });
    
    // Filter inputs
    const filterInputs = document.querySelectorAll('.price-inputs input, .checkbox-group input');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            currentPage = 1;
            displayProducts();
        });
    });
    
    // Sort options
    document.getElementById('sort').addEventListener('change', (e) => {
        const sortBy = e.target.value;
        products.sort((a, b) => {
            switch(sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default: // popularity
                    return 0; // In a real app, would sort by popularity metric
            }
        });
        displayProducts();
    });
    
    // Add quick view close on overlay click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeQuickView();
        }
    });
    
    // Add escape key listener for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
            document.querySelector('.cart-sidebar').classList.remove('active');
            document.getElementById('prescription-modal').classList.remove('active');
        }
    });

    // Add checkout button listener
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Initialize the store when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initStore();
    
    // Add loading animation
    productsGrid.classList.add('loading');
    setTimeout(() => {
        productsGrid.classList.remove('loading');
        displayProducts();
    }, 1000);
}); 