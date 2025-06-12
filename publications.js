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
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('journal_articles')
            .select('*')
            .order('year', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching journal articles:', error);
        return [];
    }
}

// Fetch and render conference articles
async function fetchConferenceArticles() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('conference_articles')
            .select('*')
            .order('year', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching conference articles:', error);
        return [];
    }
}

// Fetch and render book chapters
async function fetchBookChapters() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('book_chapters')
            .select('*')
            .order('year', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching book chapters:', error);
        return [];
    }
}

// Fetch and render patents
async function fetchPatents() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('patents')
            .select('*')
            .order('year', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching patents:', error);
        return [];
    }
}

function renderPublicationList(publications, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }

    if (!publications || publications.length === 0) {
        container.innerHTML = '<p class="no-items">No publications available.</p>';
        return;
    }

    // Group publications by year
    const groupedByYear = publications.reduce((acc, pub) => {
        const year = pub.year || 'Unknown Year';
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(pub);
        return acc;
    }, {});

    // Sort years in descending order
    const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

    const html = sortedYears.map(year => {
        const yearPublications = groupedByYear[year].map(pub => `
            <li class="publication-item">
                <div class="publication-title">${pub.title}</div>
                ${pub.authors ? `<div class="publication-authors">${pub.authors}</div>` : ''}
                ${pub.venue ? `<div class="publication-venue">${pub.venue}</div>` : ''}
                ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" class="publication-doi">DOI: ${pub.doi}</a>` : ''}
            </li>
        `).join('');

        return `
            <div class="publication-year">
                <h4>${year}</h4>
                <ul class="publication-list">
                    ${yearPublications}
                </ul>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function renderPublications(journalArticles, conferenceArticles, bookChapters, patents) {
    renderPublicationList(journalArticles, 'journal-articles-list');
    renderPublicationList(conferenceArticles, 'conference-articles-list');
    renderPublicationList(bookChapters, 'book-chapters-list');
    renderPublicationList(patents, 'patents-list');
}

// Initialize publications when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Supabase is initialized
    setTimeout(async () => {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            ['journal-articles-list', 'conference-articles-list', 'book-chapters-list', 'patents-list'].forEach(id => {
                const container = document.getElementById(id);
                if (container) {
                    container.innerHTML = '<p class="error-message">Error: Database connection not available</p>';
                }
            });
            return;
        }
        
        try {
            const [journalArticles, conferenceArticles, bookChapters, patents] = await Promise.all([
        fetchJournalArticles(),
        fetchConferenceArticles(),
        fetchBookChapters(),
        fetchPatents()
    ]);

            // Render the publications
            renderPublications(journalArticles, conferenceArticles, bookChapters, patents);
        } catch (error) {
            console.error('Error initializing publications:', error);
            ['journal-articles-list', 'conference-articles-list', 'book-chapters-list', 'patents-list'].forEach(id => {
                const container = document.getElementById(id);
                if (container) {
                    container.innerHTML = '<p class="error-message">Error loading publications</p>';
                }
            });
        }
    }, 100);
}); 