let webinars = [
    { id: 1, title: "Introduction to Machine Learning", description: "Learn the fundamentals of machine learning and its applications", speaker: "Dr. Sarah Johnson", speakerBio: "AI researcher with 10+ years experience", date: "2025-11-15", time: "14:00", duration: 120, category: "Technology", status: "upcoming", registeredUsers: 45, materials: [] },
    { id: 2, title: "Web Development Best Practices", description: "Master modern web development techniques and frameworks", speaker: "Prof. John Smith", speakerBio: "Full-stack developer and educator", date: "2025-11-20", time: "10:00", duration: 90, category: "Web Development", status: "upcoming", registeredUsers: 32, materials: [] },
    { id: 3, title: "Data Science Fundamentals", description: "Explore data analysis, visualization, and interpretation", speaker: "Dr. Emily Chen", speakerBio: "Data scientist with Fortune 500 experience", date: "2025-11-10", time: "16:00", duration: 100, category: "Data Science", status: "upcoming", registeredUsers: 58, materials: [] },
    { id: 4, title: "Cybersecurity Essentials", description: "Understand security threats and defensive strategies", speaker: "Mr. Alex Rodriguez", speakerBio: "Cybersecurity expert and certified trainer", date: "2025-11-25", time: "15:00", duration: 110, category: "Security", status: "upcoming", registeredUsers: 27, materials: [] },
    { id: 5, title: "Cloud Computing Basics", description: "Introduction to AWS, Azure, and Google Cloud platforms", speaker: "Ms. Lisa Wang", speakerBio: "Cloud architect and DevOps specialist", date: "2025-11-12", time: "11:00", duration: 95, category: "Cloud", status: "upcoming", registeredUsers: 41, materials: [] }
];

const adminAccounts = { "123": "123", "admin": "password" };
const userAccounts = { "2400080163": "123", "user1": "password" };
let userRegistrations = [];
let currentWebinarId = null, currentUser = null, pageHistory = [];

function showPage(pageId) {
    document.querySelectorAll('.main-content').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (!pageHistory.length || pageHistory[pageHistory.length - 1] !== pageId) {
        pageHistory.push(pageId);
    }
}

function showAdminLogin() { showPage('adminLoginPage'); }
function showUserLogin() { showPage('userLoginPage'); }
function backToRoleSelection() { showPage('roleSelectionPage'); }

function showAdminDashboard() {
    showPage('adminDashboard');
    document.getElementById('userInfoDisplay').textContent = `👨‍💼 Admin: ${currentUser.id}`;
    document.getElementById('navButtons').style.display = 'flex';
    updateAdminDashboard();
}

function showUserDashboard() {
    showPage('userDashboard');
    document.getElementById('userInfoDisplay').textContent = `👤 User ID: ${currentUser.id}`;
    document.getElementById('navButtons').style.display = 'flex';
    displayUserWebinars();
}

function logout() {
    document.getElementById('adminDashboard').classList.remove('active');
    document.getElementById('userDashboard').classList.remove('active');
    document.getElementById('roleSelectionPage').classList.add('active');
    document.getElementById('userInfoDisplay').textContent = '';
    document.getElementById('navButtons').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
    document.getElementById('userLoginForm').reset();
    currentUser = null;
    userRegistrations = [];
    pageHistory = [];
}

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        let prev = pageHistory[pageHistory.length - 1];
        showPage(prev);
    }
}

function adminLogin(event) {
    event.preventDefault();
    const adminId = document.getElementById('adminId').value;
    const adminPassword = document.getElementById('adminPassword').value;
    if (adminAccounts[adminId] && adminAccounts[adminId] === adminPassword) {
        currentUser = { type: 'admin', id: adminId };
        showAdminDashboard();
    } else alert('❌ Invalid Admin ID or Password');
}

function userLogin(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const userPassword = document.getElementById('userPassword').value;
    if (userAccounts[userId] && userAccounts[userId] === userPassword) {
        currentUser = { type: 'user', id: userId };
        showUserDashboard();
    } else alert('❌ Invalid User ID or Password');
}

