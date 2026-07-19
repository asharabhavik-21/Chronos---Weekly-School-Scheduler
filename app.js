// ==========================================================================
// Chronos Timetable - Core Logic & Controller
// ==========================================================================

// Global state
let state = {
  currentProfile: 'default',
  profiles: {
    default: {
      name: 'Grade 10 - Science',
      slots: {} // format: "day-index" => { subject, teacher, room, color }
    }
  },
  saturdayEnabled: true,
  theme: 'dark'
};

// Constant Configuration
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday'
};

const SLOT_TIMES = [
  { num: 'L1', range: '07:30 - 08:20', duration: '50 Min' },
  { num: 'L2', range: '08:20 - 09:10', duration: '50 Min' },
  { num: 'L3', range: '09:10 - 10:00', duration: '50 Min' },
  { isBreak: true, num: 'Recess', range: '10:00 - 10:30', duration: '30 Min' },
  { num: 'L4', range: '10:30 - 11:20', duration: '50 Min' },
  { num: 'L5', range: '11:20 - 12:10', duration: '50 Min' },
  { num: 'L6', range: '12:10 - 01:00', duration: '50 Min' }
];

// Premium Demo Data Template
const DEMO_PROFILES = {
  'grade-10': {
    name: 'Grade 10 - Science',
    slots: {
      // Monday
      'monday-0': { subject: 'Mathematics', teacher: 'Dr. Sarah Conner', room: 'Room 302', color: 'accent-blue' },
      'monday-1': { subject: 'Physics', teacher: 'Prof. John Doe', room: 'Lab Alpha', color: 'accent-purple' },
      'monday-2': { subject: 'Chemistry', teacher: 'Dr. Helen Cho', room: 'Lab Beta', color: 'accent-green' },
      'monday-3': { subject: 'English Lit.', teacher: 'Mrs. Daisy Miller', room: 'Room 302', color: 'accent-pink' },
      'monday-4': { subject: 'World History', teacher: 'Mr. Arthur Pendelton', room: 'Room 105', color: 'accent-orange' },
      'monday-5': { subject: 'Physical Ed.', teacher: 'Coach Vance', room: 'Gymnasium', color: 'accent-rose' },
      // Tuesday
      'tuesday-0': { subject: 'Biology', teacher: 'Dr. Robert Carter', room: 'Lab Gamma', color: 'accent-teal' },
      'tuesday-1': { subject: 'Mathematics', teacher: 'Dr. Sarah Conner', room: 'Room 302', color: 'accent-blue' },
      'tuesday-2': { subject: 'Civics & Ethics', teacher: 'Mr. Arthur Pendelton', room: 'Room 105', color: 'accent-indigo' },
      'tuesday-3': { subject: 'Chemistry', teacher: 'Dr. Helen Cho', room: 'Lab Beta', color: 'accent-green' },
      'tuesday-4': { subject: 'English Lit.', teacher: 'Mrs. Daisy Miller', room: 'Room 302', color: 'accent-pink' },
      'tuesday-5': { subject: 'Self Study / Library', teacher: 'Miss Finch', room: 'Library', color: 'accent-blue' },
      // Wednesday
      'wednesday-0': { subject: 'Computer Sci', teacher: 'Mrs. Grace Hopper', room: 'IT Lab', color: 'accent-indigo' },
      'wednesday-1': { subject: 'Geography', teacher: 'Mr. Marco Polo', room: 'Room 102', color: 'accent-orange' },
      'wednesday-2': { subject: 'Physics', teacher: 'Prof. John Doe', room: 'Lab Alpha', color: 'accent-purple' },
      'wednesday-3': { subject: 'Mathematics', teacher: 'Dr. Sarah Conner', room: 'Room 302', color: 'accent-blue' },
      'wednesday-4': { subject: 'Art & Design', teacher: 'Leonardo da Vinci', room: 'Art Studio', color: 'accent-pink' },
      'wednesday-5': { subject: 'Biology', teacher: 'Dr. Robert Carter', room: 'Lab Gamma', color: 'accent-teal' },
      // Thursday
      'thursday-0': { subject: 'Physics', teacher: 'Prof. John Doe', room: 'Lab Alpha', color: 'accent-purple' },
      'thursday-1': { subject: 'English Lit.', teacher: 'Mrs. Daisy Miller', room: 'Room 302', color: 'accent-pink' },
      'thursday-2': { subject: 'Mathematics', teacher: 'Dr. Sarah Conner', room: 'Room 302', color: 'accent-blue' },
      'thursday-3': { subject: 'World History', teacher: 'Mr. Arthur Pendelton', room: 'Room 105', color: 'accent-orange' },
      'thursday-4': { subject: 'Computer Sci', teacher: 'Mrs. Grace Hopper', room: 'IT Lab', color: 'accent-indigo' },
      'thursday-5': { subject: 'Civics & Ethics', teacher: 'Mr. Arthur Pendelton', room: 'Room 105', color: 'accent-indigo' },
      // Friday
      'friday-0': { subject: 'Chemistry', teacher: 'Dr. Helen Cho', room: 'Lab Beta', color: 'accent-green' },
      'friday-1': { subject: 'Biology', teacher: 'Dr. Robert Carter', room: 'Lab Gamma', color: 'accent-teal' },
      'friday-2': { subject: 'Mathematics', teacher: 'Dr. Sarah Conner', room: 'Room 302', color: 'accent-blue' },
      'friday-3': { subject: 'Geography', teacher: 'Mr. Marco Polo', room: 'Room 102', color: 'accent-orange' },
      'friday-4': { subject: 'Music & Choir', teacher: 'Wolfgang Mozart', room: 'Music Room', color: 'accent-rose' },
      'friday-5': { subject: 'Physical Ed.', teacher: 'Coach Vance', room: 'Gymnasium', color: 'accent-rose' },
      // Saturday
      'saturday-0': { subject: 'Physics Lab Practice', teacher: 'Prof. John Doe', room: 'Lab Alpha', color: 'accent-purple' },
      'saturday-1': { subject: 'Chemistry Lab Practice', teacher: 'Dr. Helen Cho', room: 'Lab Beta', color: 'accent-green' },
      'saturday-2': { subject: 'Biology Lab Practice', teacher: 'Dr. Robert Carter', room: 'Lab Gamma', color: 'accent-teal' },
      'saturday-3': { subject: 'Art Workshop', teacher: 'Leonardo da Vinci', room: 'Art Studio', color: 'accent-pink' },
      'saturday-4': { subject: 'Club Meet / Debate', teacher: 'Miss Finch', room: 'Auditorium', color: 'accent-indigo' },
      'saturday-5': { subject: 'Weekly Assessment', teacher: 'Dr. Sarah Conner', room: 'Auditorium', color: 'accent-blue' }
    }
  },
  'grade-11': {
    name: 'Grade 11 - Commerce',
    slots: {
      'monday-0': { subject: 'Accountancy', teacher: 'Mr. Warren Buffet', room: 'Room 401', color: 'accent-teal' },
      'monday-1': { subject: 'Business Studies', teacher: 'Mrs. Mary Parker', room: 'Room 401', color: 'accent-blue' },
      'monday-2': { subject: 'Economics', teacher: 'Dr. Adam Smith', room: 'Room 401', color: 'accent-orange' },
      'monday-3': { subject: 'English Core', teacher: 'Mrs. Daisy Miller', room: 'Room 204', color: 'accent-pink' },
      'monday-4': { subject: 'Applied Math', teacher: 'Prof. Euler', room: 'Room 401', color: 'accent-purple' },
      'monday-5': { subject: 'Physical Ed.', teacher: 'Coach Vance', room: 'Ground', color: 'accent-rose' },

      'tuesday-0': { subject: 'Economics', teacher: 'Dr. Adam Smith', room: 'Room 401', color: 'accent-orange' },
      'tuesday-1': { subject: 'Accountancy', teacher: 'Mr. Warren Buffet', room: 'Room 401', color: 'accent-teal' },
      'tuesday-2': { subject: 'Applied Math', teacher: 'Prof. Euler', room: 'Room 401', color: 'accent-purple' },
      'tuesday-3': { subject: 'Business Studies', teacher: 'Mrs. Mary Parker', room: 'Room 401', color: 'accent-blue' },
      'tuesday-4': { subject: 'Entrepreneurship', teacher: 'Mr. Musk', room: 'Room 403', color: 'accent-green' },
      'tuesday-5': { subject: 'English Core', teacher: 'Mrs. Daisy Miller', room: 'Room 204', color: 'accent-pink' }
    }
  }
};

