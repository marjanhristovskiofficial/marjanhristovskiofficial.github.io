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

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background opacity on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrolled = window.pageYOffset;
    const opacity = Math.min(scrolled / 100, 1);
    header.style.background = `rgba(0, 0, 0, ${0.9 + opacity * 0.1})`;
});

// Parallax effect for floating chess pieces
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const pieces = document.querySelectorAll('.chess-piece');
    pieces.forEach((piece, index) => {
        const speed = 0.5 + (index * 0.1);
        piece.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-10px) scale(1)';
    });
});

// Animated counter for stats
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

// Trigger counter animation when stats section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}


updateCartCount();
