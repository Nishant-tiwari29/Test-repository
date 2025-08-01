// Navigation functionality
const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Handle scroll events
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Add fade-in class to elements
document.querySelectorAll('.agent-card, .tech-column, .team-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Handle fade-in animations
const fadeInElements = document.querySelectorAll('.agent-card, .tech-column, .team-card');
fadeInElements.forEach((element, index) => {
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, index * 100);
});

// CV Upload and Processing
const cvUploadArea = document.querySelector('.cv-upload-area');
const fileInput = document.querySelector('.file-input');
const cvList = document.querySelector('.cv-list');
const sortSelect = document.querySelector('.sort-select');
const experienceFilter = document.querySelector('#experience');
const skillsFilter = document.querySelector('#skills');
const locationFilter = document.querySelector('#location');

// Drag and drop functionality
cvUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    cvUploadArea.classList.add('dragover');
});

cvUploadArea.addEventListener('dragleave', () => {
    cvUploadArea.classList.remove('dragover');
});

cvUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    cvUploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

cvUploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Handle uploaded files
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type === 'application/pdf' || 
            file.type === 'application/msword' || 
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            processCV(file);
        } else {
            alert('Please upload only PDF or Word documents');
        }
    });
}

// Process CV file
function processCV(file) {
    // Simulate CV processing
    const reader = new FileReader();
    reader.onload = (e) => {
        // In a real application, this would be where you'd send the file to your backend
        // for processing and analysis
        setTimeout(() => {
            addCVToList({
                name: file.name,
                experience: '5 years',
                skills: 'JavaScript, React, Node.js',
                location: 'New York',
                matchScore: Math.floor(Math.random() * 100)
            });
        }, 1000);
    };
    reader.readAsDataURL(file);
}

// Add CV to the list
function addCVToList(cv) {
    const cvItem = document.createElement('div');
    cvItem.className = 'cv-item';
    cvItem.innerHTML = `
        <div class="cv-info">
            <h4>${cv.name}</h4>
            <p>Experience: ${cv.experience} | Skills: ${cv.skills} | Location: ${cv.location}</p>
            <p>Match Score: ${cv.matchScore}%</p>
        </div>
        <div class="cv-actions">
            <button class="view-btn" onclick="viewCV('${cv.name}')">View</button>
            <button class="select-btn" onclick="selectCV('${cv.name}')">Select</button>
        </div>
    `;
    cvList.appendChild(cvItem);
}

// View CV
function viewCV(filename) {
    // In a real application, this would open the CV in a viewer
    alert(`Viewing ${filename}`);
}

// Select CV
function selectCV(filename) {
    // In a real application, this would mark the CV as selected
    const candidate = {
        name: filename.split('.')[0], // Remove file extension
        email: 'candidate@example.com', // This would come from the CV data
        matchScore: parseInt(document.querySelector(`.cv-item:has(h4:contains('${filename}')) .cv-info p:last-child`).textContent)
    };

    // Add to recipients
    addRecipient(candidate);

    // Automatically send interview invitation if match score is high
    if (candidate.matchScore >= 80) {
        sendAutomaticEmail(candidate, 'interview');
    } else if (candidate.matchScore >= 60) {
        sendAutomaticEmail(candidate, 'rejection');
    }
}

