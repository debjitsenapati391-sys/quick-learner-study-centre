// ===== QUICK LEARNER STUDY CENTRE - SCRIPT.JS =====

// ===== FIREBASE CONFIG =====
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db, storage, firebaseReady = false;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  storage = firebase.storage();
  firebaseReady = true;
} catch(e) {
  console.warn("Firebase not configured. Using local storage fallback.");
}

// ===== APP STATE =====
let isAdmin = false;
let currentClass = 7;
let currentSlide = 0;
let slideTimer = null;
let slides = [];
let typingIndex = 0;
let charIndex = 0;
let typingTimer = null;
let galleryData = [];
let notifData = [];
let resultsData = [];
let studentsData = [];
let scheduleData = {};
let contactData = {};
let aboutText = '';
let notesData = {};
let testData = {};

const ADMIN_PASSWORD = "admin@12345";
const TYPING_TEXTS = [
  "Best Study Centre...",
  "Makes Your Future!",
  "Let's Study Together!",
  "Learn Today, Lead Tomorrow!",
  "Quality Education For All."
];

// ===== LOCAL STORAGE HELPERS =====
function saveLocal(key, data) {
  try { localStorage.setItem('qlsc_' + key, JSON.stringify(data)); } catch(e) {}
}
function loadLocal(key, def) {
  try {
    const d = localStorage.getItem('qlsc_' + key);
    return d ? JSON.parse(d) : def;
  } catch(e) { return def; }
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  loadAllData();
  setTimeout(() => {
    document.getElementById('noticePopup').style.display = 'flex';
  }, 1000);
  createParticles();
  setupDragDrop();
});

function loadAllData() {
  galleryData = loadLocal('gallery', []);
  notifData = loadLocal('notifications', [
    { id: 1, title: 'Physics Test Series - 03', msg: 'New test series is available for Class 11 & 12', date: '29 May, 2025', pdf: null },
    { id: 2, title: 'New Notes Uploaded', msg: 'Class 10 All Subject Notes have been uploaded', date: '18 May, 2025', pdf: null }
  ]);
  resultsData = loadLocal('results', [
    { id: 1, name: 'Rahul Das', class: '10', subject: 'Math', score: '92/100' },
    { id: 2, name: 'Priya Sen', class: '10', subject: 'Math', score: '87/100' },
    { id: 3, name: 'Amit Roy', class: '10', subject: 'Science', score: '78/100' }
  ]);
  studentsData = loadLocal('students', []);
  scheduleData = loadLocal('schedule', {
    Mon: { subject: 'Mathematics', time: '4–5 PM' },
    Tue: { subject: 'Science', time: '4–5 PM' },
    Wed: { subject: 'English', time: '4–5 PM' },
    Thu: { subject: 'Mathematics', time: '5–6 PM' },
    Fri: { subject: 'Science', time: '5–6 PM' },
    Sat: { subject: 'Revision', time: '4–6 PM' }
  });
  contactData = loadLocal('contact', {
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    facebook: 'https://facebook.com/yourpage',
    instagram: 'https://instagram.com/yourpage',
    twitter: 'https://twitter.com/yourpage',
    linkedin: 'https://linkedin.com/company/yourpage'
  });
  aboutText = loadLocal('about', 'Quick Learner Study Centre is committed to providing quality education for students from Class 7 to 12. Our experienced teachers, regular tests, doubt clearing sessions and updated study materials help students achieve their goals and build a strong future.');
  notesData = loadLocal('notes', {});
  testData = loadLocal('tests', {});
}

