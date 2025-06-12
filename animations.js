document.addEventListener('DOMContentLoaded', () => {
    // Handle image loading animations
    document.querySelectorAll('.carousel-image').forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });

    // Intersection Observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Add section-container class to all major sections
    document.querySelectorAll('.profile-container, .gallery-section, .noticeboard-section, .research-areas, .education-section, .experience-section, .teaching-section, .students-section, .publications-section, .talks-section, .awards-section').forEach(section => {
        section.classList.add('section-container');
    });
}); 