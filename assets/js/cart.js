let cartItems = [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount()
}
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cartItems = JSON.parse(savedCart);
            updateCartCount();
        } catch (e) {
            console.error('Error parsing cart data:', e);
            cartItems = [];
        }
    } else {
        cartItems = [];
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
    loadCart();
}
function removeFromCart(itemId, size, color) {
    cartItems = cartItems.filter(item =>
        !(item.id === itemId && item.size === size && item.color === color)
    );
    saveCart();
    loadCart();
}
function updateQuantity(itemId, size, color, newQuantity) {
    const itemIndex = cartItems.findIndex(item =>
        item.id === itemId && item.size === size && item.color === color
    );

    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            removeFromCart(itemId, size, color);
        } else {
            cartItems[itemIndex].quantity = newQuantity;
            saveCart();
            loadCart();
        }
    }
}
function clearCart() {
    cartItems = [];
    saveCart();
    loadCart();
}
function loadCart() {
    loadCartFromStorage();

    const cartContainer = document.getElementById('cart-container');
    const emptyCart = document.getElementById('empty-cart');
    const orderActions = document.getElementById('order-actions');


    if (cartItems.length === 0 && cartContainer && emptyCart && orderActions) {
        emptyCart.style.display = 'block';
        orderActions.style.display = 'none';
        cartContainer.innerHTML = emptyCart.outerHTML;
    }

    if(emptyCart && orderActions){
        orderActions.style.display = 'block';
        emptyCart.style.display = 'none';
    }

    let cartHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-info">Size: ${item.size} | Color: ${item.color || 'N/A'} | Quantity: ${item.quantity}</div>
                    <div class="item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="item-actions">
                    <button onclick="updateQuantity('${item.id}', '${item.size}', '${item.color || ''}', ${item.quantity - 1})" class="qty-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', '${item.size}', '${item.color || ''}', ${item.quantity + 1})" class="qty-btn">+</button>
                    <button onclick="removeFromCart('${item.id}', '${item.size}', '${item.color || ''}')" class="remove-btn">Remove</button>
                </div>
                <div class="item-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    cartHTML += `
        <div class="cart-summary">
            <div class="total-price">Total: $${total.toFixed(2)}</div>
            <button onclick="clearCart()" class="clear-cart-btn">Clear Cart</button>
        </div>
    `;

    cartContainer.innerHTML = cartHTML;
    updateCartCount();
    updateHiddenOrderText();
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


function updateHiddenOrderText() {
    const hiddenOrderText = document.getElementById('hidden-order-text');
    if (!hiddenOrderText) return;

    let orderText = '🛒 NEW ORDER:\n\n';

    cartItems.forEach(item => {
        orderText += `• ${item.quantity}x ${item.name}\n`;
        orderText += `  Size: ${item.size}\n`;
        orderText += `  Color: ${item.color || 'N/A'}\n`;
        orderText += `  Price: $${item.price.toFixed(2)} each\n`;
        orderText += `  Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderText += `💰 TOTAL: $${total.toFixed(2)}\n\n`;
    orderText += '📦 Payment: Cash on delivery\n';
    orderText += '📍 Please confirm delivery address\n\n';
    orderText += 'Thank you for your order! 🙏';

    hiddenOrderText.textContent = orderText;
}

function copyOrderText() {
    const hiddenOrderText = document.getElementById('hidden-order-text');
    if (!hiddenOrderText) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hiddenOrderText.textContent).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyText();
        });
    } else {
        fallbackCopyText();
    }
}

function fallbackCopyText() {
    const hiddenOrderText = document.getElementById('hidden-order-text');
    if (!hiddenOrderText) return;

    const textArea = document.createElement('textarea');
    textArea.value = hiddenOrderText.textContent;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Unable to copy text. Please manually copy your order details.');
    }

    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const copySuccess = document.getElementById('copy-success');
    if (!copySuccess) return;

    copySuccess.classList.add('show');
    setTimeout(() => {
        copySuccess.classList.remove('show');
    }, 2000);
}

function takeScreenshot() {
    alert('📸 To take a screenshot:\n\n' +
        '• On Windows: Press Windows + Shift + S\n' +
        '• On Mac: Press Cmd + Shift + 4\n' +
        '• On mobile: Use your device\'s screenshot function\n\n' +
        'Then send the screenshot to our Instagram @marjanhristovski or email order@marjanhristovski.com');
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});
