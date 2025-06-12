// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    // Close menu when clicking outside
    function closeMenu(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    // Close menu when clicking nav items
    function closeMenuOnClick() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    document.addEventListener('click', closeMenu);
    navItems.forEach(item => item.addEventListener('click', closeMenuOnClick));

    // Prevent body scroll when menu is open
    function toggleBodyScroll() {
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleBodyScroll);
    navItems.forEach(item => item.addEventListener('click', () => {
        document.body.style.overflow = '';
    }));

    // Add active state to nav items based on scroll position
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px', // Adjust these values to change when sections become active
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nav items
                navItems.forEach(item => item.classList.remove('active'));
                
                // Add active class to corresponding nav item
                const targetId = entry.target.id;
                const correspondingNavItem = document.querySelector(`.nav-item[href="#${targetId}"]`);
                if (correspondingNavItem) {
                    correspondingNavItem.classList.add('active');
                }
            }
        });
    };

    // Create and start the intersection observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    document.querySelectorAll('section, div[id]').forEach(section => {
        observer.observe(section);
    });
});

// Update footer year
document.getElementById('current-year').textContent = new Date().getFullYear(); 