function updateAdminDashboard() {
    document.getElementById('totalWebinars').textContent = webinars.length;
    document.getElementById('totalRegistrations').textContent = webinars.reduce((sum, w) => sum + w.registeredUsers, 0);
    document.getElementById('upcomingCount').textContent = webinars.filter(w => w.status === "upcoming").length;
    displayAdminWebinars();
}

function addWebinar(event) {
    event.preventDefault();
    const newWebinar = {
        id: Math.max(...webinars.map(w => w.id), 0) + 1,
        title: document.getElementById('webinarTitle').value,
        description: document.getElementById('webinarDesc').value,
        speaker: document.getElementById('speakerName').value,
        speakerBio: document.getElementById('speakerBio').value,
        date: document.getElementById('webinarDate').value,
        time: document.getElementById('webinarTime').value,
        duration: parseInt(document.getElementById('webinarDuration').value),
        category: document.getElementById('webinarCategory').value,
        status: 'upcoming',
        registeredUsers: 0,
        materials: []
    };
    webinars.push(newWebinar);
    document.getElementById('webinarForm').reset();
    updateAdminDashboard();
    alert('✅ Webinar created successfully!');
}

function displayAdminWebinars() {
    const c = document.getElementById('adminWebinarsList');
    if (webinars.length === 0) {
        c.innerHTML = '<div class="empty-message"><p>No webinars created yet</p></div>';
        return;
    }
    c.innerHTML = webinars.map(w => `
        <div class="webinar-card">
            <div class="webinar-header"><h3>${w.title}</h3>
                <span class="webinar-category">${w.category}</span></div>
            <div class="webinar-body">
                <p>${w.description}</p>
                <div class="webinar-meta">
                    <div><strong>Speaker:</strong> ${w.speaker}</div>
                    <div><strong>Date:</strong> ${w.date} at ${w.time}</div>
                    <div><strong>Duration:</strong> ${w.duration} min</div>
                    <div><strong>Registrations:</strong> ${w.registeredUsers}</div>
                    <div><strong>Status:</strong> ${w.status}</div>
                </div>
            </div>
            <div class="webinar-footer">
                <button class="btn btn-primary btn-small" onclick="editWebinar(${w.id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteWebinar(${w.id})">Delete</button>
                <button class="btn btn-secondary btn-small" onclick="viewDetails(${w.id})">Details</button>
            </div>
        </div>`
    ).join('');
}

function displayUserWebinars() {
    filterWebinars();
    displayUserRegistrations();
}

function filterWebinars() {
    const s = document.getElementById('searchInput').value.toLowerCase();
    const cat = document.getElementById('categoryFilter').value;
    const filtered = webinars.filter(w =>
        (w.title.toLowerCase().includes(s) || w.description.toLowerCase().includes(s)) &&
        (cat === '' || w.category === cat)
    );
    const c = document.getElementById('userWebinarsList');
    if (filtered.length === 0) {
        c.innerHTML = '<div class="empty-message"><p>No webinars found</p></div>';
        return;
    }
    c.innerHTML = filtered.map(w => `
        <div class="webinar-card">
            <div class="webinar-header"><h3>${w.title}</h3>
                <span class="webinar-category">${w.category}</span></div>
            <div class="webinar-body">
                <p>${w.description}</p>
                <div class="webinar-meta">
                    <div><strong>Speaker:</strong> ${w.speaker}</div>
                    <div><strong>Date:</strong> ${w.date}</div>
                    <div><strong>Time:</strong> ${w.time}</div>
                    <div><strong>Duration:</strong> ${w.duration} min</div>
                    <div><strong>Registered:</strong> ${w.registeredUsers} participants</div>
                </div>
            </div>
            <div class="webinar-footer">
                <button class="btn btn-primary btn-small" onclick="openRegistrationModal(${w.id})">Register</button>
                <button class="btn btn-secondary btn-small" onclick="viewDetails(${w.id})">Details</button>
            </div>
        </div>`
    ).join('');
}

function openRegistrationModal(webinarId) {
    currentWebinarId = webinarId;
    document.getElementById('registrationModal').classList.add('active');
}

