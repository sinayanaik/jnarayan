// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const $navbarBurger = document.querySelector('.navbar-burger');
    const $navbarMenu = document.querySelector('.navbar-menu');
    const $navbarItems = document.querySelectorAll('.navbar-item');
    const $header = document.querySelector('.navbar');

    // Navbar functionality
    if ($navbarBurger && $navbarMenu) {
        $navbarBurger.addEventListener('click', () => {
            $navbarBurger.classList.toggle('is-active');
            $navbarMenu.classList.toggle('is-active');
        });
    }

    // Close mobile menu when clicking a link
    if ($navbarItems) {
        $navbarItems.forEach(item => {
            if (!item) return;
            item.addEventListener('click', () => {
                if ($navbarBurger && $navbarMenu) {
                    $navbarBurger.classList.remove('is-active');
                    $navbarMenu.classList.remove('is-active');
                }
            });
        });
    }

    // Handle scroll effects
    if ($header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                $header.classList.add('scrolled');
            } else {
                $header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll handling with error checking
    if ($navbarItems) {
        $navbarItems.forEach(item => {
            if (!item) return;
            
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const navbarHeight = $header ? $header.offsetHeight : 0;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Update footer year
    const footerYear = document.getElementById('current-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});

// Smooth scroll to sections with intersection observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            updateActiveNavItem(id);
        }
    });
}, {
    rootMargin: '-20% 0px -80% 0px'
});

// Observe all sections
document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
});

// Update active navigation item
function updateActiveNavItem(sectionId) {
    if (!sectionId) return;
    
    $navbarItems.forEach(item => {
        if (!item) return;
        
        // Remove active class from all items
        item.classList.remove('is-active');
        
        // Add active class to current section's nav item
        const href = item.getAttribute('href');
        if (href === `#${sectionId}`) {
            item.classList.add('is-active');
        }
    });
}

// Set initial active state based on scroll position
function setInitialActiveState() {
    const scrollPosition = window.scrollY;
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;

    // Find the current section
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 10;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            updateActiveNavItem(section.id);
        }
    });
}

// Initialize
setInitialActiveState();
window.addEventListener('scroll', setInitialActiveState);

// Expose initialization function for other scripts
window.initializeNavigation = function() {
    setInitialActiveState();
}; 