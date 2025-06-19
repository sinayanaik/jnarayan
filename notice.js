// Notice functionality
let notices = [];
let autoScrollInterval;
let isScrolling = true;

async function fetchNotices() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('noticeboard')
            .select('title, date')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching notices:', error);
            const container = document.getElementById('notice-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">Error loading notices</p>';
            }
            return;
        }

        if (!data || data.length === 0) {
            const container = document.getElementById('notice-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">No notices available</p>';
            }
            return;
        }

        notices = data;
        renderNotices();
        initializeAutoScroll();
    } catch (error) {
        console.error('Error in fetchNotices:', error);
        const container = document.getElementById('notice-container');
        if (container) {
            container.innerHTML = '<p class="has-text-centered">Error loading notices</p>';
        }
    }
}

function renderNotices() {
    const container = document.getElementById('notice-container');
    if (!container || !notices.length) return;

    // Create the notices list
    const noticesList = notices.map(notice => `
        <div class="notice-item">
            <div class="notice-content">
                <div class="notice-title">${notice.title}</div>
                <div class="notice-date">${new Date(notice.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="notice-scroll">${noticesList}</div>`;
}

function initializeAutoScroll() {
    const container = document.getElementById('notice-container');
    if (!container) return;

    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        
        autoScrollInterval = setInterval(() => {
            if (!isScrolling) return;

            // Increment scroll position
            container.scrollTop += 1;

            // If we've reached the bottom, reset to top
            if (container.scrollTop >= (container.scrollHeight - container.offsetHeight)) {
                container.scrollTop = 0;
                // Small pause before continuing
                isScrolling = false;
                setTimeout(() => {
                    isScrolling = true;
                }, 1000);
            }
        }, 50); // Adjust this value to control scroll speed (lower = faster)
    }

    // Start auto-scrolling
    startAutoScroll();

    // Pause on hover
    container.addEventListener('mouseenter', () => {
        isScrolling = false;
    });

    container.addEventListener('mouseleave', () => {
        isScrolling = true;
    });

    // Handle manual scrolling
    let scrollTimeout;
    container.addEventListener('scroll', () => {
        const wasScrolling = isScrolling;
        isScrolling = false;
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            if (wasScrolling) {
                isScrolling = true;
            }
        }, 1000);
    });
}

// Initialize notices when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Supabase is initialized
    setTimeout(() => {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            const container = document.getElementById('notice-container');
            if (container) {
                container.innerHTML = '<p class="has-text-centered">Error: Database connection not available</p>';
            }
            return;
        }
        
        fetchNotices();
    }, 100);
}); 