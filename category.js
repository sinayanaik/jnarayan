document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get category from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (!category) {
            console.error('No category specified');
            window.location.href = 'index.html';
            return;
        }

        console.log('Loading category:', category);

        // Set page title
        document.title = `${category} - Publications`;
        document.getElementById('category-title').textContent = category;

        // Function to create publication element
        function createPublicationElement(publication) {
            console.log('Creating element for publication:', publication);
            const div = document.createElement('div');
            div.className = 'publication-item';
            
            const title = publication.url 
                ? `<a href="${publication.url}" target="_blank" rel="noopener noreferrer">${publication.title}</a>`
                : publication.title;

            div.innerHTML = `
                <p class="publication-title">${title}</p>
                <p class="publication-year">${publication.year}</p>
            `;
            return div;
        }

        // Function to fetch and display publications for a specific table
        async function fetchAndDisplayPublications(tableName, containerId) {
            console.log(`Fetching ${tableName} for category:`, category);
            const container = document.getElementById(containerId);
            
            try {
                if (!window.supabaseClient) {
                    throw new Error('Supabase client not initialized');
                }

                const { data, error } = await window.supabaseClient
                    .from(tableName)
                    .select('*')
                    .eq('category', category)
                    .order('year', { ascending: false });

                console.log(`${tableName} data:`, data);
                console.log(`${tableName} error:`, error);

                if (error) throw error;

                if (!data || data.length === 0) {
                    container.innerHTML = '<p class="no-publications">No publications in this category.</p>';
                    return;
                }

                // Clear any existing content
                container.innerHTML = '';
                
                // Add each publication
                data.forEach(publication => {
                    container.appendChild(createPublicationElement(publication));
                });
            } catch (error) {
                console.error(`Error fetching ${tableName}:`, error);
                container.innerHTML = 
                    `<p class="error-message">Error loading publications. Please try again later.</p>`;
            }
        }

        // Fetch publications for all types
        const tables = [
            ['journal_articles', 'journal-articles-container'],
            ['conference_articles', 'conference-articles-container'],
            ['book_chapters', 'book-chapters-container'],
            ['patents', 'patents-container']
        ];

        for (const [table, containerId] of tables) {
            await fetchAndDisplayPublications(table, containerId);
        }

        // Update footer year
        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Failed to initialize:', error);
        document.querySelectorAll('.publication-section div[id]').forEach(container => {
            container.innerHTML = '<p class="error-message">Failed to connect to the database. Please try again later.</p>';
        });
    }
}); 