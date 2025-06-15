// Function to fetch collaborators
async function fetchCollaborators() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await window.supabaseClient
            .from('collaborators')
            .select('*')
            .order('affiliation', { ascending: true });

        if (error) {
            console.error('Error fetching collaborators:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        return [];
    }
}

// Function to group collaborators by affiliation
function groupCollaboratorsByAffiliation(collaborators) {
    if (!collaborators || !Array.isArray(collaborators)) {
        return {};
    }

    return collaborators.reduce((acc, collaborator) => {
        if (!collaborator || !collaborator.affiliation) return acc;

        const key = `${collaborator.affiliation}|${collaborator.country || 'Unknown'}`;
        
        if (!acc[key]) {
            acc[key] = {
                affiliation: collaborator.affiliation,
                country: collaborator.country || 'Unknown',
                members: []
            };
        }
        acc[key].members.push(collaborator);
        return acc;
    }, {});
}

// Function to render collaborators
function renderCollaborators(collaborators) {
    const container = document.getElementById('collaborators-content');
    if (!container) {
        console.error('Collaborators container not found');
        return;
    }

    if (!collaborators || !Array.isArray(collaborators) || collaborators.length === 0) {
        container.innerHTML = `
            <div class="notification is-info is-light">
                <p class="has-text-centered">No collaborators available at the moment.</p>
            </div>
        `;
        return;
    }

    try {
        const groupedCollaborators = groupCollaboratorsByAffiliation(collaborators);
        
        const html = Object.values(groupedCollaborators).map(group => `
            <div class="institution-group">
                <h4 class="institution-name">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fas fa-university"></i>
                        </span>
                        <span>${group.affiliation}</span>
                    </span>
                    <span class="country">
                        <span class="icon">
                            <i class="fas fa-globe"></i>
                        </span>
                        <span>${group.country}</span>
                    </span>
                </h4>
                <div class="collaborators-grid">
                    ${group.members.map(member => `
                        <div class="collaborator-card">
                            <div class="collaborator-info">
                                ${member.url ? 
                                    `<a href="${member.url}" class="collaborator-name" target="_blank" rel="noopener noreferrer">` :
                                    `<span class="collaborator-name">`}
                                    <span class="icon">
                                        <i class="fas fa-user-circle"></i>
                                    </span>
                                    <span>${member.name}</span>
                                ${member.url ? `</a>` : `</span>`}
                                <div class="department-name">
                                    <span class="icon">
                                        <i class="fas fa-building"></i>
                                    </span>
                                    <span>${member.department || 'Department not specified'}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    } catch (error) {
        console.error('Error rendering collaborators:', error);
        container.innerHTML = `
            <div class="notification is-danger is-light">
                <p class="has-text-centered">An error occurred while displaying collaborators. Please try again later.</p>
            </div>
        `;
    }
}

// Initialize collaborators when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('collaborators')
            .select('*')
            .order('name');

        if (error) {
            throw error;
        }

        renderCollaborators(data);
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        const container = document.getElementById('collaborators-content');
        if (container) {
            container.innerHTML = `
                <div class="notification is-danger is-light">
                    <p class="has-text-centered">Error loading collaborators. Please try again later.</p>
                </div>
            `;
        }
    }
}); 