// Function to send automatic emails
function sendAutomaticEmail(candidate, type) {
    const template = emailTemplates[type];
    const subject = template.subject.replace('[Position]', 'Software Engineer');
    const body = template.body
        .replace('[Candidate Name]', candidate.name)
        .replace('[Position]', 'Software Engineer')
        .replace('[Company Name]', 'Your Company')
        .replace('[Date]', new Date().toLocaleDateString())
        .replace('[Time]', '10:00 AM')
        .replace('[Location/Platform]', 'Zoom Meeting')
        .replace('[Your Name]', 'HR Manager');

    // Create status item
    const statusItem = document.createElement('div');
    statusItem.className = 'status-item pending';
    statusItem.innerHTML = `
        <i class="fas fa-clock"></i>
        <div>
            <div>${candidate.name}</div>
            <div>Preparing automatic ${type} email...</div>
        </div>
    `;
    emailStatusList.appendChild(statusItem);

    // Simulate email sending with a delay
    setTimeout(() => {
        statusItem.className = 'status-item success';
        statusItem.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <div>${candidate.name}</div>
                <div>${type === 'interview' ? 'Interview invitation sent' : 'Application status sent'}</div>
            </div>
        `;

        // Log the email details (in a real application, this would be sent to your backend)
        console.log('Automatic email sent:', {
            to: candidate.email,
            subject: subject,
            body: body,
            type: type,
            matchScore: candidate.matchScore
        });
    }, 1500);
}

// Filter and sort CVs
function filterAndSortCVs() {
    const experience = experienceFilter.value;
    const skills = skillsFilter.value.toLowerCase();
    const location = locationFilter.value.toLowerCase();
    const sortBy = sortSelect.value;

    const cvItems = Array.from(cvList.children);
    
    // Filter
    cvItems.forEach(item => {
        const cvInfo = item.querySelector('.cv-info');
        const cvExperience = cvInfo.querySelector('p').textContent;
        const cvSkills = cvInfo.querySelector('p').textContent;
        const cvLocation = cvInfo.querySelector('p').textContent;
        
        const matchesExperience = !experience || cvExperience.includes(experience);
        const matchesSkills = !skills || cvSkills.toLowerCase().includes(skills);
        const matchesLocation = !location || cvLocation.toLowerCase().includes(location);

        item.style.display = matchesExperience && matchesSkills && matchesLocation ? 'flex' : 'none';

        // If CV is visible and has high match score, automatically select it
        if (matchesExperience && matchesSkills && matchesLocation) {
            const matchScore = parseInt(cvInfo.querySelector('p:last-child').textContent);
            if (matchScore >= 80) {
                const filename = cvInfo.querySelector('h4').textContent;
                if (!recipientsList.querySelector(`[data-candidate="${filename}"]`)) {
                    selectCV(filename);
                }
            }
        }
    });

    // Sort
    const sortedItems = cvItems.sort((a, b) => {
        const scoreA = parseInt(a.querySelector('.cv-info p:last-child').textContent);
        const scoreB = parseInt(b.querySelector('.cv-info p:last-child').textContent);
        
        if (sortBy === 'relevance') {
            return scoreB - scoreA;
        } else if (sortBy === 'experience') {
            const expA = a.querySelector('.cv-info p').textContent;
            const expB = b.querySelector('.cv-info p').textContent;
            return expB.localeCompare(expA);
        } else {
            return 0;
        }
    });

    // Reorder in DOM
    sortedItems.forEach(item => cvList.appendChild(item));
}

// Add a function to check for high-scoring CVs periodically
function checkForHighScoringCVs() {
    const cvItems = document.querySelectorAll('.cv-item');
    cvItems.forEach(item => {
        const matchScore = parseInt(item.querySelector('.cv-info p:last-child').textContent);
        const filename = item.querySelector('h4').textContent;
        
        if (matchScore >= 80 && !recipientsList.querySelector(`[data-candidate="${filename}"]`)) {
            selectCV(filename);
        }
    });
}

// Run the check every 30 seconds
setInterval(checkForHighScoringCVs, 30000);

// Add event listeners for filters and sorting
experienceFilter.addEventListener('change', filterAndSortCVs);
skillsFilter.addEventListener('input', filterAndSortCVs);
locationFilter.addEventListener('input', filterAndSortCVs);
sortSelect.addEventListener('change', filterAndSortCVs);

// Email Communication
const emailTemplate = document.getElementById('emailTemplate');
const emailSubject = document.getElementById('emailSubject');
const emailBody = document.getElementById('emailBody');
const emailSchedule = document.getElementById('emailSchedule');
const recipientsList = document.getElementById('recipientsList');
const emailStatusList = document.getElementById('emailStatusList');

// Email templates
const emailTemplates = {
    interview: {
        subject: 'Interview Invitation - [Position]',
        body: `Dear [Candidate Name],

Thank you for your interest in the [Position] role at [Company Name]. We were impressed with your application and would like to invite you for an interview.

Interview Details:
Date: [Date]
Time: [Time]
Location: [Location/Platform]

Please confirm your availability by responding to this email.

Best regards,
[Your Name]
[Company Name]`
    },
    rejection: {
        subject: 'Application Status - [Position]',
        body: `Dear [Candidate Name],

Thank you for your interest in the [Position] role at [Company Name]. We appreciate the time you took to apply and share your experience with us.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We wish you success in your job search and hope you'll consider applying for future opportunities with us.

Best regards,
[Your Name]
[Company Name]`
    },
    offer: {
        subject: 'Job Offer - [Position]',
        body: `Dear [Candidate Name],

We are pleased to offer you the position of [Position] at [Company Name]. We were impressed with your qualifications and believe you would be a valuable addition to our team.

Offer Details:
Position: [Position]
Start Date: [Date]
Salary: [Amount]
Benefits: [Benefits]

Please review the attached offer letter and respond by [Date].

We look forward to welcoming you to the team!

Best regards,
[Your Name]
[Company Name]`
    }
};

// Template selection
emailTemplate.addEventListener('change', () => {
    const template = emailTemplates[emailTemplate.value];
    emailSubject.value = template.subject;
    emailBody.value = template.body;
});

// Add selected candidate to recipients
function addRecipient(candidate) {
    const recipientTag = document.createElement('div');
    recipientTag.className = 'recipient-tag';
    recipientTag.innerHTML = `
        ${candidate.name}
        <button onclick="removeRecipient(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    recipientsList.appendChild(recipientTag);
}

// Remove recipient
function removeRecipient(button) {
    button.parentElement.remove();
}

// Preview email
function previewEmail() {
    const previewWindow = window.open('', 'Email Preview', 'width=600,height=800');
    previewWindow.document.write(`
        <html>
            <head>
                <title>Email Preview</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .preview-header { margin-bottom: 20px; }
                    .preview-subject { font-size: 18px; font-weight: bold; }
                    .preview-body { white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <div class="preview-subject">${emailSubject.value}</div>
                    <div>To: ${Array.from(recipientsList.children).map(tag => tag.textContent.trim()).join(', ')}</div>
                </div>
                <div class="preview-body">${emailBody.value}</div>
            </body>
        </html>
    `);
}

// Send emails
function sendEmails() {
    const recipients = Array.from(recipientsList.children);
    if (recipients.length === 0) {
        alert('Please add at least one recipient');
        return;
    }

    const scheduleTime = emailSchedule.value;
    const now = new Date();
    const scheduledDate = scheduleTime ? new Date(scheduleTime) : now;

    // Add status for each recipient
    recipients.forEach(recipient => {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item pending';
        statusItem.innerHTML = `
            <i class="fas fa-clock"></i>
            <div>
                <div>${recipient.textContent.trim()}</div>
                <div>${scheduleTime ? 'Scheduled' : 'Sending...'}</div>
            </div>
        `;
        emailStatusList.appendChild(statusItem);

        // Simulate email sending
        setTimeout(() => {
            statusItem.className = 'status-item success';
            statusItem.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <div>
                    <div>${recipient.textContent.trim()}</div>
                    <div>Sent successfully</div>
                </div>
            `;
        }, Math.random() * 2000 + 1000);
    });

    // Clear form after sending
    if (!scheduleTime) {
        emailSubject.value = '';
        emailBody.value = '';
        recipientsList.innerHTML = '';
    }
} 