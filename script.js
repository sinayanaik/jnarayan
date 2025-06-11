// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('is-active');
        navMenu.classList.toggle('is-active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('is-active');
            navMenu.classList.remove('is-active');
        }
    });

    // Handle navigation item clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close the mobile menu if it's open
            hamburger.classList.remove('is-active');
            navMenu.classList.remove('is-active');

            // Get the target section
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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