function closeRegistrationModal() {
    document.getElementById('registrationModal').classList.remove('active');
    currentWebinarId = null;
}

function submitRegistration(event) {
    event.preventDefault();
    const r = {
        webinarId: currentWebinarId,
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        organization: document.getElementById('userOrg').value,
        registrationDate: new Date().toLocaleDateString()
    };
    userRegistrations.push(r);
    const w = webinars.find(x => x.id === currentWebinarId);
    if (w) { w.registeredUsers++; }
    closeRegistrationModal();
    document.getElementById('registrationModal').querySelector('form').reset();
    alert('✅ Registration successful!');
    displayUserRegistrations();
}

function displayUserRegistrations() {
    const c = document.getElementById('userRegistrations');
    if (userRegistrations.length === 0) {
        c.innerHTML = '<div class="empty-message"><p>No registrations yet</p></div>';
        return;
    }
    c.innerHTML = userRegistrations.map(reg => {
        const w = webinars.find(x => x.id === reg.webinarId);
        return `<div class="webinar-card">
            <div class="webinar-header">
                <h3>${w.title}</h3>
                <span class="webinar-category">${w.category}</span>
            </div>
            <div class="webinar-body">
                <div class="webinar-meta">
                    <div><strong>Your Name:</strong> ${reg.name}</div>
                    <div><strong>Email:</strong> ${reg.email}</div>
                    <div><strong>Organization:</strong> ${reg.organization}</div>
                    <div><strong>Registered:</strong> ${reg.registrationDate}</div>
                    <div><strong>Event Date:</strong> ${w.date} at ${w.time}</div>
                    <div><strong>Duration:</strong> ${w.duration} min</div>
                </div>
            </div>
            <div class="webinar-footer">
                <button class="btn btn-danger btn-small" onclick="unregisterEvent(${reg.webinarId},'${reg.email}')">Unregister</button>
            </div>
        </div>`;
    }).join('');
}

function unregisterEvent(webinarId, email) {
    if (confirm('Are you sure you want to unregister for this event?')) {
        userRegistrations = userRegistrations.filter(
            reg => !(reg.webinarId === webinarId && reg.email === email)
        );
        const w = webinars.find(x => x.id === webinarId);
        if (w && w.registeredUsers > 0) { w.registeredUsers--; }
        displayUserRegistrations();
        filterWebinars();
        alert('✅ You have unregistered from the event.');
    }
}

function viewDetails(webinarId) {
    const w = webinars.find(x => x.id === webinarId);
    if (!w) return;
    document.getElementById('detailsTitle').textContent = w.title;
    document.getElementById('detailsContent').innerHTML = `
        <div class="webinar-meta" style="font-size:16px;">
            <div><strong>Category:</strong> ${w.category}</div>
            <div><strong>Description:</strong></div>
            <p style="margin:10px 0;">${w.description}</p>
            <div><strong>Speaker:</strong> ${w.speaker}</div>
            <div><strong>Speaker Bio:</strong></div>
            <p style="margin:10px 0;">${w.speakerBio}</p>
            <div><strong>Date:</strong> ${w.date}</div>
            <div><strong>Time:</strong> ${w.time}</div>
            <div><strong>Duration:</strong> ${w.duration} minutes</div>
            <div><strong>Status:</strong> ${w.status}</div>
            <div><strong>Registered Participants:</strong> ${w.registeredUsers}</div>
        </div>
    `;
    document.getElementById('detailsModal').classList.add('active');
}

function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('active');
}

function editWebinar(webinarId) {
    alert('Edit feature - Webinar ID: ' + webinarId);
}

function deleteWebinar(webinarId) {
    if (confirm('Are you sure you want to delete this webinar?')) {
        webinars = webinars.filter(w => w.id !== webinarId);
        updateAdminDashboard();
        alert('✅ Webinar deleted successfully!');
    }
}

window.onclick = function (event) {
    if (event.target === document.getElementById('registrationModal')) closeRegistrationModal();
    if (event.target === document.getElementById('detailsModal')) closeDetailsModal();
};

showPage('roleSelectionPage');