// ==========================================================================
// Initialization & LocalStorage
// ==========================================================================

function initApp() {
  loadFromLocalStorage();
  applyTheme(state.theme);
  populateProfileSelect();
  renderGrid();
  setupEventListeners();
  showToast('Welcome back to Chronos!', 'success');
}

function loadFromLocalStorage() {
  const savedState = localStorage.getItem('chronos_timetable_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      if (parsed.profiles && Object.keys(parsed.profiles).length > 0) {
        state = parsed;
      }
    } catch (e) {
      console.error('Error parsing localStorage state, using default state.', e);
    }
  }
}

function saveToLocalStorage() {
  localStorage.setItem('chronos_timetable_state', JSON.stringify(state));
}

// ==========================================================================
// Theme Management
// ==========================================================================

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  saveToLocalStorage();
}

function toggleTheme() {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  showToast(`Switched to ${nextTheme} mode`, 'success');
}

// ==========================================================================
// Profile Management
// ==========================================================================

function populateProfileSelect() {
  const select = document.getElementById('profile-select');
  select.innerHTML = '';
  
  Object.keys(state.profiles).forEach(id => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = state.profiles[id].name;
    option.selected = id === state.currentProfile;
    select.appendChild(option);
  });
}

function changeProfile(profileId) {
  if (state.profiles[profileId]) {
    state.currentProfile = profileId;
    saveToLocalStorage();
    renderGrid();
    showToast(`Loaded profile: ${state.profiles[profileId].name}`, 'success');
  }
}

