// Category page functionality
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (!category) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.getElementById('category-title').textContent = category;

    async function fetchCategoryPublications() {
        try {
            if (!window.supabaseClient) {
                throw new Error('Supabase client not initialized');
            }

            const tables = [
                { name: 'journal_articles', title: 'Journal Articles' },
                { name: 'conference_articles', title: 'Conference Articles' },
                { name: 'book_chapters', title: 'Book Chapters' },
                { name: 'patents', title: 'Patents' }
            ];

            const publications = {};
            
            // Fetch from all tables
            const promises = tables.map(table => 
                window.supabaseClient
                    .from(table.name)
                    .select('*')
                    .eq('category', category)
                    .order('year', { ascending: false })
            );

            const results = await Promise.all(promises);

            // Process results
            results.forEach((result, index) => {
                if (result.error) {
                    console.error(`Error fetching ${tables[index].name}:`, result.error);
                    return;
                }
                publications[tables[index].name] = {
                    title: tables[index].title,
                    items: result.data
                };
            });

            return publications;
        } catch (error) {
            console.error('Error fetching category publications:', error);
            return null;
        }
    }

    function renderPublications(publications) {
        const container = document.getElementById('category-publications');
        if (!container) return;

        let html = '';
        
        // Render each publication type
        Object.values(publications).forEach(pubType => {
            if (pubType.items.length > 0) {
                html += `
                    <div class="publication-section">
                        <h3>${pubType.title}</h3>
                        <div class="publication-list">
                `;

                // Group by year
                const byYear = pubType.items.reduce((acc, pub) => {
                    acc[pub.year] = acc[pub.year] || [];
                    acc[pub.year].push(pub);
                    return acc;
                }, {});

                // Render publications by year
                Object.entries(byYear)
                    .sort(([a], [b]) => b - a) // Sort years descending
                    .forEach(([year, items]) => {
                        html += `<div class="publication-year">${year}</div>`;
                        items.forEach(pub => {
                            html += `
                                <div class="publication-item">
                                    <div class="publication-title">${pub.title}</div>
                                    ${pub.url ? `
                                        <div class="publication-links">
                                            <a href="${pub.url}" target="_blank" rel="noopener noreferrer">
                                                <i class="fas fa-external-link-alt"></i> View Publication
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        });
                    });

                html += `
                        </div>
                    </div>
                `;
            }
        });

        container.innerHTML = html || '<p class="no-publications">No publications found in this category.</p>';
    }

    // Initialize category page
    const publications = await fetchCategoryPublications();
    if (publications) {
        renderPublications(publications);
    }
}); 