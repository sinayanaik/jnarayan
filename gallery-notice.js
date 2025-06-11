// Fetch and render gallery images
async function fetchGalleryImages() {
    try {
        const client = window.supabaseClient;
        if (!client) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await client
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const galleryContainer = document.getElementById('gallery-container');
        if (!galleryContainer) {
            console.error('Gallery container not found');
            return;
        }

        galleryContainer.innerHTML = '';
        
        if (!data || data.length === 0) {
            galleryContainer.innerHTML = '<div class="no-content">No gallery images available.</div>';
            return;
        }
        
        data.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            
            const img = document.createElement('img');
            img.src = item.image_url;
            img.alt = item.caption || 'Gallery Image';
            img.loading = 'lazy';
            
            if (item.caption) {
                const caption = document.createElement('div');
                caption.className = 'gallery-caption';
                caption.textContent = item.caption;
                slide.appendChild(caption);
            }
            
            slide.appendChild(img);
            galleryContainer.appendChild(slide);
        });

        if (galleryContainer.children.length > 0) {
            initializeGalleryScroll();
        }
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        const container = document.getElementById('gallery-container');
        if (container) {
            container.innerHTML = '<div class="error-message">Error loading gallery images.</div>';
        }
    }
}

// Initialize automatic gallery scroll
function initializeGalleryScroll() {
    const gallery = document.getElementById('gallery-container');
    if (!gallery || gallery.children.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 1;
    let animationFrameId = null;
    
    function autoScroll() {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= gallery.scrollWidth - gallery.clientWidth) {
            scrollPosition = 0;
        }
        gallery.scrollLeft = scrollPosition;
        animationFrameId = requestAnimationFrame(autoScroll);
    }
    
    // Start scrolling
    autoScroll();

    // Pause scrolling when hovering
    gallery.addEventListener('mouseenter', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    });

    // Resume scrolling when mouse leaves
    gallery.addEventListener('mouseleave', () => {
        if (!animationFrameId) {
            autoScroll();
        }
    });
}

// Fetch and render noticeboard items
async function fetchNoticeboardItems() {
    try {
        const client = window.supabaseClient;
        if (!client) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await client
            .from('noticeboard')
            .select('*')
            .order('date', { ascending: false })
            .limit(5);
        
        if (error) throw error;
        
        const noticeContainer = document.getElementById('notice-container');
        if (!noticeContainer) {
            console.error('Notice container not found');
            return;
        }

        noticeContainer.innerHTML = '';
        
        if (!data || data.length === 0) {
            noticeContainer.innerHTML = '<div class="no-content">No notices available.</div>';
            return;
        }
        
        data.forEach(item => {
            const notice = document.createElement('div');
            notice.className = 'notice-item';
            
            const title = document.createElement('div');
            title.className = 'notice-title';
            title.textContent = item.title;
            
            const date = document.createElement('div');
            date.className = 'notice-date';
            date.textContent = new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            notice.appendChild(title);
            notice.appendChild(date);
            noticeContainer.appendChild(notice);
        });

        if (noticeContainer.children.length > 0) {
            initializeNoticeScroll();
        }
    } catch (error) {
        console.error('Error fetching noticeboard items:', error);
        const container = document.getElementById('notice-container');
        if (container) {
            container.innerHTML = '<div class="error-message">Error loading notices.</div>';
        }
    }
}

// Initialize automatic notice scroll
function initializeNoticeScroll() {
    const notices = document.querySelectorAll('.notice-item');
    if (!notices || notices.length === 0) return;

    let currentIndex = 0;
    let intervalId = null;
    
    function showNextNotice() {
        notices.forEach(notice => {
            notice.classList.remove('active');
            notice.style.transform = 'translateY(20px)';
            notice.style.opacity = '0';
        });
        
        notices[currentIndex].classList.add('active');
        notices[currentIndex].style.transform = 'translateY(0)';
        notices[currentIndex].style.opacity = '1';
        
        currentIndex = (currentIndex + 1) % notices.length;
    }
    
    // Show first notice immediately
    showNextNotice();
    
    // Start the interval
    intervalId = setInterval(showNextNotice, 3000);

    // Pause animation when hovering
    const container = document.getElementById('notice-container');
    if (container) {
        container.addEventListener('mouseenter', () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        });

        container.addEventListener('mouseleave', () => {
            if (!intervalId) {
                showNextNotice();
                intervalId = setInterval(showNextNotice, 3000);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure Supabase is initialized
    if (!window.supabaseClient && window.initSupabase) {
        window.supabaseClient = window.initSupabase();
    }

    // Initialize sections
    fetchGalleryImages();
    fetchNoticeboardItems();
}); 