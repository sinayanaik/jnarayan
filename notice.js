// Notice board functionality
let scrollInterval;
let notices = [];
let scrollPosition = 0;
const SCROLL_SPEED = 0.6; // pixels per frame (reduced speed)
const PAUSE_DURATION = 2000; // 2 seconds pause for each notice
let isPaused = false;
let lastPauseTime = 0;
let isResetting = false;

async function fetchNotices() {
    const { data, error } = await supabaseClient
        .from('noticeboard')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching notices:', error);
        return;
    }

    notices = data;
    renderNotices();
    initializeScroll();
}

function renderNotices() {
    const container = document.getElementById('notice-container');
    
    if (!notices || notices.length === 0) {
        container.innerHTML = '<p class="has-text-centered">No notices available</p>';
        return;
    }

    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'notice-scroll';

    const html = notices.map(notice => `
        <div class="notice-item">
            <span class="notice-bullet">•</span>
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

    scrollDiv.innerHTML = html;
    container.innerHTML = '';
    container.appendChild(scrollDiv);
}

function initializeScroll() {
    const container = document.getElementById('notice-container');
    const scrollContent = container.querySelector('.notice-scroll');
    
    if (!scrollContent) return;

    function shouldPauseAtNotice() {
        const noticeHeight = container.querySelector('.notice-item')?.offsetHeight || 0;
        if (!noticeHeight) return false;

        const currentNoticeIndex = Math.floor(scrollPosition / noticeHeight);
        const exactPosition = scrollPosition % noticeHeight;
        
        // Check if we're at the start position of a notice
        return exactPosition < 1;
    }

    function smoothReset() {
        isResetting = true;
        const startPosition = scrollPosition;
        const startTime = Date.now();
        const duration = 1000; // 1 second for reset animation

        function animate() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth transition
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            scrollPosition = startPosition * (1 - easeProgress);
            scrollContent.style.transform = `translateY(-${scrollPosition}px)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isResetting = false;
                scrollPosition = 0;
                scrollContent.style.transform = 'translateY(0)';
                isPaused = false;
                lastPauseTime = 0;
                scrollInterval = requestAnimationFrame(scroll);
            }
        }

        animate();
    }

    function scroll() {
        if (isResetting) {
            scrollInterval = requestAnimationFrame(scroll);
            return;
        }

        const currentTime = Date.now();
        
        // Check if we should start/continue a pause
        if (shouldPauseAtNotice()) {
            if (!isPaused) {
                isPaused = true;
                lastPauseTime = currentTime;
            } else if (currentTime - lastPauseTime < PAUSE_DURATION) {
                scrollInterval = requestAnimationFrame(scroll);
                return;
            } else {
                isPaused = false;
            }
        }

        scrollPosition += SCROLL_SPEED;
        const maxScroll = scrollContent.clientHeight - container.clientHeight;

        // When reaching the end, smoothly reset to top
        if (scrollPosition >= maxScroll) {
            smoothReset();
            return;
        }

        scrollContent.style.transform = `translateY(-${scrollPosition}px)`;
        scrollInterval = requestAnimationFrame(scroll);
    }

    // Reset scroll position immediately
    function resetScroll() {
        if (!isResetting) {
            smoothReset();
        }
    }

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'notice-reset-button';
    resetButton.innerHTML = '↑ Back to Top';
    resetButton.onclick = resetScroll;
    container.parentElement.appendChild(resetButton);

    // Start scrolling
    scrollInterval = requestAnimationFrame(scroll);

    // Pause on hover or scroll
    container.addEventListener('mouseenter', () => {
        if (!isResetting) {
            cancelAnimationFrame(scrollInterval);
        }
    });

    container.addEventListener('mouseleave', () => {
        if (!isResetting) {
            scrollInterval = requestAnimationFrame(scroll);
        }
    });

    // Manual scroll handling
    container.addEventListener('scroll', () => {
        if (!isResetting) {
            cancelAnimationFrame(scrollInterval);
            scrollPosition = container.scrollTop;
        }
    });

    // Resume scrolling after manual scroll stops
    let scrollTimeout;
    container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (!container.matches(':hover') && !isResetting) {
                scrollInterval = requestAnimationFrame(scroll);
            }
        }, 1000);
    });

    // Handle window visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden || isResetting) {
            cancelAnimationFrame(scrollInterval);
        } else if (!container.matches(':hover')) {
            scrollInterval = requestAnimationFrame(scroll);
        }
    });
}

// Initialize notice board when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchNotices();
}); 