function addNewProfile(name) {
  const id = 'profile-' + Date.now();
  state.profiles[id] = {
    name: name,
    slots: {}
  };
  state.currentProfile = id;
  saveToLocalStorage();
  populateProfileSelect();
  renderGrid();
  showToast(`Profile "${name}" created!`, 'success');
}

function deleteCurrentProfile() {
  const profileIds = Object.keys(state.profiles);
  if (profileIds.length <= 1) {
    showToast('Cannot delete the only remaining profile.', 'danger');
    return;
  }

  const name = state.profiles[state.currentProfile].name;
  if (confirm(`Are you sure you want to delete profile "${name}"?`)) {
    delete state.profiles[state.currentProfile];
    
    // Switch to another profile
    const remainingIds = Object.keys(state.profiles);
    state.currentProfile = remainingIds[0];
    
    saveToLocalStorage();
    populateProfileSelect();
    renderGrid();
    showToast(`Deleted profile "${name}"`, 'danger');
  }
}

function loadDemoData() {
  state.profiles = JSON.parse(JSON.stringify(DEMO_PROFILES));
  state.currentProfile = 'grade-10';
  state.saturdayEnabled = true;
  document.getElementById('saturday-toggle').checked = true;
  
  saveToLocalStorage();
  populateProfileSelect();
  renderGrid();
  showToast('Premium demonstration data loaded!', 'success');
}

// ==========================================================================
// Render Timetable Grid
// ==========================================================================

