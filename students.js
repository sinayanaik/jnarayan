// Function to render student items
function displayStudents(students, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Get the category container
    const categoryContainer = container.closest('.student-category');
    
    // If no students or empty array, hide the category
    if (!students || students.length === 0) {
        if (categoryContainer) {
            categoryContainer.style.display = 'none';
        }
        return;
    }

    // Show the category if there are students
    if (categoryContainer) {
        categoryContainer.style.display = 'block';
    }

    const studentsList = students.map(student => {
        return `
            <div class="student-item">
                <span class="bullet">•</span>
                <div class="item-content">
                    <div class="student-header">
                        <span class="student-name">${student.name}</span>
                        <span class="student-year">${student.year}</span>
                    </div>
                    <span class="thesis-title">${student.thesis_title}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = studentsList;
}

// Function to check if a section has any visible categories
function updateSectionVisibility(status) {
    const section = document.querySelector(`.${status.toLowerCase()}-students`);
    if (!section) return;

    // Check if any categories in this section have students
    const hasStudents = ['Doctoral', 'Masters', 'Bachelors'].some(degree => {
        const container = document.getElementById(`${status.toLowerCase()}-${degree.toLowerCase()}-list`);
        return container && container.innerHTML.trim() !== '';
    });

    // Show/hide the entire section based on whether any category has students
    section.style.display = hasStudents ? 'block' : 'none';
}

// Fetch and render students by status and degree
async function fetchStudents(status, degree) {
    const { data, error } = await supabaseClient
        .from('students')
        .select('*')
        .eq('status', status)
        .eq('degree', degree)
        .order('name');
    
    if (error) {
        console.error(`Error fetching ${status} ${degree} students:`, error);
        return;
    }
    
    displayStudents(data, `${status}-${degree.toLowerCase()}-list`);
    updateSectionVisibility(status);
}

// Initialize all student sections
async function initializeStudents() {
    const statuses = ['present', 'past'];
    const degrees = ['Doctoral', 'Masters', 'Bachelors'];
    
    const promises = [];
    statuses.forEach(status => {
        degrees.forEach(degree => {
            promises.push(fetchStudents(status, degree));
        });
    });
    
    await Promise.all(promises);
}

// Load students data when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeStudents); 