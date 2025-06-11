// Function to group publications by year
function groupByYear(publications) {
    return publications.reduce((acc, pub) => {
        const year = pub.year;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(pub);
        return acc;
    }, {});
}

// Function to render publications grouped by year
function renderPublicationsByYear(publications, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }

    if (!publications || publications.length === 0) {
        container.innerHTML = '<p class="no-publications">No publications available.</p>';
        return;
    }

    const groupedPubs = groupByYear(publications);
    const years = Object.keys(groupedPubs).sort((a, b) => b - a);
    
    let html = '';
    years.forEach(year => {
        html += `
            <div class="year-section">
                <h5 class="year-heading">${year}</h5>
                <div class="publications-list">
                    ${groupedPubs[year].map(pub => `
                        <div class="publication-item">
                            <span class="bullet">•</span>
                            <span class="pub-title">${pub.title}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fetch and render journal articles
async function fetchJournalArticles() {
    try {
        const { data, error } = await window.supabaseClient
            .from('journal_articles')
            .select('title, year')
            .order('year', { ascending: false });
        
        if (error) throw error;
        renderPublicationsByYear(data, 'journal-articles-list');
    } catch (error) {
        console.error('Error fetching journal articles:', error);
        document.getElementById('journal-articles-list').innerHTML = 
            '<p class="error-message">Error loading journal articles.</p>';
    }
}

// Fetch and render conference articles
async function fetchConferenceArticles() {
    try {
        const { data, error } = await window.supabaseClient
            .from('conference_articles')
            .select('title, year')
            .order('year', { ascending: false });
        
        if (error) throw error;
        renderPublicationsByYear(data, 'conference-articles-list');
    } catch (error) {
        console.error('Error fetching conference articles:', error);
        document.getElementById('conference-articles-list').innerHTML = 
            '<p class="error-message">Error loading conference articles.</p>';
    }
}

// Fetch and render book chapters
async function fetchBookChapters() {
    try {
        const { data, error } = await window.supabaseClient
            .from('book_chapters')
            .select('title, year')
            .order('year', { ascending: false });
        
        if (error) throw error;
        renderPublicationsByYear(data, 'book-chapters-list');
    } catch (error) {
        console.error('Error fetching book chapters:', error);
        document.getElementById('book-chapters-list').innerHTML = 
            '<p class="error-message">Error loading book chapters.</p>';
    }
}

// Fetch and render patents
async function fetchPatents() {
    try {
        const { data, error } = await window.supabaseClient
            .from('patents')
            .select('title, year')
            .order('year', { ascending: false });
        
        if (error) throw error;
        renderPublicationsByYear(data, 'patents-list');
    } catch (error) {
        console.error('Error fetching patents:', error);
        document.getElementById('patents-list').innerHTML = 
            '<p class="error-message">Error loading patents.</p>';
    }
}

// Initialize all publications
async function initializePublications() {
    await Promise.all([
        fetchJournalArticles(),
        fetchConferenceArticles(),
        fetchBookChapters(),
        fetchPatents()
    ]);
}

// Load publications when the DOM is ready
document.addEventListener('DOMContentLoaded', initializePublications); 