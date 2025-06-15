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

// Function to get unique categories from publications
async function fetchCategories() {
    try {
        const tables = ['journal_articles', 'conference_articles', 'book_chapters', 'patents'];
        const categorySets = await Promise.all(tables.map(async table => {
            const { data, error } = await window.supabaseClient
                .from(table)
                .select('category')
                .not('category', 'is', null);
            
            if (error) throw error;
            return new Set(data.map(item => item.category));
        }));

        // Combine all unique categories
        const allCategories = new Set();
        categorySets.forEach(set => set.forEach(category => allCategories.add(category)));
        return Array.from(allCategories).sort();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Function to render categories in research areas
function renderCategories(categories) {
    const container = document.getElementById('research-categories');
    if (!container) {
        console.error('Research categories container not found');
        return;
    }

    const categoryItems = categories.map(category => `
        <a href="category.html?category=${encodeURIComponent(category)}" 
           class="category-item">
            ${category}
        </a>
    `).join('');

    container.innerHTML = categoryItems;
}

// Function to create publication element
function createPublicationElement(publication) {
    const div = document.createElement('div');
    div.className = 'publication-item';
    
    const title = publication.url 
        ? `<a href="${publication.url}" target="_blank" rel="noopener noreferrer">${publication.title}</a>`
        : publication.title;

    div.innerHTML = `
        <span class="bullet">•</span>
        <span class="pub-title">${title}</span>
    `;
    return div;
}

// Function to render publications by year
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
                    ${groupedPubs[year].map(pub => {
                        const title = pub.url 
                            ? `<a href="${pub.url}" target="_blank" rel="noopener noreferrer" class="pub-title">${pub.title}</a>`
                            : `<span class="pub-title">${pub.title}</span>`;

                        return `
                        <div class="publication-item">
                            <span class="bullet">•</span>
                                ${title}
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fetch publications from a specific table
async function fetchPublications(tableName) {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from(tableName)
            .select('*')
            .order('year', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return [];
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch and render categories in research areas
        const categories = await fetchCategories();
        renderCategories(categories);

        // Fetch all publication types
        const [journalArticles, conferenceArticles, bookChapters, patents] = await Promise.all([
            fetchPublications('journal_articles'),
            fetchPublications('conference_articles'),
            fetchPublications('book_chapters'),
            fetchPublications('patents')
        ]);

        // Render each publication section
        renderPublicationsByYear(journalArticles, 'journal-articles-list');
        renderPublicationsByYear(conferenceArticles, 'conference-articles-list');
        renderPublicationsByYear(bookChapters, 'book-chapters-list');
        renderPublicationsByYear(patents, 'patents-list');
    } catch (error) {
        console.error('Error initializing:', error);
            ['journal-articles-list', 'conference-articles-list', 'book-chapters-list', 'patents-list'].forEach(id => {
                const container = document.getElementById(id);
                if (container) {
                container.innerHTML = '<p class="error-message">Error loading publications. Please try again later.</p>';
                }
            });
        }
}); 