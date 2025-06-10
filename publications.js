// Initialize Supabase client
const supabaseClient = supabase.createClient(
    'https://ktiiyeuvsvbqnrhqbwmr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aWl5ZXV2c3ZicW5yaHFid21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjI1OTIsImV4cCI6MjA2NTEzODU5Mn0.yPZY4oo70R4UXl4grSLyLRfNLJzFg1EYMeoKjpZy6tA'
);

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
    const groupedPubs = groupByYear(publications);
    
    // Sort years in descending order
    const years = Object.keys(groupedPubs).sort((a, b) => b - a);
    
    let html = '';
    years.forEach(year => {
        html += `
            <div class="year-section">
                <h4 class="year-heading">${year}</h4>
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
    const { data, error } = await supabaseClient
        .from('journal_articles')
        .select('title, year')
        .order('year', { ascending: false });
    
    if (error) {
        console.error('Error fetching journal articles:', error);
        return;
    }
    
    renderPublicationsByYear(data, 'journal-articles-list');
}

// Fetch and render conference articles
async function fetchConferenceArticles() {
    const { data, error } = await supabaseClient
        .from('conference_articles')
        .select('title, year')
        .order('year', { ascending: false });
    
    if (error) {
        console.error('Error fetching conference articles:', error);
        return;
    }
    
    renderPublicationsByYear(data, 'conference-articles-list');
}

// Fetch and render book chapters
async function fetchBookChapters() {
    const { data, error } = await supabaseClient
        .from('book_chapters')
        .select('title, year')
        .order('year', { ascending: false });
    
    if (error) {
        console.error('Error fetching book chapters:', error);
        return;
    }
    
    renderPublicationsByYear(data, 'book-chapters-list');
}

// Fetch and render patents
async function fetchPatents() {
    const { data, error } = await supabaseClient
        .from('patents')
        .select('title, year')
        .order('year', { ascending: false });
    
    if (error) {
        console.error('Error fetching patents:', error);
        return;
    }
    
    renderPublicationsByYear(data, 'patents-list');
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