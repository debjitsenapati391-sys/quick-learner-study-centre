// State Management
let currentUserRole = null; // 'admin' or 'student'

// Dummy Data for Slider
let sliderImages = [
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=400"
];

// Initialize Website
document.addEventListener("DOMContentLoaded", () => {
    loadSlider();
});

// Login Logic
function loginAs(role) {
    if (role === 'admin') {
        const pass = document.getElementById('admin-pass').value;
        if (pass !== 'admin@12345') {
            alert('Incorrect Admin Password!');
            return;
        }
    }

    currentUserRole = role;
    
    // Switch Pages
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('login-page').classList.add('hidden');
    
    document.getElementById('dashboard-page').classList.remove('hidden');
    document.getElementById('dashboard-page').classList.add('active');

    // Update UI based on Role
    const body = document.body;
    if (role === 'admin') {
        body.classList.add('admin-mode');
        body.classList.remove('student-mode');
        document.getElementById('user-role-display').innerText = "Admin Panel";
    } else {
        body.classList.add('student-mode');
        body.classList.remove('admin-mode');
        document.getElementById('user-role-display').innerText = "Student Dashboard";
    }
}

// Logout Logic
function logout() {
    currentUserRole = null;
    document.body.className = ''; // reset classes
    
    document.getElementById('dashboard-page').classList.remove('active');
    document.getElementById('dashboard-page').classList.add('hidden');
    
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('login-page').classList.add('active');
    
    document.getElementById('admin-pass').value = '';
}

// Tab Switching Logic
function switchTab(tabId) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
    });

    // Show target tab
    document.getElementById(tabId).classList.remove('hidden');
    document.getElementById(tabId).classList.add('active');

    // Update Sidebar Active Class
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Close sidebar on mobile after clicking
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

// Mobile Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

// Load Slider Images
function loadSlider() {
    const container = document.getElementById('slider-container');
    container.innerHTML = ''; // clear existing
    
    sliderImages.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        container.appendChild(img);
    });
}

// Add New Image to Slider (Admin Only)
function addSliderImage() {
    const input = document.getElementById('new-slider-url');
    if (input.value.trim() !== '') {
        sliderImages.push(input.value);
        loadSlider(); // refresh slider
        input.value = ''; // clear input
        alert('Image Added Successfully!');
    } else {
        alert('Please paste a valid image URL');
    }
}

// Notification Red Dot Logic (Example)
// You can call this when a new notice is uploaded
function triggerNewNotification() {
    document.getElementById('notif-badge').style.display = 'block';
}
// Call this when student opens the notification tab
function clearNotification() {
    document.getElementById('notif-badge').style.display = 'none';
}
// Switch Classes Logic
function switchClass(classId) {
    // ১. প্রথমে সব ক্লাস বাটন থেকে active ক্লাস সরিয়ে দিন
    const classBtns = document.querySelectorAll('.class-btn');
    classBtns.forEach(btn => btn.classList.remove('active'));
    
    // ২. যেই বাটনে ক্লিক করা হয়েছে, সেটাকে active করুন
    event.currentTarget.classList.add('active');

    // ৩. সব ক্লাসের কনটেন্ট হাইড (hide) করে দিন
    const classContents = document.querySelectorAll('.class-content-area');
    classContents.forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
    });

    // ৪. যেই ক্লাস সিলেক্ট করা হয়েছে, শুধু তার কনটেন্ট শো (show) করুন
    document.getElementById(classId).classList.remove('hidden');
    document.getElementById(classId).classList.add('active');
}