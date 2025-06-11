// Notice functionality
let notices = [];

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
    if (!container) {
        console.error('Notice container not found');
        return;
    }

    // Create the scrolling content
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

    // Create a wrapper for the scrolling animation
    container.innerHTML = `
        <div class="scroll-wrapper">
            <div class="scroll-content">
                ${noticesList}
            </div>
            <div class="scroll-content" aria-hidden="true">
                ${noticesList}
            </div>
        </div>
    `;

    // Add necessary styles for the scrolling animation
    const style = document.createElement('style');
    style.textContent = `
        #notice-container {
            height: 100%;
            overflow: hidden;
        }
        
        .scroll-wrapper {
            position: relative;
            height: 100%;
            overflow: hidden;
        }
        
        .scroll-content {
            animation: scroll 15s linear infinite;
            padding: 0.5rem;
        }
        
        .scroll-wrapper:hover .scroll-content {
            animation-play-state: paused;
        }
        
        @keyframes scroll {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(-50%);
            }
        }
        
        .notice-item {
            padding: 10px 15px;
            border-left: 4px solid #3273dc;
            margin: 8px 0;
            background: white;
            transition: background-color 0.3s ease;
        }
        
        .notice-item:hover {
            background: #f5f5f5;
        }
        
        .notice-title {
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .notice-date {
            font-size: 0.9em;
            color: #666;
        }
    `;
    document.head.appendChild(style);
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