// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Navigation Links & Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-in-up');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Stop observing once revealed
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Activate hero animations immediately
    setTimeout(() => {
        document.querySelectorAll('#hero .fade-in-up').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    // 4. Pricing Tabs Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 5. Dynamic Opening Hours Indicator
    function updateOpeningHours() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        
        // Highlight today in the list
        const daysList = document.querySelectorAll('#hours-list li');
        daysList.forEach(li => {
            if (parseInt(li.getAttribute('data-day')) === dayOfWeek) {
                li.classList.add('today');
                li.innerHTML += ' <span class="gold-text"><i class="fas fa-arrow-left"></i> Today</span>';
            }
        });

        // Determine if currently open
        const statusIndicator = document.getElementById('status-indicator');
        let isOpen = false;
        
        // Convert current time to minutes for easier comparison
        const timeInMinutes = currentHour * 60 + currentMinute;
        
        if (dayOfWeek >= 1 && dayOfWeek <= 6) {
            // Mon-Sat: 10:00 AM (600) to 9:00 PM (1260)
            if (timeInMinutes >= 600 && timeInMinutes < 1260) {
                isOpen = true;
            }
        } else if (dayOfWeek === 0) {
            // Sunday: 10:30 AM (630) to 9:30 PM (1290)
            if (timeInMinutes >= 630 && timeInMinutes < 1290) {
                isOpen = true;
            }
        }

        if (isOpen) {
            statusIndicator.innerHTML = '<i class="fas fa-door-open"></i> We are currently open';
            statusIndicator.className = 'status-indicator status-open';
        } else {
            statusIndicator.innerHTML = '<i class="fas fa-door-closed"></i> We are currently closed';
            statusIndicator.className = 'status-indicator status-closed';
        }
    }
    
    updateOpeningHours();

    // 6. Testimonials Carousel seamless duplication for infinite scroll
    const track = document.getElementById('reviews-track');
    if (track) {
        // Clone the review cards and append them to create a seamless loop
        const cards = track.querySelectorAll('.review-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
    }

    // 7. Hero Particle Animation (Canvas)
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        // Resize canvas
        canvas.width = window.innerWidth;
        canvas.height = document.getElementById('hero').offsetHeight;
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = document.getElementById('hero').offsetHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                // Gold particle colors
                const colors = ['rgba(201, 168, 76, 0.6)', 'rgba(232, 201, 122, 0.4)', 'rgba(245, 237, 214, 0.2)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            // Create particles based on screen width (less on mobile)
            const numberOfParticles = window.innerWidth < 768 ? 50 : 150;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});

// Lightbox Global Functions
function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const imgSrc = element.querySelector('img').src;
    
    lightbox.style.display = 'block';
    lightboxImg.src = imgSrc;
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    
    // Restore background scrolling
    document.body.style.overflow = 'auto';
}

// Close lightbox on clicking outside the image
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target !== document.getElementById('lightbox-img')) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape" && document.getElementById('lightbox').style.display === 'block') {
        closeLightbox();
    }
});
