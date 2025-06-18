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

    // Smooth scroll to sections with intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveNavItem(id, $navbarItems);
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
    function updateActiveNavItem(sectionId, navItems) {
        if (!sectionId || !navItems) return;
        
        navItems.forEach(item => {
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
        const navbarHeight = $header?.offsetHeight || 0;

        // Find the current section
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 10;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                updateActiveNavItem(section.id, $navbarItems);
            }
        });
    }

    // Initialize
    setInitialActiveState();
    window.addEventListener('scroll', setInitialActiveState);

    // Mouse move effect for research category cards
    const cards = document.querySelectorAll('.category-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
});

// Expose initialization function for other scripts
window.initializeNavigation = function() {
    setInitialActiveState();
};

// Function to format date
function formatDate(dateStr) {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
}

// Function to create experience item HTML
function createExperienceItem(experience) {
    return `
        <div class="experience-item">
            <h4>${experience.title}</h4>
            <p class="institution">${experience.institution}</p>
            <p class="duration">${formatDate(experience.start_date)} - ${formatDate(experience.end_date)}</p>
            ${experience.description ? `<p class="description">${experience.description}</p>` : ''}
        </div>
    `;
}

// Function to fetch and display experiences
async function loadExperiences() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data: experiences, error } = await window.supabaseClient
            .from('experiences')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;

        // Group experiences by type
        const groupedExperiences = experiences.reduce((acc, exp) => {
            if (!acc[exp.type]) {
                acc[exp.type] = [];
            }
            acc[exp.type].push(exp);
            return acc;
        }, {});

        // Render professional experience
        const professionalContainer = document.getElementById('professional-experience');
        if (professionalContainer && groupedExperiences.professional) {
            professionalContainer.innerHTML = `
                <h4>Professional Experience</h4>
                <div class="experience-items">
                    ${groupedExperiences.professional.map(exp => createExperienceItem(exp)).join('')}
                </div>
            `;
        }

        // Render administrative experience
        const adminContainer = document.getElementById('administrative-experience');
        if (adminContainer && groupedExperiences.administrative) {
            adminContainer.innerHTML = `
                <h4>Administrative Experience</h4>
                <div class="experience-items">
                    ${groupedExperiences.administrative.map(exp => createExperienceItem(exp)).join('')}
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading experiences:', error);
        const container = document.querySelector('.experience-grid');
        if (container) {
            container.innerHTML = `
                <div class="notification is-danger is-light">
                    <p class="has-text-centered">Error loading experiences. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Initialize experiences when DOM is loaded
document.addEventListener('DOMContentLoaded', loadExperiences); 