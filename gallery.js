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

        // Create indicators container
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';
        
        // Create indicators
        galleryData.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `carousel-indicator${index === 0 ? ' active' : ''}`;
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        // Create slides
        galleryData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'carousel-image-container';
            
            // Add image
            imageContainer.innerHTML = `<img src="${item.image_url}" alt="Gallery image ${index + 1}" class="carousel-image">`;
            
            // Clone and append indicators to each image container
            const slideIndicators = indicatorsContainer.cloneNode(true);
            slideIndicators.querySelectorAll('.carousel-indicator').forEach((indicator, i) => {
                indicator.addEventListener('click', () => goToSlide(i));
            });
            imageContainer.appendChild(slideIndicators);
            
            // Add caption
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            caption.textContent = item.caption || '';
            
            slide.appendChild(imageContainer);
            slide.appendChild(caption);
            container.appendChild(slide);
        });

        // Set up navigation
        const prevButton = document.querySelector('.carousel-nav.prev');
        const nextButton = document.querySelector('.carousel-nav.next');

        let currentSlide = 0;
        const totalSlides = galleryData.length;

        function updateSlidePosition() {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            // Update indicators for all slides
            document.querySelectorAll('.carousel-slide').forEach((slide) => {
                slide.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentSlide);
                });
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlidePosition();
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

        // Optional: Auto-advance slides
        let autoAdvance = setInterval(nextSlide, 5000);

        // Pause auto-advance on hover
        container.parentElement.addEventListener('mouseenter', () => clearInterval(autoAdvance));
        container.parentElement.addEventListener('mouseleave', () => {
            clearInterval(autoAdvance);
            autoAdvance = setInterval(nextSlide, 5000);
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