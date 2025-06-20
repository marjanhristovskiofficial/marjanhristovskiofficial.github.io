let cartItems = [];

let pageItem = {
    id: "1",
    name: "Marjan Signature T-Shirt",
    price: 44.99,
    size: "s",
    color: "green",
    quantity: 1,
    image: `assets/imgs/t-shirt-green.jpg`
};

let images = {
    green: 'assets/imgs/t-shirt-green.jpg',
    black: 'assets/imgs/t-shirt-black.jpg',
    gray: 'assets/imgs/t-shirt-gray.jpg',
};

let colorOrder = ['green', 'black', 'gray'];
let currentColorIndex = 0;

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}
function refreshItem(){
    let quantityInput = document.getElementById('quantity');
    let quantity = quantityInput.value;
    let selectedSizeInput = document.querySelector('input[name="size"]:checked');
    let selectedSize = selectedSizeInput.value;
    let selectedColorInput = document.querySelector('input[name="color"]:checked');
    let selectedColor = selectedColorInput.value;

    pageItem.quantity = parseInt(quantity, 10);
    pageItem.size = selectedSize;
    pageItem.color = selectedColor;
    pageItem.image = images[selectedColor];
    
    // Ensure currentColorIndex is in sync
    currentColorIndex = colorOrder.indexOf(selectedColor);
}
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cartItems = JSON.parse(savedCart);
            updateCartCount();
        } catch (e) {
            // console.error('Error parsing cart data:', e);
            cartItems = []; // Reset to empty if parsing fails
        }
    } else {
        cartItems = []; // Initialize empty if no saved cart
    }
}
function addToCart(item) {
    const existingItemIndex = cartItems.findIndex(cartItem => 
        cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
    );
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += item.quantity || 1;
    } else {
        cartItems.push({
            ...item,
            quantity: item.quantity || 1
        });
    }
    saveCart();
    loadCartFromStorage();
}
function updateCartCount() {
    const savedCart = localStorage.getItem('cart');
    let totalCount = 0;
    if (savedCart) {
        try {
            const cart = JSON.parse(savedCart);
            totalCount = cart.reduce((sum, item) => {
                return sum + parseInt(item.quantity || 0, 10);
            }, 0);
        } catch (e) {
            console.error('Error parsing cart data:', e);
        }
    }
    document.querySelectorAll('.cart-count').forEach(span => {
        span.textContent = totalCount;
    });
}

const addToCartButton = document.querySelector('.add-to-cart-button');
if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
        refreshItem();
        addToCart(pageItem);
        const productId = pageItem.id;
        const productName = pageItem.name;
        const productPrice = parseFloat(pageItem.price);
        const quantity = parseInt(pageItem.quantity, 10);
        if (quantity > 0) {
            const message = `Added ${quantity} x "${productName}" to cart!`;
            alertUserMessage(message);
            updateCartCount();
            console.log("Cart content (simulated):", { productId, productName, productPrice, quantity });
        } else {
            alertUserMessage("Please enter a quantity greater than 0.");
        }
    });
}

function updateProductImage() {
    const selectedColorInput = document.querySelector('input[name="color"]:checked');
    const selectedColor = selectedColorInput.value;
    const productImage = document.getElementById('product-image');
    if (productImage && images[selectedColor]) {
        productImage.src = images[selectedColor];
    }
    // Update current color index
    currentColorIndex = colorOrder.indexOf(selectedColor);
}

function updateColorSelection(color) {
    const colorInput = document.querySelector(`input[name="color"][value="${color}"]`);
    if (colorInput) {
        colorInput.checked = true;
        updateProductImage();
    }
}

function navigateToNextImage() {
    currentColorIndex = (currentColorIndex + 1) % colorOrder.length;
    const nextColor = colorOrder[currentColorIndex];
    updateColorSelection(nextColor);
}

function navigateToPrevImage() {
    currentColorIndex = (currentColorIndex - 1 + colorOrder.length) % colorOrder.length;
    const prevColor = colorOrder[currentColorIndex];
    updateColorSelection(prevColor);
}

// Add event listeners for color changes
document.querySelectorAll('input[name="color"]').forEach(colorInput => {
    colorInput.addEventListener('change', updateProductImage);
});

// Add event listeners for arrow navigation
document.getElementById('next-image').addEventListener('click', navigateToNextImage);
document.getElementById('prev-image').addEventListener('click', navigateToPrevImage);

// Initialize the current color index based on the default selected color
document.addEventListener('DOMContentLoaded', function() {
    const selectedColorInput = document.querySelector('input[name="color"]:checked');
    if (selectedColorInput) {
        currentColorIndex = colorOrder.indexOf(selectedColorInput.value);
    }
});

document.querySelectorAll('input[name="color"]').forEach(colorInput => {
    colorInput.addEventListener('change', updateProductImage);
});

loadCartFromStorage();




// ANIMATIONS BELOW -- 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            // Get the fixed header height
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            
            // Calculate the target position, accounting for the fixed header
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // For Bootstrap navbar, collapse the menu after clicking a link
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarToggler && navbarCollapse.classList.contains('show')) {
                // Manually trigger Bootstrap's collapse behavior
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        }
    });
});



window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        const scrolled = window.pageYOffset;
        const opacity = Math.min(scrolled / 100, 1);
        header.style.background = `rgba(0, 0, 0, ${0.9 + opacity * 0.1})`;
    }
});
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const pieces = document.querySelectorAll('.chess-piece');
    pieces.forEach((piece, index) => {
        const speed = 0.05 + (index * 0.02); // Reduced speed for subtlety
        piece.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`; // Reduced rotation speed
    });
});
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-10px) scale(1)';
    });
});
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const suffix = counter.textContent.includes('+') ? '+' : '';
            counter.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 20);
    });
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}
// const newsletterForm = document.querySelector('.newsletter-form');
// if (newsletterForm) {
//     newsletterForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const email = newsletterForm.querySelector('input').value;
//         // In a real application, you would send this email to a server
//         console.log(`Thanks for subscribing with ${email}!`);
//         // Use a custom modal or message box instead of alert()
//         alertUserMessage(`Thanks for subscribing with ${email}! You'll hear from me soon.`);
//         newsletterForm.reset();
//     });
// }
function alertUserMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    `;
    msgDiv.textContent = message;
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.style.opacity = '1', 10);
    setTimeout(() => {
        msgDiv.style.opacity = '0';
        msgDiv.addEventListener('transitionend', () => msgDiv.remove());
    }, 3000);
}