// ===== POPUP =====
function closePopup() {
  document.getElementById('noticePopup').style.display = 'none';
}

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation-duration:${Math.random()*20+10}s;
      animation-delay:${Math.random()*10}s;
      opacity:${Math.random()*0.4+0.1};
    `;
    container.appendChild(p);
  }
}

// ===== LOGIN =====
function loginAsStudent() {
  isAdmin = false;
  showApp();
  document.getElementById('userBadge').textContent = 'Student';
  document.getElementById('userBadge').style.background = '#dbeafe';
  document.getElementById('userBadge').style.color = '#1e40af';
  hideAdminElements();
  // Add register link to nav
  addRegisterNav();
}

function loginAsAdmin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === ADMIN_PASSWORD) {
    isAdmin = true;
    showApp();
    document.getElementById('userBadge').textContent = 'Admin';
    document.getElementById('userBadge').style.background = '#ede9fe';
    document.getElementById('userBadge').style.color = '#4c1d95';
    showAdminElements();
    addAdminNav();
    showToast('Welcome, Admin!', 'success');
  } else {
    showToast('Wrong password! Try admin@12345', 'error');
    document.getElementById('adminPass').style.borderColor = '#dc2626';
    setTimeout(() => document.getElementById('adminPass').style.borderColor = '', 2000);
  }
}

function addRegisterNav() {
  const links = document.getElementById('navLinks');
  if (!document.querySelector('[data-section="register"]')) {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.setAttribute('data-section', 'register');
    a.innerHTML = '<i class="fas fa-user-plus"></i> Register';
    a.onclick = () => showSection('register');
    links.appendChild(a);
  }
}

function addAdminNav() {
  const links = document.getElementById('navLinks');
  if (!document.querySelector('[data-section="adminPanel"]')) {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.setAttribute('data-section', 'adminPanel');
    a.innerHTML = '<i class="fas fa-cogs"></i> Admin';
    a.onclick = () => showSection('adminPanel');
    links.appendChild(a);
  }
  addRegisterNav();
}

function showApp() {
  document.getElementById('loginPage').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  initHome();
}

function logout() {
  isAdmin = false;
  clearInterval(slideTimer);
  clearTimeout(typingTimer);
  document.getElementById('mainApp').classList.remove('active');
  document.getElementById('loginPage').classList.add('active');
  document.getElementById('adminPass').value = '';
}

function togglePass() {
  const inp = document.getElementById('adminPass');
  const icon = document.getElementById('eyeIcon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

// ===== ADMIN VISIBILITY =====
function showAdminElements() {
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
  document.getElementById('adminNotesUpload').style.display = 'block';
  document.getElementById('adminTestUpload').style.display = 'block';
  document.getElementById('adminGalleryUpload').style.display = 'block';
  document.getElementById('adminAboutPanel').style.display = 'block';
  document.getElementById('adminContactPanel').style.display = 'block';
  document.getElementById('adminNotifPanel').style.display = 'block';
  document.getElementById('adminResultsPanel').style.display = 'block';
  document.getElementById('adminScheduleBtn').style.display = 'block';
  document.getElementById('adminSliderControl').style.display = 'block';
  document.getElementById('adminStudentList').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'block';
}

function hideAdminElements() {
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
}

// ===== NAVIGATION =====
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const sec = document.getElementById(name);
  if (sec) {
    sec.classList.add('active');
    if (isAdmin) sec.style.display = 'block';
  }
  const link = document.querySelector(`[data-section="${name}"]`);
  if (link) link.classList.add('active');
  // Render content for section
  if (name === 'home') renderHome();
  if (name === 'classes') renderClasses();
  if (name === 'gallery') renderGallery();
  if (name === 'notification') renderNotifications();
  if (name === 'results') renderResults();
  if (name === 'about') renderAbout();
  if (name === 'contact') renderContact();
  if (name === 'register') renderStudentList();
  if (name === 'schedule') renderSchedule();
  // Close mobile nav
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo(0, 0);
}

function toggleMobileNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ===== THEME =====
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('themeIcon');
  icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
  saveLocal('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Apply saved theme
(function() {
  const t = loadLocal('theme', 'light');
  if (t === 'dark') {
    document.body.classList.add('dark-mode');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = 'fas fa-sun';
  }
})();

// ===== HOME =====
function initHome() {
  renderHome();
  startTyping();
  initSlider();
  animateStats();
}

function renderHome() {
  renderHomeNotifs();
  updateNotifBadge();
  renderSchedule();
  renderContact();
  renderAbout();
}

function renderHomeNotifs() {
  const container = document.getElementById('homeNotifList');
  if (!container) return;
  const recent = notifData.slice(0, 3);
  container.innerHTML = recent.length ? recent.map(n => `
    <div class="home-notif-item">
      <div class="notif-dot-anim"></div>
      <div>
        <div class="home-notif-title">${n.title}</div>
        <div class="home-notif-sub">${n.date || ''}</div>
      </div>
    </div>
  `).join('') : '<p style="color:var(--text3);font-size:13px">No notifications yet.</p>';
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  badge.textContent = notifData.length;
  badge.className = notifData.length > 0 ? 'notif-badge' : 'notif-badge zero';
}

// ===== TYPING EFFECT =====
function startTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  clearTimeout(typingTimer);
  const text = TYPING_TEXTS[typingIndex];
  if (charIndex <= text.length) {
    el.textContent = text.substring(0, charIndex) + '|';
    charIndex++;
    typingTimer = setTimeout(startTyping, 100);
  } else {
    setTimeout(() => {
      eraseTyping();
    }, 1800);
  }
}

function eraseTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const text = TYPING_TEXTS[typingIndex];
  if (charIndex > 0) {
    el.textContent = text.substring(0, charIndex - 1) + '|';
    charIndex--;
    typingTimer = setTimeout(eraseTyping, 60);
  } else {
    typingIndex = (typingIndex + 1) % TYPING_TEXTS.length;
    typingTimer = setTimeout(startTyping, 400);
  }
}

// ===== SLIDER =====
function initSlider() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  slides = Array.from(track.children);
  renderDots();
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 4000);
}

function renderDots() {
  const dotsContainer = document.getElementById('slideDots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = slides.map((_, i) =>
    `<div class="dot ${i === currentSlide ? 'active' : ''}" onclick="goToSlide(${i})"></div>`
  ).join('');
}

function goToSlide(index) {
  currentSlide = index;
  const track = document.getElementById('sliderTrack');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  renderDots();
}

function nextSlide() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  const total = track.children.length;
  currentSlide = (currentSlide + 1) % total;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  renderDots();
}

function prevSlide() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  const total = track.children.length;
  currentSlide = (currentSlide - 1 + total) % total;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  renderDots();
}

function openSliderAdmin() { document.getElementById('sliderModal').style.display = 'flex'; }
function closeSliderModal() { document.getElementById('sliderModal').style.display = 'none'; }

function addSliderMedia(input) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const track = document.getElementById('sliderTrack');
  const slide = document.createElement('div');
  slide.className = 'slide';
  if (file.type.startsWith('video')) {
    slide.innerHTML = `<video src="${url}" autoplay muted loop playsinline></video><div class="slide-text">${file.name}</div>`;
  } else {
    slide.innerHTML = `<img src="${url}" alt="${file.name}"><div class="slide-text">${file.name}</div>`;
  }
  track.appendChild(slide);
  slides = Array.from(track.children);
  renderDots();
  closeSliderModal();
  showToast('Slider media added!', 'success');
}

// ===== STATS ANIMATION =====
function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    if (!target) return;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + (target > 100 ? '+' : '');
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

// ===== CLASSES =====
function selectClass(num, btn) {
  currentClass = num;
  document.querySelectorAll('.class-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderClasses();
}

function renderClasses() {
  renderNotesList();
  renderTestList();
  renderSchedule();
}

function renderNotesList() {
  const container = document.getElementById('notesList');
  if (!container) return;
  const notes = notesData[currentClass] || [];
  container.innerHTML = notes.length ? notes.map((n, i) => `
    <div class="note-item">
      <i class="fas fa-file-pdf"></i>
      <a href="${n.url}" target="_blank" download="${n.name}">${n.name}</a>
      <div class="note-actions">
        <a href="${n.url}" target="_blank" download="${n.name}" title="Download">
          <button class="btn-sm" style="padding:5px 10px"><i class="fas fa-download"></i></button>
        </a>
        ${isAdmin ? `<button class="btn-danger" onclick="deleteNote(${i})" title="Delete"><i class="fas fa-trash"></i></button>` : ''}
      </div>
    </div>
  `).join('') : '<p style="color:var(--text3);font-size:13px;padding:8px">No notes uploaded yet.</p>';
}

function uploadNotesPDF(input) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  if (!notesData[currentClass]) notesData[currentClass] = [];
  notesData[currentClass].push({ name: file.name, url: url, type: 'pdf' });
  saveLocal('notes', notesData);
  renderNotesList();
  showToast('PDF uploaded!', 'success');
}

function saveDriveLink() {
  const link = document.getElementById('driveLink').value.trim();
  if (!link) return showToast('Please enter a link', 'error');
  if (!notesData[currentClass]) notesData[currentClass] = [];
  notesData[currentClass].push({ name: 'Google Drive - Class ' + currentClass, url: link, type: 'drive' });
  saveLocal('notes', notesData);
  document.getElementById('driveLink').value = '';
  renderNotesList();
  showToast('Drive link saved!', 'success');
}

function deleteNote(index) {
  if (!notesData[currentClass]) return;
  notesData[currentClass].splice(index, 1);
  saveLocal('notes', notesData);
  renderNotesList();
  showToast('Note deleted', 'success');
}

function renderTestList() {
  const container = document.getElementById('testSeriesList');
  if (!container) return;
  const tests = testData[currentClass] || [];
  container.innerHTML = tests.length ? tests.map((t, i) => `
    <div class="test-item">
      <div class="test-item-name"><i class="fas fa-pen-to-square" style="color:var(--primary)"></i> ${t.name}</div>
      <div class="test-item-actions">
        <a href="${t.link}" target="_blank" class="btn-sm"><i class="fas fa-external-link-alt"></i> Open Test</a>
        ${isAdmin ? `<button class="btn-danger" onclick="deleteTest(${i})"><i class="fas fa-trash"></i></button>` : ''}
      </div>
    </div>
  `).join('') : '<p style="color:var(--text3);font-size:13px;padding:8px">No test series added yet.</p>';
}

function saveTestSeries() {
  const name = document.getElementById('testSeriesName').value.trim();
  const link = document.getElementById('testFormLink').value.trim();
  if (!name || !link) return showToast('Please fill all fields', 'error');
  if (!testData[currentClass]) testData[currentClass] = [];
  testData[currentClass].push({ name, link });
  saveLocal('tests', testData);
  document.getElementById('testSeriesName').value = '';
  document.getElementById('testFormLink').value = '';
  renderTestList();
  showToast('Test series added!', 'success');
}

function deleteTest(index) {
  if (!testData[currentClass]) return;
  testData[currentClass].splice(index, 1);
  saveLocal('tests', testData);
  renderTestList();
  showToast('Test deleted', 'success');
}

// ===== SCHEDULE =====
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function renderSchedule() {
  const container = document.getElementById('scheduleGrid');
  if (!container) return;
  container.innerHTML = DAYS.map(day => {
    const d = scheduleData[day] || { subject: '—', time: '—' };
    return `
      <div class="schedule-day">
        <div class="schedule-day-name">${day}</div>
        <div class="schedule-subject">${d.subject}</div>
        <div class="schedule-time">${d.time}</div>
      </div>
    `;
  }).join('');
}

function openScheduleEditor() {
  const body = document.getElementById('scheduleEditorBody');
  body.innerHTML = DAYS.map(day => {
    const d = scheduleData[day] || { subject: '', time: '' };
    return `
      <div class="schedule-editor-row">
        <label>${day}</label>
        <input type="text" id="sch-sub-${day}" placeholder="Subject" value="${d.subject}" style="font-size:13px">
        <input type="text" id="sch-time-${day}" placeholder="Time" value="${d.time}" style="font-size:13px;width:90px">
      </div>
    `;
  }).join('');
  document.getElementById('scheduleModal').style.display = 'flex';
}

function closeScheduleModal() {
  document.getElementById('scheduleModal').style.display = 'none';
}

function saveSchedule() {
  DAYS.forEach(day => {
    scheduleData[day] = {
      subject: document.getElementById(`sch-sub-${day}`)?.value || '',
      time: document.getElementById(`sch-time-${day}`)?.value || ''
    };
  });
  saveLocal('schedule', scheduleData);
  closeScheduleModal();
  renderSchedule();
  showToast('Schedule saved!', 'success');
}

// ===== GALLERY =====
function renderGallery(filter = 'all') {
  const container = document.getElementById('galleryGrid');
  if (!container) return;
  const filtered = filter === 'all' ? galleryData : galleryData.filter(g => g.type === filter);
  container.innerHTML = filtered.length ? filtered.map((g, i) => `
    <div class="gallery-item" data-type="${g.type}">
      ${g.type === 'video'
        ? `<video src="${g.url}" muted loop></video>`
        : `<img src="${g.url}" alt="Gallery" loading="lazy">`}
      <div class="gallery-item-overlay">
        <button onclick="openLightbox('${g.url}', '${g.type}')" title="View"><i class="fas fa-expand"></i></button>
        ${isAdmin ? `<button onclick="deleteGallery(${i})" title="Delete" style="color:var(--danger)"><i class="fas fa-trash"></i></button>` : ''}
      </div>
    </div>
  `).join('') : `<p style="color:var(--text3);font-size:13px;grid-column:1/-1">No ${filter === 'all' ? '' : filter + ' '}items yet.</p>`;
  setupGalleryHover();
}

function filterGallery(type, btn) {
  document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderGallery(type);
}

function uploadGallery(input) {
  const files = Array.from(input.files);
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    galleryData.push({ url, type: file.type.startsWith('video') ? 'video' : 'photo', name: file.name });
  });
  saveLocal('gallery', galleryData);
  renderGallery();
  showToast(`${files.length} item(s) uploaded!`, 'success');
}

function deleteGallery(index) {
  galleryData.splice(index, 1);
  saveLocal('gallery', galleryData);
  renderGallery();
  showToast('Item deleted', 'success');
}

function setupGalleryHover() {
  document.querySelectorAll('.gallery-item video').forEach(v => {
    v.closest('.gallery-item').addEventListener('mouseenter', () => v.play());
    v.closest('.gallery-item').addEventListener('mouseleave', () => v.pause());
  });
}

function openLightbox(url, type) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (type === 'photo') {
    img.src = url;
    img.style.display = 'block';
  }
  lb.style.display = 'flex';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.getElementById('lightboxImg').src = '';
}

// ===== NOTIFICATIONS =====
function renderNotifications() {
  const container = document.getElementById('notificationList');
  if (!container) return;
  container.innerHTML = notifData.length ? notifData.map((n, i) => `
    <div class="notif-item-card">
      <div class="notif-item-header">
        <div class="notif-item-dot-row">
          <div class="notif-dot-anim"></div>
          <div class="notif-item-title">${n.title}</div>
        </div>
        ${isAdmin ? `
          <div class="notif-item-actions">
            <button class="btn-danger" onclick="deleteNotification(${i})"><i class="fas fa-trash"></i></button>
          </div>
        ` : ''}
      </div>
      <div class="notif-item-msg">${n.msg}</div>
      ${n.pdf ? `<a class="notif-pdf-link" href="${n.pdf}" target="_blank" download><i class="fas fa-file-pdf"></i> Download PDF</a>` : ''}
      <div class="notif-item-date">${n.date || ''}</div>
    </div>
  `).join('') : '<p style="color:var(--text3);font-size:13px">No notifications yet.</p>';
  renderHomeNotifs();
  updateNotifBadge();
}

function addNotification() {
  const title = document.getElementById('notifTitle').value.trim();
  const msg = document.getElementById('notifMsg').value.trim();
  if (!title || !msg) return showToast('Please fill all fields', 'error');
  const pdfInput = document.getElementById('notifPDF');
  let pdfUrl = null;
  if (pdfInput.files[0]) pdfUrl = URL.createObjectURL(pdfInput.files[0]);
  const notif = {
    id: Date.now(),
    title, msg,
    pdf: pdfUrl,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  };
  notifData.unshift(notif);
  saveLocal('notifications', notifData);
  document.getElementById('notifTitle').value = '';
  document.getElementById('notifMsg').value = '';
  pdfInput.value = '';
  renderNotifications();
  showToast('Notification sent!', 'success');
}

function deleteNotification(index) {
  notifData.splice(index, 1);
  saveLocal('notifications', notifData);
  renderNotifications();
  showToast('Notification deleted', 'success');
}

// ===== RESULTS =====
function renderResults() {
  const container = document.getElementById('resultsList');
  if (!container) return;
  const filter = document.getElementById('resultClassFilter')?.value || 'all';
  const filtered = filter === 'all' ? resultsData : resultsData.filter(r => r.class === filter);
  container.innerHTML = filtered.length ? filtered.map((r, i) => `
    <div class="result-item">
      <div class="result-info">
        <div class="result-name">${r.name}</div>
        <div class="result-meta">Class ${r.class} — ${r.subject}</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <div class="result-score">${r.score}</div>
        ${isAdmin ? `
          <div class="result-actions">
            <button class="btn-danger" onclick="deleteResult(${i})"><i class="fas fa-trash"></i></button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('') : '<p style="color:var(--text3);font-size:13px">No results found.</p>';
}

function filterResults() { renderResults(); }

function addResult() {
  const name = document.getElementById('resultName').value.trim();
  const cls = document.getElementById('resultClass').value;
  const subject = document.getElementById('resultSubject').value.trim();
  const score = document.getElementById('resultScore').value.trim();
  if (!name || !subject || !score) return showToast('Please fill all fields', 'error');
  resultsData.unshift({ id: Date.now(), name, class: cls, subject, score });
  saveLocal('results', resultsData);
  document.getElementById('resultName').value = '';
  document.getElementById('resultSubject').value = '';
  document.getElementById('resultScore').value = '';
  renderResults();
  showToast('Result added!', 'success');
}

function deleteResult(index) {
  resultsData.splice(index, 1);
  saveLocal('results', resultsData);
  renderResults();
  showToast('Result deleted', 'success');
}

// ===== ABOUT =====
function renderAbout() {
  const el = document.getElementById('aboutText');
  if (el) el.textContent = aboutText;
  const editor = document.getElementById('aboutEditor');
  if (editor) editor.value = aboutText;
}

function saveAbout() {
  aboutText = document.getElementById('aboutEditor').value;
  saveLocal('about', aboutText);
  renderAbout();
  showToast('About section saved!', 'success');
}

// ===== CONTACT =====
function renderContact() {
  const fields = ['phone', 'whatsapp', 'facebook', 'instagram', 'twitter', 'linkedin'];
  fields.forEach(f => {
    const el = document.getElementById('cv-' + f);
    if (!el) return;
    const val = contactData[f] || '';
    if (f === 'phone') el.textContent = val;
    else if (f === 'whatsapp') {
      el.href = 'https://wa.me/' + val.replace(/\D/g, '');
      el.textContent = val;
    } else {
      el.href = val;
      el.textContent = val.replace('https://', '').replace('http://', '');
    }
    const inp = document.getElementById('cf-' + f);
    if (inp) inp.value = val;
  });
  // WhatsApp float button
  const waBtn = document.getElementById('waFloat');
  if (waBtn && contactData.whatsapp) {
    waBtn.href = 'https://wa.me/' + contactData.whatsapp.replace(/\D/g, '');
  }
}

function saveContact() {
  const fields = ['phone', 'whatsapp', 'facebook', 'instagram', 'twitter', 'linkedin'];
  fields.forEach(f => {
    const el = document.getElementById('cf-' + f);
    if (el) contactData[f] = el.value.trim();
  });
  saveLocal('contact', contactData);
  renderContact();
  showToast('Contact info saved!', 'success');
}

// ===== STUDENT REGISTRATION =====
function registerStudent() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const cls = document.getElementById('regClass').value;
  const school = document.getElementById('regSchool').value.trim();
  const parentPhone = document.getElementById('regParentPhone').value.trim();
  if (!name || !phone || !cls) return showToast('Please fill required fields (*)', 'error');
  studentsData.push({
    id: Date.now(), name, phone, class: cls, school, parentPhone,
    date: new Date().toLocaleDateString('en-IN')
  });
  saveLocal('students', studentsData);
  document.getElementById('regName').value = '';
  document.getElementById('regPhone').value = '';
  document.getElementById('regClass').value = '';
  document.getElementById('regSchool').value = '';
  document.getElementById('regParentPhone').value = '';
  renderStudentList();
  showToast('Registration successful! Welcome to Quick Learner!', 'success');
}

function renderStudentList() {
  const container = document.getElementById('studentsList');
  if (!container) return;
  container.innerHTML = studentsData.length ? studentsData.map((s, i) => `
    <div class="student-item">
      <div>
        <div class="student-name">${s.name}</div>
        <div class="student-meta">Class ${s.class} | ${s.phone} | ${s.school || '—'}</div>
      </div>
      ${isAdmin ? `<button class="btn-danger" onclick="deleteStudent(${i})"><i class="fas fa-trash"></i></button>` : ''}
    </div>
  `).join('') : '<p style="color:var(--text3);font-size:13px">No registered students yet.</p>';
}

function deleteStudent(index) {
  studentsData.splice(index, 1);
  saveLocal('students', studentsData);
  renderStudentList();
  showToast('Student removed', 'success');
}

// ===== DRAG & DROP =====
function setupDragDrop() {
  setupDrop('notesDropZone', (file) => {
    if (!file.name.endsWith('.pdf')) return showToast('Only PDF files allowed', 'error');
    const url = URL.createObjectURL(file);
    if (!notesData[currentClass]) notesData[currentClass] = [];
    notesData[currentClass].push({ name: file.name, url, type: 'pdf' });
    saveLocal('notes', notesData);
    renderNotesList();
    showToast('PDF uploaded!', 'success');
  });
  setupDrop('galleryDropZone', (file) => {
    const url = URL.createObjectURL(file);
    galleryData.push({ url, type: file.type.startsWith('video') ? 'video' : 'photo', name: file.name });
    saveLocal('gallery', galleryData);
    renderGallery();
    showToast('File uploaded!', 'success');
  });
  setupDrop('sliderDropZone', (file) => { addSliderMedia({ files: [file] }); });
  setupDrop('notifDropZone', (file) => { showToast('PDF attached', 'success'); });
}

function setupDrop(id, cb) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('dragover'); });
  el.addEventListener('dragleave', () => el.classList.remove('dragover'));
  el.addEventListener('drop', e => {
    e.preventDefault(); el.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) cb(file);
  });
}

// ===== TOAST =====
function showToast(msg, type = 'default') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '0', 2500);
  setTimeout(() => toast.remove(), 2800);
}

// ===== KEYBOARD =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSliderModal();
    closeScheduleModal();
    closeLightbox();
    closePopup();
    document.getElementById('navLinks').classList.remove('open');
  }
});