function renderGrid() {
  const grid = document.getElementById('timetable-grid');
  grid.innerHTML = '';

  const activeDays = state.saturdayEnabled 
    ? DAYS 
    : DAYS.filter(d => d !== 'saturday');

  // Toggle grid Saturday class for column counts
  if (state.saturdayEnabled) {
    grid.classList.add('show-saturday');
  } else {
    grid.classList.remove('show-saturday');
  }

  // Row 1: Header Row
  // Corner time cell header
  const timeHeader = document.createElement('div');
  timeHeader.className = 'grid-header-cell time-header-cell';
  timeHeader.style.gridRow = '1';
  timeHeader.style.gridColumn = '1';
  timeHeader.textContent = 'Time \\ Day';
  grid.appendChild(timeHeader);

  // Day columns headers
  activeDays.forEach((day, index) => {
    const header = document.createElement('div');
    header.className = 'grid-header-cell';
    header.style.gridRow = '1';
    header.style.gridColumn = (index + 2).toString();
    header.textContent = DAY_LABELS[day];
    grid.appendChild(header);
  });

  // Rows 2-8: Time Rows (6 slots + 1 break)
  let gridRowIndex = 2; // Rows start from 2 (Row 1 is Header)
  let lectureCounter = 0; // Tracks slot indices: 0, 1, 2, 3, 4, 5

  SLOT_TIMES.forEach((slot, index) => {
    // Time Column Cell
    const timeCell = document.createElement('div');
    timeCell.className = 'time-cell';
    timeCell.style.gridRow = gridRowIndex.toString();
    timeCell.style.gridColumn = '1';
    
    if (slot.isBreak) {
      timeCell.innerHTML = `
        <span class="slot-num" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">Recess</span>
        <span class="slot-range">${slot.range}</span>
        <span class="slot-duration">${slot.duration}</span>
      `;
    } else {
      timeCell.innerHTML = `
        <span class="slot-num">${slot.num}</span>
        <span class="slot-range">${slot.range}</span>
        <span class="slot-duration">${slot.duration}</span>
      `;
    }
    grid.appendChild(timeCell);

    // Day Content Cells
    if (slot.isBreak) {
      // Break spans across all active columns
      const breakCell = document.createElement('div');
      breakCell.className = 'break-cell';
      breakCell.style.gridRow = gridRowIndex.toString();
      breakCell.style.gridColumn = `2 / -1`; // Spans dynamic columns count
      breakCell.innerHTML = `
        <div class="break-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="2" x2="6" y2="4"></line><line x1="10" y1="2" x2="10" y2="4"></line><line x1="14" y1="2" x2="14" y2="4"></line></svg>
        </div>
        <span class="break-label">Break / Recess Time</span>
        <span class="break-time">${slot.range}</span>
      `;
      grid.appendChild(breakCell);
    } else {
      // Normal lectures for each day in this row
      const currentLectureIndex = lectureCounter; // Captures state for event handler closure
      
      activeDays.forEach((day, dayIndex) => {
        const slotKey = `${day}-${currentLectureIndex}`;
        const slotData = state.profiles[state.currentProfile].slots[slotKey];
        
        const cell = document.createElement('div');
        cell.style.gridRow = gridRowIndex.toString();
        cell.style.gridColumn = (dayIndex + 2).toString();
        
        if (slotData && slotData.subject.trim()) {
          // Populated Cell
          cell.className = 'lecture-cell';
          cell.setAttribute('data-color', slotData.color || 'accent-blue');
          
          cell.innerHTML = `
            <div class="lecture-content">
              <h3 class="lecture-subject">${escapeHtml(slotData.subject)}</h3>
              <div class="lecture-details">
                <div class="lecture-detail-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span>${escapeHtml(slotData.teacher || 'No Teacher')}</span>
                </div>
                <div class="lecture-detail-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>${escapeHtml(slotData.room || 'No Room')}</span>
                </div>
              </div>
            </div>
            <div class="edit-hint" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
            </div>
          `;
        } else {
          // Empty Cell
          cell.className = 'lecture-cell empty-slot';
          cell.innerHTML = `
            <div class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <span class="empty-label">Empty Slot</span>
          `;
        }

        // Click handler to edit slot
        cell.addEventListener('click', () => openEditModal(day, currentLectureIndex));
        
        grid.appendChild(cell);
      });

      lectureCounter++; // Increments lecture index tracker
    }
    
    gridRowIndex++;
  });
}

// ==========================================================================
// Dialog / Edit Modal Controllers
// ==========================================================================

function openEditModal(day, index) {
  const modal = document.getElementById('slot-modal');
  const form = document.getElementById('slot-form');
  
  // Set tracking inputs
  document.getElementById('slot-day').value = day;
  document.getElementById('slot-index').value = index;
  
  // Title text updates
  const label = DAY_LABELS[day];
  const lectureNum = index < 3 ? (index + 1) : index; // skips break row which is slot 3 index in time, so index 3 maps to Lecture 4
  document.getElementById('modal-title').textContent = `Edit Lecture: ${label} - Lecture ${lectureNum}`;

  // Reset/Load form fields
  const slotKey = `${day}-${index}`;
  const slotData = state.profiles[state.currentProfile].slots[slotKey];
  
  if (slotData) {
    document.getElementById('input-subject').value = slotData.subject;
    document.getElementById('input-teacher').value = slotData.teacher || '';
    document.getElementById('input-room').value = slotData.room || '';
    
    // Check correct swatch radio
    const colorVal = slotData.color || 'accent-blue';
    const radio = form.querySelector(`input[name="slot-color"][value="${colorVal}"]`);
    if (radio) radio.checked = true;
    
    // Show delete button
    document.getElementById('delete-slot-btn').style.display = 'inline-flex';
  } else {
    form.reset();
    // Hide delete button for empty slots
    document.getElementById('delete-slot-btn').style.display = 'none';
  }

  // Open HTML5 dialog
  modal.showModal();
}

