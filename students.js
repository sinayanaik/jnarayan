// Function to fetch students
async function fetchStudents() {
    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('students')
            .select('*')
            .order('year', { ascending: false })
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

// Function to group students by degree and status
function groupStudents(students) {
    const groups = {
        present: {
            Doctoral: [],
            Masters: [],
            Bachelors: []
        },
        past: {
            Doctoral: [],
            Masters: [],
            Bachelors: []
        }
    };

    students.forEach(student => {
        groups[student.status][student.degree].push(student);
    });

    return groups;
}

// Function to render students
function renderStudents(students) {
    const container = document.getElementById('students-list');
    if (!container) {
        console.error('Students container not found');
        return;
    }

    if (!students || students.length === 0) {
        container.innerHTML = '<p class="no-students">No students available.</p>';
        return;
    }

    const groupedStudents = groupStudents(students);
    let html = '';

    // Render present students first
    if (Object.values(groupedStudents.present).some(arr => arr.length > 0)) {
        html += '<div class="status-group present-students">';
        html += '<h4 class="status-title">Present Students</h4>';
        html += renderStudentsByDegree(groupedStudents.present);
        html += '</div>';
    }

    // Render past students
    if (Object.values(groupedStudents.past).some(arr => arr.length > 0)) {
        html += '<div class="status-group past-students">';
        html += '<h4 class="status-title">Past Students</h4>';
        html += renderStudentsByDegree(groupedStudents.past);
        html += '</div>';
    }

    container.innerHTML = html;
}

// Helper function to render students by degree
function renderStudentsByDegree(degreeGroups) {
    let html = '';
    const degrees = ['Doctoral', 'Masters', 'Bachelors'];

    degrees.forEach(degree => {
        if (degreeGroups[degree].length > 0) {
            html += `
                <div class="degree-group">
                    <h5 class="degree-title">
                        <i class="fas fa-graduation-cap"></i>
                        ${degree} Students
                    </h5>
                    <div class="students-grid">
                        ${degreeGroups[degree].map(student => `
                            <div class="student-card">
                                <div class="student-info">
                                    ${student.url ? 
                                        `<a href="${student.url}" class="student-name" target="_blank" rel="noopener noreferrer">
                                            <i class="fas fa-user-graduate"></i>
                                            ${student.name}
                                        </a>` :
                                        `<div class="student-name">
                                            <i class="fas fa-user-graduate"></i>
                                            ${student.name}
                                        </div>`
                                    }
                                    ${student.year ? 
                                        `<div class="student-year">
                                            <i class="fas fa-calendar"></i>
                                            ${student.year}
                                        </div>` : ''
                                    }
                                    ${student.thesis_title ? 
                                        `<div class="thesis-title">
                                            <i class="fas fa-book"></i>
                                            ${student.thesis_title}
                                        </div>` : ''
                                    }
                                    ${student.joint_supervisor ? 
                                        `<div class="joint-supervisor">
                                            <i class="fas fa-chalkboard-teacher"></i>
                                            Joint Supervisor: ${student.joint_supervisor}
                                        </div>` : ''
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }
    });

    return html;
}

// Initialize students when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const students = await fetchStudents();
        renderStudents(students);
    } catch (error) {
        console.error('Error initializing students:', error);
        const container = document.getElementById('students-list');
        if (container) {
            container.innerHTML = '<p class="error-message">Error loading students. Please try again later.</p>';
        }
    }
}); 