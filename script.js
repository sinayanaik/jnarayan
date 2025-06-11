// Update footer year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Profile data object with hardcoded values
const profileData = {
    full_name: "<strong>Dr. Jyotindra Narayan</strong>",
    title: "Assistant Professor",
    current_position: "Department of Mechanical Engineering",
    current_affiliation: "Indian Institute of Technology Patna, Bihar, India",
    profile_image_url: "images/profile.jpeg",
    email: "jnarayan@iitp.ac.in", // Replace with actual email
    cv_url: "#",
    google_scholar_url: "https://scholar.google.com/citations?user=YOUR_ID", // Replace with actual Google Scholar URL
    linkedin_url: "https://www.linkedin.com/in/YOUR_ID", // Replace with actual LinkedIn URL
    bio: `<strong>Dr. Jyotindra Narayan</strong> is an Assistant Professor in the Mechanical Engineering Department at IIT Patna. He completed his Ph.D. in Rehabilitation Robotics from IIT Guwahati and holds an M.E. in CAD/CAM Engineering from Thapar Institute. His research interests include medical and rehabilitation robotics, robust and data-driven control, human–robot interaction, gait analysis, and predictive modeling for neurodegenerative diseases. Before joining IIT Patna in December 2024, he worked as a postdoctoral researcher at Imperial College London and the University of Bayreuth, and also taught briefly at Thapar Institute. At IIT Patna, he teaches courses on system dynamics, control, mechatronics, and applied machine learning.`
};

// Load profile data
function loadProfileData() {
    try {
        // Update profile image
        const profileImage = document.getElementById('profile-image');
        profileImage.src = profileData.profile_image_url;
        profileImage.alt = `${profileData.full_name}'s Profile Photo`;

        // Update text content
        document.getElementById('full-name').innerHTML = profileData.full_name;
        document.getElementById('title').textContent = profileData.title;
        document.getElementById('current-position').textContent = profileData.current_position;
        document.getElementById('current-affiliation').textContent = profileData.current_affiliation;
        document.getElementById('bio').innerHTML = profileData.bio;

        // Update links
        const emailLink = document.getElementById('email-link');
        const cvLink = document.getElementById('cv-link');
        const scholarLink = document.getElementById('scholar-link');
        const linkedinLink = document.getElementById('linkedin-link');

        if (profileData.email) {
            emailLink.href = `mailto:${profileData.email}`;
            emailLink.style.display = 'flex';
        } else {
            emailLink.style.display = 'none';
        }

        if (profileData.cv_url) {
            cvLink.href = profileData.cv_url;
            cvLink.style.display = 'flex';
        } else {
            cvLink.style.display = 'none';
        }

        if (profileData.google_scholar_url) {
            scholarLink.href = profileData.google_scholar_url;
            scholarLink.style.display = 'flex';
        } else {
            scholarLink.style.display = 'none';
        }

        if (profileData.linkedin_url) {
            linkedinLink.href = profileData.linkedin_url;
            linkedinLink.style.display = 'flex';
        } else {
            linkedinLink.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading profile data:', error.message);
    }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadProfileData); 