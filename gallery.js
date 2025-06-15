// Gallery functionality
document.addEventListener('DOMContentLoaded', async function() {
    async function fetchGalleryItems() {
        try {
            if (!window.supabaseClient) {
                throw new Error('Supabase client not initialized');
            }

            const { data, error } = await window.supabaseClient
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching gallery items:', error);
                const container = document.getElementById('gallery-container');
                if (container) {
                    container.innerHTML = '<p class="has-text-centered">Error loading gallery images</p>';
                }
                return null;
            }

            if (!data || data.length === 0) {
                const container = document.getElementById('gallery-container');
                if (container) {
                    container.innerHTML = '<p class="has-text-centered">No images available</p>';
                }
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error in fetchGalleryItems:', error);
            const container = document.getElementById('gallery-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">Error loading gallery images</p>';
            }
            return null;
        }
    }

    function initGallery(galleryData) {
        const container = document.getElementById('gallery-container');
        if (!container || !galleryData) return;

        // Clear existing content
        container.innerHTML = '';

        // Create slides
        galleryData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide${index === 0 ? ' active' : ''}`;
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'carousel-image-container';
            
            // Create and setup image
            const img = document.createElement('img');
            img.className = 'carousel-image';
            img.src = item.image_url;
            img.alt = `Gallery image ${index + 1}`;
            
            // Add loading state
            img.style.opacity = '0';
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            // Add caption
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            caption.textContent = item.caption || '';
            
            // Append elements
            imageContainer.appendChild(img);
            slide.appendChild(imageContainer);
            slide.appendChild(caption);
            container.appendChild(slide);
        });

        // Set up navigation
        const prevButton = document.querySelector('.carousel-nav.prev');
        const nextButton = document.querySelector('.carousel-nav.next');

        let currentSlide = 0;
        const totalSlides = galleryData.length;
        const slides = container.querySelectorAll('.carousel-slide');

        function updateSlidePosition() {
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.classList.add('active');
                    slide.style.transform = 'translateX(0)';
                } else {
                    slide.classList.remove('active');
                    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlidePosition();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlidePosition();
        }

        // Event listeners
        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);

        // Optional: Auto-advance slides (changed from 5000ms to 3000ms)
        let autoAdvance = setInterval(nextSlide, 3000);

        // Pause auto-advance on hover
        container.parentElement.addEventListener('mouseenter', () => clearInterval(autoAdvance));
        container.parentElement.addEventListener('mouseleave', () => {
            clearInterval(autoAdvance);
            autoAdvance = setInterval(nextSlide, 3000);
        });

        // Initial position
        updateSlidePosition();
    }

    // Initialize gallery with data from Supabase
    const galleryData = await fetchGalleryItems();
    if (galleryData) {
        initGallery(galleryData);
    }
}); 