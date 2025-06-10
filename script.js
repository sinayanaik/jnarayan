// Initialize Supabase client
const supabaseUrl = 'https://vcxwzwfpxflxgcpjmpfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHd6d2ZweGZseGdjcGptcGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5NzM4NzgsImV4cCI6MjAyNTU0OTg3OH0.N0BKAK1FQjkWHK4_L9SLXLGAYmvvEMQAPQhYThVxvxE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Update footer year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Fetch and display profile data
async function loadProfileData() {
    try {
        const { data, error } = await supabase
            .from('profile')
            .select('*')
            .single();

        if (error) throw error;

        if (data) {
            // Update profile image
            const profileImage = document.getElementById('profile-image');
            profileImage.src = data.profile_image_url || 'https://via.placeholder.com/300x400';
            profileImage.alt = `${data.full_name}'s Profile Photo`;

            // Update text content
            document.getElementById('full-name').textContent = data.full_name;
            document.getElementById('title').textContent = data.title;
            document.getElementById('current-position').textContent = data.current_position;
            document.getElementById('current-affiliation').textContent = data.current_affiliation;
            document.getElementById('bio').textContent = data.bio;

            // Update navigation brand
            document.getElementById('nav-name').textContent = data.full_name;

            // Update links
            const emailLink = document.getElementById('email-link');
            const cvLink = document.getElementById('cv-link');
            const scholarLink = document.getElementById('scholar-link');
            const linkedinLink = document.getElementById('linkedin-link');

            if (data.email) {
                emailLink.href = `mailto:${data.email}`;
                emailLink.style.display = 'flex';
            } else {
                emailLink.style.display = 'none';
            }

            if (data.cv_url) {
                cvLink.href = data.cv_url;
                cvLink.style.display = 'flex';
            } else {
                cvLink.style.display = 'none';
            }

            if (data.google_scholar_url) {
                scholarLink.href = data.google_scholar_url;
                scholarLink.style.display = 'flex';
            } else {
                scholarLink.style.display = 'none';
            }

            if (data.linkedin_url) {
                linkedinLink.href = data.linkedin_url;
                linkedinLink.style.display = 'flex';
            } else {
                linkedinLink.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error loading profile data:', error.message);
    }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadProfileData); 