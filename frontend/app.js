// app.js
document.addEventListener('DOMContentLoaded', function() {
    // Fetch user information
    fetch('/api/user')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // If not logged in, redirect to login page (except if already on login/signup)
                const currentPath = window.location.pathname;
                if (currentPath !== '/login.html' && currentPath !== '/signup.html') {
                    window.location.href = '/login.html';
                }
                throw new Error('Not logged in');
            }
        })
        .then(data => {
            // Display username if element exists
            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.textContent = data.username;
            }
            
            // Load job listings if on index, employer, or other jobs page
            if (window.location.pathname === '/index.html' || 
                window.location.pathname === '/employer.html' ||
                window.location.pathname === '/other jobs.html') {
                loadJobs(data.role);
            }
            
            // Load applications if on applied page
            if (window.location.pathname === '/applied.html') {
                loadApplications();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Load jobs
function loadJobs(userRole) {
    const mainContent = document.querySelector('main');
    let jobsContainer;
    
    // Check if jobs container already exists, if not create it
    if (document.getElementById('jobsContainer')) {
        jobsContainer = document.getElementById('jobsContainer');
    } else {
        jobsContainer = document.createElement('div');
        jobsContainer.id = 'jobsContainer';
        jobsContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4';
        mainContent.appendChild(jobsContainer);
    }
    
    fetch('/api/jobs')
        .then(response => response.json())
        .then(jobs => {
            jobsContainer.innerHTML = ''; // Clear existing jobs
            
            if (jobs.length === 0) {
                jobsContainer.innerHTML = '<p class="col-span-full text-gray-500">No jobs found.</p>';
                return;
            }
            
            jobs.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'bg-white p-4 rounded-lg shadow border border-gray-200';
                
                let applyButton = '';
                if (userRole === 'jobseeker') {
                    applyButton = `<button onclick="applyForJob(${job.id})" class="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Apply</button>`;
                }
                
                jobCard.innerHTML = `
                    <h2 class="text-xl font-bold">${job.title}</h2>
                    <p class="text-gray-600">${job.location}</p>
                    <div class="mt-2 flex flex-wrap gap-1">
                        ${job.tech_stack ? job.tech_stack.split(',').map(tech => 
                            `<span class="bg-gray-100 text-xs px-2 py-1 rounded">${tech.trim()}</span>`
                        ).join('') : ''}
                    </div>
                    <div class="mt-3 text-sm">
                        <p><span class="font-medium">Package:</span> ₹${job.package} LPA</p>
                        <p><span class="font-medium">Experience:</span> ${job.experience || 'Not specified'}</p>
                        <p><span class="font-medium">Job Type:</span> ${job.job_type}</p>
                        <p><span class="font-medium">Openings:</span> ${job.openings}</p>
                    </div>
                    ${applyButton}
                `;
                
                jobsContainer.appendChild(jobCard);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            jobsContainer.innerHTML = '<p class="col-span-full text-red-500">Failed to load jobs.</p>';
        });
}

// Apply for job
function applyForJob(jobId) {
    fetch('/api/apply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Application submitted successfully!');
        } else {
            alert('Failed to apply: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting your application.');
    });
}

// Load user applications
function loadApplications() {
    const mainContent = document.querySelector('main');
    let applicationsContainer;
    
    // Check if container already exists, if not create it
    if (document.getElementById('applicationsContainer')) {
        applicationsContainer = document.getElementById('applicationsContainer');
    } else {
        applicationsContainer = document.createElement('div');
        applicationsContainer.id = 'applicationsContainer';
        applicationsContainer.className = 'grid grid-cols-1 gap-4 mt-4';
        mainContent.appendChild(applicationsContainer);
    }
    
    fetch('/api/applications')
        .then(response => response.json())
        .then(applications => {
            applicationsContainer.innerHTML = ''; // Clear existing applications
            
            if (applications.length === 0) {
                applicationsContainer.innerHTML = '<p class="text-gray-500">You haven\'t applied to any jobs yet.</p>';
                return;
            }
            
            applications.forEach(app => {
                const appCard = document.createElement('div');
                appCard.className = 'bg-white p-4 rounded-lg shadow border border-gray-200';
                
                let statusBadge = '';
                if (app.status === 'pending') {
                    statusBadge = '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>';
                } else if (app.status === 'accepted') {
                    statusBadge = '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Accepted</span>';
                } else if (app.status === 'rejected') {
                    statusBadge = '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Rejected</span>';
                }
                
                appCard.innerHTML = `
                    <div class="flex justify-between items-start">
                        <h2 class="text-xl font-bold">${app.title}</h2>
                        ${statusBadge}
                    </div>
                    <p class="text-gray-600">${app.location}</p>
                    <div class="mt-2 flex flex-wrap gap-1">
                        ${app.tech_stack ? app.tech_stack.split(',').map(tech => 
                            `<span class="bg-gray-100 text-xs px-2 py-1 rounded">${tech.trim()}</span>`
                        ).join('') : ''}
                    </div>
                    <div class="mt-3 text-sm">
                        <p><span class="font-medium">Package:</span> ₹${app.package} LPA</p>
                        <p><span class="font-medium">Applied on:</span> ${new Date(app.applied_at).toLocaleDateString()}</p>
                    </div>
                `;
                
                applicationsContainer.appendChild(appCard);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            applicationsContainer.innerHTML = '<p class="text-red-500">Failed to load applications.</p>';
        });
}