function closeEditModal() {
  document.getElementById('slot-modal').close();
}

function saveSlot() {
  const day = document.getElementById('slot-day').value;
  const index = document.getElementById('slot-index').value;
  const subject = document.getElementById('input-subject').value.trim();
  const teacher = document.getElementById('input-teacher').value.trim();
  const room = document.getElementById('input-room').value.trim();
  
  const form = document.getElementById('slot-form');
  const checkedColor = form.querySelector('input[name="slot-color"]:checked');
  const color = checkedColor ? checkedColor.value : 'accent-blue';

  if (!subject) {
    showToast('Subject name is required.', 'danger');
    return;
  }

  const slotKey = `${day}-${index}`;
  state.profiles[state.currentProfile].slots[slotKey] = {
    subject,
    teacher,
    room,
    color
  };

  saveToLocalStorage();
  renderGrid();
  closeEditModal();
  showToast('Lecture slot saved successfully!', 'success');
}

function clearSlot() {
  const day = document.getElementById('slot-day').value;
  const index = document.getElementById('slot-index').value;
  const slotKey = `${day}-${index}`;

  if (state.profiles[state.currentProfile].slots[slotKey]) {
    delete state.profiles[state.currentProfile].slots[slotKey];
    saveToLocalStorage();
    renderGrid();
  }
  
  closeEditModal();
  showToast('Lecture slot cleared.', 'danger');
}

// ==========================================================================
// Event Listeners Configuration
// ==========================================================================

function setupEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Profile select change
  document.getElementById('profile-select').addEventListener('change', (e) => {
    changeProfile(e.target.value);
  });

  // Profile adding
  const addProfileBtn = document.getElementById('add-profile-btn');
  const profileModal = document.getElementById('profile-modal');
  const profileForm = document.getElementById('profile-form');

  addProfileBtn.addEventListener('click', () => {
    document.getElementById('input-profile-name').value = '';
    profileModal.showModal();
  });

  document.getElementById('profile-modal-close').addEventListener('click', () => profileModal.close());
  document.getElementById('cancel-profile-btn').addEventListener('click', () => profileModal.close());

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-profile-name').value.trim();
    if (name) {
      addNewProfile(name);
      profileModal.close();
    }
  });

  // Profile deleting
  document.getElementById('delete-profile-btn').addEventListener('click', deleteCurrentProfile);

  // Saturday Toggle
  const satToggle = document.getElementById('saturday-toggle');
  satToggle.checked = state.saturdayEnabled;
  satToggle.addEventListener('change', (e) => {
    state.saturdayEnabled = e.target.checked;
    saveToLocalStorage();
    renderGrid();
    showToast(state.saturdayEnabled ? 'Saturday columns visible' : 'Saturday columns hidden', 'success');
  });

  // Demo Data button
  document.getElementById('demo-btn').addEventListener('click', loadDemoData);

  // Print button
  document.getElementById('print-btn').addEventListener('click', () => {
    window.print();
  });

  // Edit Slot modal form submissions/clicks
  document.getElementById('modal-close').addEventListener('click', closeEditModal);
  document.getElementById('cancel-modal-btn').addEventListener('click', closeEditModal);
  document.getElementById('delete-slot-btn').addEventListener('click', clearSlot);
  
  document.getElementById('slot-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents standard modal close method to ensure custom validation/toast triggers correctly
    saveSlot();
  });
}

// ==========================================================================
// Toast Alerts Helper
// ==========================================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '';
  if (type === 'success') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'danger') {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  // Dismiss toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slide-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Escapes special HTML characters to prevent XSS issues
function escapeHtml(unsafe) {
  return (unsafe || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Run on page load
window.addEventListener('DOMContentLoaded', initApp);
